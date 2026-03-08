'use server'

import { createClient } from '@/lib/supabase/server'
import * as Sentry from '@sentry/nextjs'

interface SignupData {
  firstName: string
  middleName?: string
  lastName: string
  birthdate: string
  phone: string
  address: {
    province: string
    city: string
    barangay: string
    zipCode: string
    houseStreet: string
  }
  pin: string
  proofOfBillingFile: File
}

export async function signupMember(data: SignupData) {
  try {
    const supabase = await createClient()

    // 1. Send OTP first (before creating user)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: `+63${data.phone}`,
      options: {
        channel: 'sms',
      },
    })

    if (otpError) {
      console.error('OTP send error:', otpError)
      
      // Provide user-friendly error messages
      if (otpError.message.includes('rate limit')) {
        return { error: 'Too many requests. Please wait a few minutes before trying again.' }
      }
      if (otpError.message.includes('invalid phone')) {
        return { error: 'Invalid phone number format. Please check and try again.' }
      }
      
      return { error: otpError.message }
    }

    // 2. Upload document to Supabase Storage using service role to bypass RLS
    // Create a service role client for file upload
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials')
      return { error: 'Server configuration error. Please contact support.' }
    }
    
    const supabaseService = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const fileExt = data.proofOfBillingFile.name.split('.').pop()
    const tempFileName = `temp/${data.phone}/proof_of_billing_${Date.now()}.${fileExt}`
    
    console.log('Attempting to upload file:', tempFileName)
    
    const { data: uploadData, error: uploadError } = await supabaseService.storage
      .from('member-documents')
      .upload(tempFileName, data.proofOfBillingFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error details:', {
        message: uploadError.message,
        name: uploadError.name,
        cause: uploadError.cause,
      })
      return { error: `Failed to upload document: ${uploadError.message}` }
    }

    console.log('Upload successful:', uploadData)

    // Get public URL
    const { data: urlData } = supabaseService.storage
      .from('member-documents')
      .getPublicUrl(tempFileName)

    // Return success - user will verify OTP in next step
    // We'll create the actual user account after OTP verification
    return {
      success: true,
      message: 'OTP sent to your phone number. Please verify to continue.',
      tempData: {
        phone: data.phone,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        birthdate: data.birthdate,
        address: data.address,
        fileUrl: urlData.publicUrl,
        fileName: data.proofOfBillingFile.name,
        fileSize: data.proofOfBillingFile.size,
        mimeType: data.proofOfBillingFile.type,
        tempFileName: tempFileName, // Store for later cleanup
      },
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    Sentry.captureException(error, {
      tags: { action: 'signupMember' },
    })
    return { error: error.message || 'An unexpected error occurred' }
  }
}

// New function to complete signup after OTP verification
export async function completeSignup(tempData: any, pin: string) {
  try {
    const supabase = await createClient()

    // Get the authenticated user (should be authenticated after OTP verification)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'Please verify your phone number first' }
    }

    // 3. Get a default center for new signups
    const { data: defaultCenter } = await supabase
      .from('centers')
      .select('id')
      .eq('code', 'PENDING')
      .single()

    let centerId = defaultCenter?.id

    if (!centerId) {
      const { data: anyCenter } = await supabase
        .from('centers')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .single()
      
      centerId = anyCenter?.id
    }

    if (!centerId) {
      return { error: 'No center available for assignment. Please contact support.' }
    }

    const fullAddress = `${tempData.address.houseStreet}, ${tempData.address.barangay}, ${tempData.address.city}, ${tempData.address.province} ${tempData.address.zipCode}`

    // 4. Create member record
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .insert({
        center_id: centerId,
        first_name: tempData.firstName,
        middle_name: tempData.middleName,
        last_name: tempData.lastName,
        date_of_birth: tempData.birthdate,
        phone: `+63${tempData.phone}`,
        address: fullAddress,
      })
      .select()
      .single()

    if (memberError) {
      console.error('Member creation failed:', memberError)
      return { error: `Failed to create member: ${memberError.message}` }
    }

    // 5. Move file to permanent location
    const fileExt = tempData.fileName.split('.').pop()
    const permanentFileName = `${user.id}/proof_of_billing_${Date.now()}.${fileExt}`

    // Copy file to permanent location using service role
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const supabaseService = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { error: moveError } = await supabaseService.storage
      .from('member-documents')
      .move(tempData.tempFileName, permanentFileName)

    if (moveError) {
      console.error('File move failed:', moveError)
      // Don't fail the whole signup, just log it
      Sentry.captureException(moveError, {
        tags: { action: 'completeSignup', step: 'file_move' },
      })
    }

    // Get new public URL
    const { data: newUrlData } = supabase.storage
      .from('member-documents')
      .getPublicUrl(permanentFileName)

    // 6. Create document record
    const { error: docError } = await supabase
      .from('member_documents')
      .insert({
        member_id: memberData.id,
        document_type: 'proof_of_billing',
        file_name: tempData.fileName,
        file_url: newUrlData.publicUrl,
        file_size: tempData.fileSize,
        mime_type: tempData.mimeType,
        status: 'pending',
        uploaded_by: user.id,
      })

    if (docError) {
      console.error('Document record creation failed:', docError)
      Sentry.captureException(docError, {
        tags: { action: 'completeSignup', step: 'document_record' },
      })
    }

    return {
      success: true,
      userId: user.id,
      memberId: memberData.id,
      message: 'Account created successfully!',
    }
  } catch (error: any) {
    console.error('Complete signup error:', error)
    Sentry.captureException(error, {
      tags: { action: 'completeSignup' },
    })
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function verifyOTP(phone: string, token: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+63${phone}`,
      token,
      type: 'sms',
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, session: data.session }
  } catch (error: any) {
    console.error('OTP verification error:', error)
    Sentry.captureException(error, {
      tags: { action: 'verifyOTP' },
    })
    return { error: error.message || 'Failed to verify OTP' }
  }
}

export async function resendOTP(phone: string) {
  try {
    const supabase = await createClient()

    // Send OTP via Supabase (which uses Twilio configured in dashboard)
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+63${phone}`,
      options: {
        channel: 'sms', // Explicitly use SMS channel
      },
    })

    if (error) {
      console.error('Resend OTP error:', error)
      
      // Provide user-friendly error messages
      if (error.message.includes('rate limit')) {
        return { error: 'Too many requests. Please wait a few minutes before trying again.' }
      }
      if (error.message.includes('invalid phone')) {
        return { error: 'Invalid phone number format. Please check and try again.' }
      }
      
      return { error: error.message }
    }

    return { success: true, message: 'OTP sent successfully' }
  } catch (error: any) {
    console.error('Resend OTP error:', error)
    Sentry.captureException(error, {
      tags: { action: 'resendOTP' },
    })
    return { error: error.message || 'Failed to resend OTP' }
  }
}
