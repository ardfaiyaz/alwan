'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Create member record from approved KYC application
 * This should be called by admin after assigning a center to the applicant
 */
export async function createMemberFromKYC(data: {
  kycApplicationId: string
  centerId: string
  approvedBy: string
}) {
  try {
    const supabase = await createClient()

    // Get KYC application with metadata
    const { data: kycApp, error: kycError } = await supabase
      .from('kyc_applications')
      .select('*')
      .eq('id', data.kycApplicationId)
      .single()

    if (kycError || !kycApp) {
      return { error: 'KYC application not found' }
    }

    const metadata = kycApp.metadata as any

    // Create member record
    const { data: member, error: memberError } = await supabase
      .from('members')
      .insert({
        center_id: data.centerId,
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        middle_name: metadata.middleName,
        date_of_birth: metadata.dateOfBirth,
        gender: metadata.gender,
        phone: `+63${metadata.mobileNumber}`,
        address: `${metadata.address.houseNumber} ${metadata.address.street}, ${metadata.address.barangay}, ${metadata.address.city}, ${metadata.address.province} ${metadata.address.zipCode}`,
        business_name: metadata.business.businessName,
        business_type: metadata.business.businessType,
        business_address: metadata.business.businessAddress,
        kyc_status: 'approved',
        kyc_level: 'full',
        email: metadata.email,
        civil_status: metadata.civilStatus,
        nationality: metadata.nationality,
        is_active: true,
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
      civil_status: metadata.civilStatus,
      nationality: metadata.nationality,
      mothers_maiden_name: metadata.mothersMaidenName,
      number_of_dependents: metadata.numberOfDependents,
      email: metadata.email,
      alternate_phone: metadata.alternatePhone,
    })

    // Create member address
    await supabase.from('member_addresses').insert({
      member_id: member.id,
      house_number: metadata.address.houseNumber,
      street: metadata.address.street,
      barangay: metadata.address.barangay,
      city: metadata.address.city,
      province: metadata.address.province,
      zip_code: metadata.address.zipCode,
      years_living: metadata.address.yearsLiving,
      housing_type: metadata.address.housingType,
      is_primary: true,
    })

    // Create member identification
    await supabase.from('member_identifications').insert({
      member_id: member.id,
      id_type: metadata.identity.idType,
      id_number: metadata.identity.idNumber,
      id_front_url: metadata.identity.idFrontUrl,
      id_back_url: metadata.identity.idBackUrl,
      selfie_url: metadata.identity.selfieUrl,
      face_match_score: metadata.identity.faceMatchScore,
      face_match_verified: metadata.identity.faceMatchScore >= 0.7,
    })

    // Create business info
    await supabase.from('member_businesses').insert({
      member_id: member.id,
      business_name: metadata.business.businessName,
      business_type: metadata.business.businessType,
      business_address: metadata.business.businessAddress,
      years_operating: metadata.business.yearsOperating,
      registration_type: metadata.business.registrationType,
      registration_number: metadata.business.registrationNumber,
      daily_sales: metadata.business.dailySales,
      monthly_revenue: metadata.business.monthlyRevenue,
      number_of_employees: metadata.business.numberOfEmployees,
    })

    // Create financial info
    await supabase.from('member_financial_info').insert({
      member_id: member.id,
      monthly_income: metadata.financial.monthlyIncome,
      other_income_sources: metadata.financial.otherIncomeSources,
      monthly_expenses: metadata.financial.monthlyExpenses,
      existing_loans: metadata.financial.existingLoans,
      assets: metadata.financial.assets,
    })

    // Create guarantor if provided
    if (metadata.guarantor) {
      await supabase.from('member_guarantors').insert({
        member_id: member.id,
        full_name: metadata.guarantor.fullName,
        relationship: metadata.guarantor.relationship,
        address: metadata.guarantor.address,
        phone: metadata.guarantor.phone,
        occupation: metadata.guarantor.occupation,
        id_document_url: metadata.guarantor.idUrl,
      })
    }

    // Create member documents
    const documents = []
    
    if (metadata.documents.utilityBillUrl) {
      documents.push({
        member_id: member.id,
        document_type: 'proof_of_billing',
        file_name: 'utility_bill',
        file_url: metadata.documents.utilityBillUrl,
        status: 'verified',
      })
    }
    
    if (metadata.documents.businessPermitUrl) {
      documents.push({
        member_id: member.id,
        document_type: 'business_permit',
        file_name: 'business_permit',
        file_url: metadata.documents.businessPermitUrl,
        status: 'verified',
      })
    }

    if (documents.length > 0) {
      await supabase.from('member_documents').insert(documents)
    }

    // Update KYC application status
    await supabase
      .from('kyc_applications')
      .update({
        status: 'approved',
        approved_by: data.approvedBy,
        approved_at: new Date().toISOString(),
      })
      .eq('id', data.kycApplicationId)

    return { success: true, member }
  } catch (error) {
    console.error('Create member from KYC exception:', error)
    return { error: 'Failed to create member record' }
  }
}

/**
 * Reject KYC application
 */
export async function rejectKYCApplication(data: {
  kycApplicationId: string
  rejectionReason: string
  rejectedBy: string
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('kyc_applications')
      .update({
        status: 'rejected',
        rejection_reason: data.rejectionReason,
        approved_by: data.rejectedBy,
        approved_at: new Date().toISOString(),
      })
      .eq('id', data.kycApplicationId)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Reject KYC application exception:', error)
    return { error: 'Failed to reject KYC application' }
  }
}
