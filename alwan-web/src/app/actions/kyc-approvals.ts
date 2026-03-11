'use server'

import { createClient } from '@/lib/supabase/server'
import { createMemberFromKYC, rejectKYCApplication } from './member-creation'

export interface KYCApplication {
  id: string
  user_id: string
  mobile_number: string
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  kyc_level: 'basic' | 'full'
  submitted_at: string
  created_at: string
  rejection_reason?: string
  approved_by?: string
  approved_at?: string
  metadata: {
    firstName: string
    middleName: string
    lastName: string
    dateOfBirth: string
    gender: string
    civilStatus: string
    nationality: string
    email: string
    mobileNumber: string
    address: {
      houseNumber: string
      street: string
      barangay: string
      city: string
      province: string
      zipCode: string
      housingType: string
    }
    business: {
      businessName: string
      businessType: string
      yearsOperating: string
      monthlyRevenue: string
    }
    identity: {
      idType: string
      idNumber: string
      idFrontUrl: string
      idBackUrl: string
      selfieUrl: string
      faceMatchScore: number
    }
    financial: {
      monthlyIncome: string
      monthlyExpenses: string
    }
  }
}

/**
 * Get KYC applications with filters and sorting
 */
export async function getKYCApplications(filters?: {
  status?: string
  searchQuery?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('kyc_applications')
      .select('*')

    // Filter by status
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    } else {
      // Default: show pending and in_review
      query = query.in('status', ['pending', 'in_review'])
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'submitted_at'
    const sortOrder = filters?.sortOrder || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const { data, error } = await query

    if (error) {
      console.error('Get KYC applications error:', error)
      return { error: error.message, applications: [] }
    }

    // Filter by search query on client side (since metadata is JSONB)
    let applications = data as KYCApplication[]
    
    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase()
      applications = applications.filter(app => {
        const metadata = app.metadata
        const fullName = `${metadata.firstName} ${metadata.middleName} ${metadata.lastName}`.toLowerCase()
        const phone = app.mobile_number.toLowerCase()
        const business = metadata.business?.businessName?.toLowerCase() || ''
        
        return fullName.includes(searchLower) || 
               phone.includes(searchLower) || 
               business.includes(searchLower)
      })
    }

    return { applications, error: null }
  } catch (error) {
    console.error('Get KYC applications exception:', error)
    return { error: 'Failed to load KYC applications', applications: [] }
  }
}

/**
 * Get single KYC application by ID
 */
export async function getKYCApplication(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('kyc_applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get KYC application error:', error)
      return { error: error.message, application: null }
    }

    return { application: data as KYCApplication, error: null }
  } catch (error) {
    console.error('Get KYC application exception:', error)
    return { error: 'Failed to load KYC application', application: null }
  }
}

/**
 * Approve KYC application and assign to center
 * This will create the member record
 */
export async function approveKYCWithCenter(data: {
  kycApplicationId: string
  centerId: string
  approvedBy: string
}) {
  try {
    // Create member from KYC data
    const result = await createMemberFromKYC({
      kycApplicationId: data.kycApplicationId,
      centerId: data.centerId,
      approvedBy: data.approvedBy,
    })

    if (result.error) {
      return { error: result.error }
    }

    return { success: true, member: result.member }
  } catch (error) {
    console.error('Approve KYC with center exception:', error)
    return { error: 'Failed to approve KYC application' }
  }
}

/**
 * Reject KYC application with reason
 */
export async function rejectKYC(data: {
  kycApplicationId: string
  rejectionReason: string
  rejectedBy: string
}) {
  try {
    const result = await rejectKYCApplication({
      kycApplicationId: data.kycApplicationId,
      rejectionReason: data.rejectionReason,
      rejectedBy: data.rejectedBy,
    })

    if (result.error) {
      return { error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.error('Reject KYC exception:', error)
    return { error: 'Failed to reject KYC application' }
  }
}

/**
 * Get all active centers for assignment
 */
export async function getActiveCenters() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('centers')
      .select(`
        id,
        name,
        code,
        meeting_location,
        meeting_day,
        meeting_time,
        branch:branches(name)
      `)
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Get active centers error:', error)
      return { error: error.message, centers: [] }
    }

    return { centers: data, error: null }
  } catch (error) {
    console.error('Get active centers exception:', error)
    return { error: 'Failed to load centers', centers: [] }
  }
}

/**
 * Update KYC application status
 */
export async function updateKYCStatus(data: {
  kycApplicationId: string
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('kyc_applications')
      .update({ status: data.status })
      .eq('id', data.kycApplicationId)

    if (error) {
      console.error('Update KYC status error:', error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Update KYC status exception:', error)
    return { error: 'Failed to update KYC status' }
  }
}
