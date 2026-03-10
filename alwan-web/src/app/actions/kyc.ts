'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Send OTP to phone number using Supabase Auth (Twilio Verify)
 */
export async function sendOTP(phoneNumber: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    })

    if (error) {
      console.error('Send OTP error:', error)
      
      // Customize Twilio error messages
      const errorMessage = error.message.toLowerCase()
      
      // Twilio error 60410: Phone number blocked due to fraud
      if (errorMessage.includes('60410') || errorMessage.includes('blocked') || errorMessage.includes('fraudulent')) {
        return { error: 'This phone number prefix is temporarily blocked. Please try a different number or contact support.' }
      }
      
      // Twilio error 21608: Unverified number in trial account
      if (errorMessage.includes('unverified') || errorMessage.includes('21608')) {
        return { error: 'Verified Numbers Only!' }
      }
      
      // Twilio error 21211: Invalid phone number
      if (errorMessage.includes('invalid') || errorMessage.includes('21211')) {
        return { error: 'Invalid phone number format' }
      }
      
      // Twilio error 60200: Rate limit exceeded
      if (errorMessage.includes('rate limit') || errorMessage.includes('60200')) {
        return { error: 'Too many attempts. Please try again later' }
      }
      
      // Default error message
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Send OTP exception:', error)
    return { error: 'Failed to send OTP' }
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(phoneNumber: string, token: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token,
      type: 'sms',
    })

    if (error) {
      console.error('Verify OTP error:', error)
      return { error: error.message }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error('Verify OTP exception:', error)
    return { error: 'Failed to verify OTP' }
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(phoneNumber: string) {
  return sendOTP(phoneNumber)
}

/**
 * Create KYC application
 */
export async function createKYCApplication(data: {
  mobileNumber: string
  userId: string
}) {
  try {
    const supabase = await createClient()

    const { data: application, error } = await supabase
      .from('kyc_applications')
      .insert({
        user_id: data.userId,
        mobile_number: data.mobileNumber,
        status: 'pending',
        current_step: 1,
        completed_steps: [],
      })
      .select()
      .single()

    if (error) {
      console.error('Create KYC application error:', error)
      return { error: error.message }
    }

    return { success: true, application }
  } catch (error) {
    console.error('Create KYC application exception:', error)
    return { error: 'Failed to create KYC application' }
  }
}

/**
 * Update KYC application step
 */
export async function updateKYCStep(data: {
  applicationId: string
  step: number
  stepData: any
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('kyc_applications')
      .update({
        current_step: data.step,
        completed_steps: data.stepData.completedSteps,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.applicationId)

    if (error) {
      console.error('Update KYC step error:', error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Update KYC step exception:', error)
    return { error: 'Failed to update KYC step' }
  }
}

/**
 * Upload document to Supabase Storage
 */
export async function uploadDocument(file: File, path: string) {
  try {
    const supabase = await createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { data, error } = await supabase.storage
      .from('member-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload document error:', error)
      return { error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('member-documents')
      .getPublicUrl(filePath)

    return { success: true, url: publicUrl, path: filePath }
  } catch (error) {
    console.error('Upload document exception:', error)
    return { error: 'Failed to upload document' }
  }
}

/**
 * Submit complete KYC application
 */
export async function submitKYCApplication(formData: any) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('Current user:', user)
    console.log('User error:', userError)
    
    if (userError || !user) {
      console.error('Authentication error:', userError)
      return { error: 'User not authenticated. Please verify your phone number again.' }
    }

    // Create member record
    const { data: member, error: memberError } = await supabase
      .from('members')
      .insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        phone: `+63${formData.mobileNumber}`,
        address: `${formData.houseNumber} ${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province} ${formData.zipCode}`,
        business_name: formData.businessName,
        business_type: formData.businessType,
        business_address: formData.businessAddress,
        kyc_status: 'pending',
        kyc_level: 'full',
        email: formData.email,
        civil_status: formData.civilStatus,
        nationality: formData.nationality,
      })
      .select()
      .single()

    if (memberError) {
      console.error('Create member error:', memberError)
      return { error: memberError.message }
    }

    // Create member profile
    await supabase.from('member_profiles').insert({
      member_id: member.id,
      civil_status: formData.civilStatus,
      nationality: formData.nationality,
      mothers_maiden_name: formData.mothersMaidenName,
      number_of_dependents: formData.numberOfDependents,
      email: formData.email,
      alternate_phone: formData.alternatePhone,
    })

    // Create member address
    await supabase.from('member_addresses').insert({
      member_id: member.id,
      house_number: formData.houseNumber,
      street: formData.street,
      barangay: formData.barangay,
      city: formData.city,
      province: formData.province,
      zip_code: formData.zipCode,
      years_living: formData.yearsLiving,
      housing_type: formData.housingType,
      is_primary: true,
    })

    // Create business info
    await supabase.from('member_businesses').insert({
      member_id: member.id,
      business_name: formData.businessName,
      business_type: formData.businessType,
      business_address: formData.businessAddress,
      years_operating: formData.yearsOperating,
      registration_type: formData.registrationType,
      registration_number: formData.registrationNumber,
      daily_sales: formData.dailySales,
      monthly_revenue: formData.monthlyRevenue,
      number_of_employees: formData.numberOfEmployees,
    })

    // Create financial info
    await supabase.from('member_financial_info').insert({
      member_id: member.id,
      monthly_income: formData.monthlyIncome,
      other_income_sources: formData.otherIncomeSources,
      monthly_expenses: formData.monthlyExpenses,
      existing_loans: formData.existingLoans,
      assets: formData.assets,
    })

    // Create guarantor if provided
    if (formData.guarantorFullName) {
      await supabase.from('member_guarantors').insert({
        member_id: member.id,
        full_name: formData.guarantorFullName,
        relationship: formData.guarantorRelationship,
        address: formData.guarantorAddress,
        phone: formData.guarantorPhone,
        occupation: formData.guarantorOccupation,
      })
    }

    // Record legal consents
    const consentTypes = [
      { type: 'terms_and_conditions', accepted: formData.termsAccepted },
      { type: 'privacy_policy', accepted: formData.privacyAccepted },
      { type: 'data_privacy_consent', accepted: formData.dataPrivacyAccepted },
      { type: 'credit_investigation_authorization', accepted: formData.creditInvestigationAccepted },
    ]

    for (const consent of consentTypes) {
      if (consent.accepted) {
        await supabase.from('legal_consents').insert({
          user_id: user.id,
          consent_type: consent.type,
          version: '1.0',
        })
      }
    }

    // Update KYC application status
    await supabase
      .from('kyc_applications')
      .update({
        status: 'in_review',
        submitted_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    return { success: true, member }
  } catch (error) {
    console.error('Submit KYC application exception:', error)
    return { error: 'Failed to submit KYC application' }
  }
}

/**
 * Record legal consent
 */
export async function recordConsent(data: {
  userId: string
  consentType: string
  version: string
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('legal_consents').insert({
      user_id: data.userId,
      consent_type: data.consentType,
      version: data.version,
    })

    if (error) {
      console.error('Record consent error:', error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Record consent exception:', error)
    return { error: 'Failed to record consent' }
  }
}
