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
 * Note: This creates a user account but immediately signs them out.
 * User will only be logged in after completing all KYC forms.
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

    // Store user ID before signing out
    const userId = data.user?.id

    // Sign out immediately - user should not have session until KYC is complete
    await supabase.auth.signOut()

    return { success: true, userId }
  } catch (error) {
    console.error('Verify OTP exception:', error)
    return { error: 'Failed to verify OTP' }
  }
}

/**
 * Sign in user after KYC completion
 * Sends OTP to user's phone for login after completing all forms
 */
export async function signInAfterKYC(phoneNumber: string) {
  try {
    const supabase = await createClient()

    // Send OTP for login (user already exists from initial verification)
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
      options: {
        shouldCreateUser: false, // User already exists
      }
    })

    if (error) {
      console.error('Sign in OTP error:', error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign in after KYC exception:', error)
    return { error: 'Failed to send login OTP' }
  }
}

/**
 * Verify login OTP after KYC completion
 */
export async function verifyLoginOTP(phoneNumber: string, token: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token,
      type: 'sms',
    })

    if (error) {
      console.error('Verify login OTP error:', error)
      return { error: error.message }
    }

    // This time we keep the session
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Verify login OTP exception:', error)
    return { error: 'Failed to verify login OTP' }
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

    // Use userId from formData (stored during OTP verification)
    const userId = formData.userId
    
    if (!userId) {
      console.error('No user ID provided')
      return { error: 'User ID not found. Please verify your phone number again.' }
    }

    // Upload documents first
    let idFrontUrl = ''
    let idBackUrl = ''
    let selfieUrl = ''
    let guarantorIdUrl = ''
    let utilityBillUrl = ''
    let businessPermitUrl = ''

    // Upload ID documents
    if (formData.idFrontFile) {
      const result = await uploadDocument(formData.idFrontFile, `kyc/${userId}/identity`)
      if (result.error) {
        return { error: `Failed to upload ID front: ${result.error}` }
      }
      idFrontUrl = result.url || ''
    }

    if (formData.idBackFile) {
      const result = await uploadDocument(formData.idBackFile, `kyc/${userId}/identity`)
      if (result.error) {
        return { error: `Failed to upload ID back: ${result.error}` }
      }
      idBackUrl = result.url || ''
    }

    if (formData.selfieFile) {
      const result = await uploadDocument(formData.selfieFile, `kyc/${userId}/identity`)
      if (result.error) {
        return { error: `Failed to upload selfie: ${result.error}` }
      }
      selfieUrl = result.url || ''
    }

    // Upload guarantor ID if provided
    if (formData.guarantorIdFile) {
      const result = await uploadDocument(formData.guarantorIdFile, `kyc/${userId}/guarantor`)
      if (result.error) {
        console.warn('Failed to upload guarantor ID:', result.error)
      } else {
        guarantorIdUrl = result.url || ''
      }
    }

    // Upload utility bill if provided
    if (formData.utilityBillFile) {
      const result = await uploadDocument(formData.utilityBillFile, `kyc/${userId}/documents`)
      if (result.error) {
        console.warn('Failed to upload utility bill:', result.error)
      } else {
        utilityBillUrl = result.url || ''
      }
    }

    // Upload business permit if provided
    if (formData.businessPermitFile) {
      const result = await uploadDocument(formData.businessPermitFile, `kyc/${userId}/documents`)
      if (result.error) {
        console.warn('Failed to upload business permit:', result.error)
      } else {
        businessPermitUrl = result.url || ''
      }
    }

    // Create or update KYC application with all data
    const { data: kycApp, error: kycError } = await supabase
      .from('kyc_applications')
      .upsert({
        user_id: userId,
        mobile_number: formData.mobileNumber,
        status: 'in_review',
        current_step: 12,
        completed_steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        kyc_level: 'full',
        submitted_at: new Date().toISOString(),
        metadata: {
          // Personal Information
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          civilStatus: formData.civilStatus,
          nationality: formData.nationality,
          mothersMaidenName: formData.mothersMaidenName,
          numberOfDependents: formData.numberOfDependents,
          
          // Contact Information
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          alternatePhone: formData.alternatePhone,
          
          // Address Information
          address: {
            houseNumber: formData.houseNumber,
            street: formData.street,
            barangay: formData.barangay,
            city: formData.city,
            province: formData.province,
            zipCode: formData.zipCode,
            yearsLiving: formData.yearsLiving,
            housingType: formData.housingType,
          },
          
          // Identity Verification
          identity: {
            idType: formData.idType,
            idNumber: formData.idNumber,
            idFrontUrl,
            idBackUrl,
            selfieUrl,
            faceMatchScore: formData.faceMatchScore,
          },
          
          // Business Information
          business: {
            businessName: formData.businessName,
            businessType: formData.businessType,
            businessAddress: formData.businessAddress,
            yearsOperating: formData.yearsOperating,
            registrationType: formData.registrationType,
            registrationNumber: formData.registrationNumber,
            dailySales: formData.dailySales,
            monthlyRevenue: formData.monthlyRevenue,
            numberOfEmployees: formData.numberOfEmployees,
          },
          
          // Financial Information
          financial: {
            monthlyIncome: formData.monthlyIncome,
            otherIncomeSources: formData.otherIncomeSources,
            monthlyExpenses: formData.monthlyExpenses,
            existingLoans: formData.existingLoans || [],
            assets: formData.assets || [],
          },
          
          // Guarantor Information (optional)
          guarantor: formData.guarantorFullName ? {
            fullName: formData.guarantorFullName,
            relationship: formData.guarantorRelationship,
            address: formData.guarantorAddress,
            phone: formData.guarantorPhone,
            occupation: formData.guarantorOccupation,
            idUrl: guarantorIdUrl,
          } : null,
          
          // Documents
          documents: {
            utilityBillUrl,
            businessPermitUrl,
          },
          
          // Legal Consents
          consents: {
            termsAccepted: formData.termsAccepted,
            privacyAccepted: formData.privacyAccepted,
            dataPrivacyAccepted: formData.dataPrivacyAccepted,
            creditInvestigationAccepted: formData.creditInvestigationAccepted,
          },
        },
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (kycError) {
      console.error('Create/update KYC application error:', kycError)
      return { error: `Failed to create KYC application: ${kycError.message}` }
    }
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: formData.email || '',
        full_name: `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.trim(),
        role: 'member',
        phone: formData.mobileNumber,
        is_active: true,
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('Create/update profile error:', profileError)
      // Don't fail the whole process if profile creation fails
    }

    // Store complete KYC data as metadata (we'll create member record after center assignment)
    const kycMetadata = {
      // Personal Information
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      civilStatus: formData.civilStatus,
      nationality: formData.nationality,
      mothersMaidenName: formData.mothersMaidenName,
      numberOfDependents: formData.numberOfDependents,
      
      // Contact Information
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      alternatePhone: formData.alternatePhone,
      
      // Address Information
      address: {
        houseNumber: formData.houseNumber,
        street: formData.street,
        barangay: formData.barangay,
        city: formData.city,
        province: formData.province,
        zipCode: formData.zipCode,
        yearsLiving: formData.yearsLiving,
        housingType: formData.housingType,
      },
      
      // Identity Verification
      identity: {
        idType: formData.idType,
        idNumber: formData.idNumber,
        idFrontUrl,
        idBackUrl,
        selfieUrl,
        faceMatchScore: formData.faceMatchScore,
      },
      
      // Business Information
      business: {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        yearsOperating: formData.yearsOperating,
        registrationType: formData.registrationType,
        registrationNumber: formData.registrationNumber,
        dailySales: formData.dailySales,
        monthlyRevenue: formData.monthlyRevenue,
        numberOfEmployees: formData.numberOfEmployees,
      },
      
      // Financial Information
      financial: {
        monthlyIncome: formData.monthlyIncome,
        otherIncomeSources: formData.otherIncomeSources,
        monthlyExpenses: formData.monthlyExpenses,
        existingLoans: formData.existingLoans || [],
        assets: formData.assets || [],
      },
      
      // Guarantor Information (optional)
      guarantor: formData.guarantorFullName ? {
        fullName: formData.guarantorFullName,
        relationship: formData.guarantorRelationship,
        address: formData.guarantorAddress,
        phone: formData.guarantorPhone,
        occupation: formData.guarantorOccupation,
        idUrl: guarantorIdUrl,
      } : null,
      
      // Documents
      documents: {
        utilityBillUrl,
        businessPermitUrl,
      },
      
      // Legal Consents
      consents: {
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,
        dataPrivacyAccepted: formData.dataPrivacyAccepted,
        creditInvestigationAccepted: formData.creditInvestigationAccepted,
      },
    }

    // Store complete KYC data as metadata (we'll create member record after center assignment)
    
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

    // TODO: After admin assigns center, create member record with all this data
    // The metadata is now stored in kyc_applications.metadata column

    return { 
      success: true, 
      kycApplication: kycApp,
      message: 'KYC application submitted successfully. You will be notified once a center is assigned to you.',
    }
  } catch (error) {
    console.error('Submit KYC application exception:', error)
    return { error: 'Failed to submit KYC application. Please try again.' }
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
