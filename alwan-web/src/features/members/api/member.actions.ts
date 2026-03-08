/**
 * Member Feature - Server Actions
 * @module features/members/api
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { memberSchema } from '../utils/validation'
import type { Member, MemberFormData, MemberLoan } from '../types'

/**
 * Fetch all members with their center information
 */
export async function getMembers(): Promise<Member[]> {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('members')
    .select(`
      *,
      center:centers!members_center_id_fkey(id, name, code)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching members:', error)
    Sentry.captureException(error, {
      tags: { feature: 'members', action: 'getMembers' },
      extra: { error }
    })
    throw new Error('Failed to fetch members')
  }

  return members.map((m: any) => ({
    id: m.id,
    firstName: m.first_name,
    lastName: m.last_name,
    middleName: m.middle_name,
    centerId: m.center_id,
    center: m.center,
    isActive: m.is_active,
    cbuBalance: m.cbu_balance,
    joinedDate: m.joined_date,
    phone: m.phone,
    address: m.address,
    dateOfBirth: m.date_of_birth,
    gender: m.gender,
    businessName: m.business_name,
    businessType: m.business_type,
    businessAddress: m.business_address,
  }))
}

/**
 * Create a new member
 */
export async function createMember(data: MemberFormData) {
  const supabase = await createClient()

  // Validate input
  const validated = memberSchema.parse(data)

  const { error } = await supabase
    .from('members')
    .insert({
      center_id: validated.centerId,
      first_name: validated.firstName,
      last_name: validated.lastName,
      middle_name: validated.middleName,
      date_of_birth: validated.dateOfBirth,
      gender: validated.gender,
      phone: validated.phone,
      address: validated.address,
      business_name: validated.businessName,
      business_type: validated.businessType,
      business_address: validated.businessAddress,
      spouse_name: validated.spouseName,
      beneficiary_name: validated.beneficiaryName,
      beneficiary_relationship: validated.beneficiaryRelationship,
      beneficiary_phone: validated.beneficiaryPhone,
    })

  if (error) {
    console.error('Error creating member:', error)
    Sentry.captureException(error, {
      tags: { feature: 'members', action: 'createMember' },
      extra: { data, error }
    })
    throw new Error(error.message)
  }

  revalidatePath('/admin/members')
  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Update an existing member
 */
export async function updateMember(id: string, data: Partial<MemberFormData>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('members')
    .update({
      center_id: data.centerId,
      first_name: data.firstName,
      last_name: data.lastName,
      middle_name: data.middleName,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      business_name: data.businessName,
      business_type: data.businessType,
      business_address: data.businessAddress,
      spouse_name: data.spouseName,
      beneficiary_name: data.beneficiaryName,
      beneficiary_relationship: data.beneficiaryRelationship,
      beneficiary_phone: data.beneficiaryPhone,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating member:', error)
    Sentry.captureException(error, {
      tags: { feature: 'members', action: 'updateMember' },
      extra: { id, data, error }
    })
    throw new Error(error.message)
  }

  revalidatePath('/admin/members')
  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Toggle member active status
 */
export async function toggleMemberStatus(id: string, isActive: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('members')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Error toggling member status:', error)
    Sentry.captureException(error, {
      tags: { feature: 'members', action: 'toggleMemberStatus' },
      extra: { id, isActive, error }
    })
    throw new Error(error.message)
  }

  revalidatePath('/admin/members')
  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Get member by ID with full details
 */
export async function getMemberById(id: string): Promise<Member> {
  const supabase = await createClient()

  const { data: member, error } = await supabase
    .from('members')
    .select(`
      *,
      center:centers!members_center_id_fkey(id, name, code)
    `)
    .eq('id', id)
    .single()

  if (error) {
    Sentry.captureException(error, {
      tags: { feature: 'members', action: 'getMemberById' },
      extra: { id, error }
    })
    throw error
  }

  return {
    id: member.id,
    firstName: member.first_name,
    lastName: member.last_name,
    middleName: member.middle_name,
    dateOfBirth: member.date_of_birth,
    gender: member.gender,
    phone: member.phone,
    address: member.address,
    businessName: member.business_name,
    businessType: member.business_type,
    businessAddress: member.business_address,
    cbuBalance: member.cbu_balance,
    joinedDate: member.joined_date,
    isActive: member.is_active,
    center: member.center,
    centerId: member.center_id,
  }
}

/**
 * Get all loans for a specific member
 */
export async function getMemberLoans(memberId: string): Promise<MemberLoan[]> {
  const supabase = await createClient()

  const { data: loans, error } = await supabase
    .from('loans')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false })

  if (error) {
    Sentry.captureException(error, {
      tags: { feature: 'members', action: 'getMemberLoans' },
      extra: { memberId, error }
    })
    throw error
  }

  return loans.map((l: any) => ({
    id: l.id,
    loanType: l.loan_type,
    principalAmount: l.principal_amount,
    outstandingBalance: l.outstanding_balance,
    status: l.status,
    disbursementDate: l.disbursement_date,
    weeklyPayment: l.weekly_payment,
  }))
}

/**
 * Get all centers for member assignment
 */
export async function getCenters() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('centers')
    .select('id, name')
    .order('name')
  return data || []
}
