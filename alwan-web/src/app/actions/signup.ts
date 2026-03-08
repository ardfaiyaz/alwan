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

    // 1. Create auth user with phone
    const { data: authData, error: authError } = await supabase.auth.signUp({
      phone: `+63${data.phone}`,
      password: data.pin, // In production, use a more secure password
      options: {
        data: {
          full_name: `${data.firstName} ${data.middleName || ''} ${data.lastName}`.trim(),
        },
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user' }
    }

    // 2. Upload document to Supabase Storage
    const fileExt = data.proofOfBillingFile.name.split('.').pop()
    const fileName = `${authData.user.id}/proof_of_billing_${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('member-documents')
      .upload(fileName, data.proofOfBillingFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      // Cleanup: delete auth user if upload fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { error: `Failed to upload document: ${uploadError.message}` }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('member-documents')
      .getPublicUrl(fileName)

    // 3. Get a default center for new signups (or create a "Pending Assignment" center)
    // First, try to get a default center for unassigned members
    const { data: defaultCenter } = await supabase
      .from('centers')
      .select('id')
      .eq('code', 'PENDING')
      .single()

    let centerId = defaultCenter?.id

    // If no default center exists, get any active center as fallback
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
      // Cleanup
      await supabase.storage.from('member-documents').remove([fileName])
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { error: 'No center available for assignment. Please contact support.' }
    }

    const fullAddress = `${data.address.houseStreet}, ${data.address.barangay}, ${data.address.city}, ${data.address.province} ${data.address.zipCode}`

    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .insert({
        center_id: centerId,
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        date_of_birth: data.birthdate,
        phone: `+63${data.phone}`,
        address: fullAddress,
      })
      .select()
      .single()

    if (memberError) {
      // Cleanup
      await supabase.storage.from('member-documents').remove([fileName])
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { error: `Failed to create member: ${memberError.message}` }
    }

    // 4. Create document record
    const { error: docError } = await supabase
      .from('member_documents')
      .insert({
        member_id: memberData.id,
        document_type: 'proof_of_billing',
        file_name: data.proofOfBillingFile.name,
        file_url: urlData.publicUrl,
        file_size: data.proofOfBillingFile.size,
        mime_type: data.proofOfBillingFile.type,
        status: 'pending',
        uploaded_by: authData.user.id,
      })

    if (docError) {
      console.error('Document record creation failed:', docError)
      // Don't fail the whole signup, just log it
      Sentry.captureException(docError, {
        tags: { action: 'signupMember', step: 'document_record' },
      })
    }

    return {
      success: true,
      userId: authData.user.id,
      memberId: memberData.id,
      message: 'Account created successfully! Please verify your phone number.',
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    Sentry.captureException(error, {
      tags: { action: 'signupMember' },
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

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+63${phone}`,
    })

    if (error) {
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
