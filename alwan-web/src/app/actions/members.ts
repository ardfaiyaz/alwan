'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const MemberSchema = z.object({
    centerId: z.string().uuid(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    middleName: z.string().optional().nullable(),
    dateOfBirth: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    phone: z.string().optional().nullable(),
    address: z.string().min(1),
    businessName: z.string().optional().nullable(),
    businessType: z.string().optional().nullable(),
    businessAddress: z.string().optional().nullable(),
    spouseName: z.string().optional().nullable(),
    beneficiaryName: z.string().optional().nullable(),
    beneficiaryRelationship: z.string().optional().nullable(),
    beneficiaryPhone: z.string().optional().nullable(),
})

export type Member = {
    id: string
    firstName: string
    lastName: string
    middleName?: string | null
    centerId: string
    center?: { id: string; name: string } | null
    isActive: boolean
    cbuBalance: number
    joinedDate: string
    phone?: string | null
    address: string
    // Extend as needed
}

export async function getMembers() {
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
        address: m.address
    })) as Member[]
}

export async function createMember(data: z.infer<typeof MemberSchema>) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('members')
        .insert({
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

    if (error) {
        console.error('Error creating member:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/users') // Temporarily updating users page until renamed
    return { success: true }
}

export async function updateMember(id: string, data: Partial<z.infer<typeof MemberSchema>>) {
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
        throw new Error(error.message)
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function toggleMemberStatus(id: string, isActive: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('members')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) {
        console.error('Error toggling member status:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function getCenters() {
    const supabase = await createClient()
    const { data } = await supabase.from('centers').select('id, name').order('name')
    return data || []
}
  
export async function getMemberById(id: string) {
  const supabase = await createClient()
  
  const { data: member, error } = await supabase
    .from('members')
    .select(`
      *,
      center:centers!members_center_id_fkey(id, name, code)
    `)
    .eq('id', id)
    .single()

  if (error) throw error

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
  }
}

export async function getMemberLoans(memberId: string) {
  const supabase = await createClient()
  
  const { data: loans, error } = await supabase
    .from('loans')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false })

  if (error) throw error

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

