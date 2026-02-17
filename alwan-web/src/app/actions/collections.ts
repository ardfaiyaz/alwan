'use server'

import { createClient } from '@/lib/supabase/server'
import { weeklyCollectionSchema, type WeeklyCollectionInput } from '@/lib/validations'
import { logAudit } from './audit'

/**
 * Process weekly collection for a center
 * This is a batch operation that updates loan balances, CBU balances, and creates collection records
 */
export async function processWeeklyCollection(data: WeeklyCollectionInput) {
    const supabase = await createClient()

    try {
        // Validate input
        const validated = weeklyCollectionSchema.parse(data)

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Call the database function that handles the transaction
        const { data: result, error } = await supabase.rpc('process_weekly_collection', {
            p_center_id: validated.centerId,
            p_collection_date: validated.collectionDate,
            p_collections: validated.collections
        })

        if (error) throw error

        // Log audit trail
        await logAudit({
            action: 'PROCESS_WEEKLY_COLLECTION',
            resourceType: 'collection',
            resourceId: result.collection_sheet_id,
            newValues: {
                centerId: validated.centerId,
                collectionDate: validated.collectionDate,
                totalCollected: result.total_collected,
                presentMembers: result.present_members
            }
        })

        return {
            success: true,
            collectionSheetId: result.collection_sheet_id,
            totalCollected: result.total_collected,
            presentMembers: result.present_members
        }
    } catch (error: any) {
        // Log failed attempt
        await logAudit({
            action: 'PROCESS_WEEKLY_COLLECTION',
            resourceType: 'collection',
            success: false,
            errorMessage: error.message,
            newValues: data
        })

        throw error
    }
}

/**
 * Get weekly collection sheet for a center and date
 */
export async function getWeeklyCollectionSheet(centerId: string, collectionDate: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('weekly_collection_sheets')
        .select(`
      *,
      center:centers(name, code),
      field_officer:profiles!field_officer_id(full_name),
      member_collections(
        *,
        member:members(full_name),
        loan:loans(weekly_payment, outstanding_balance)
      )
    `)
        .eq('center_id', centerId)
        .eq('collection_date', collectionDate)
        .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found

    return data
}

/**
 * Get collection history for a center
 */
export async function getCenterCollectionHistory(
    centerId: string,
    limit: number = 10
) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('weekly_collection_sheets')
        .select(`
      id,
      collection_date,
      status,
      total_collected,
      total_loan_payments,
      total_cbu_payments,
      total_insurance_payments,
      present_members,
      expected_members,
      field_officer:profiles!field_officer_id(full_name)
    `)
        .eq('center_id', centerId)
        .order('collection_date', { ascending: false })
        .limit(limit)

    if (error) throw error

    return data
}

/**
 * Verify a collection sheet (for branch managers)
 */
export async function verifyCollectionSheet(collectionSheetId: string) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Update collection sheet
    const { data, error } = await supabase
        .from('weekly_collection_sheets')
        .update({
            status: 'verified',
            verified_by: user.id,
            verified_at: new Date().toISOString()
        })
        .eq('id', collectionSheetId)
        .select()
        .single()

    if (error) throw error

    // Log audit trail
    await logAudit({
        action: 'VERIFY_COLLECTION_SHEET',
        resourceType: 'collection',
        resourceId: collectionSheetId,
        newValues: { status: 'verified' }
    })

    return data
}

/**
 * Get members for a center with their active loans and expected payments
 */
export async function getCenterMembersForCollection(centerId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('members')
        .select(`
      id,
      full_name,
      cbu_balance,
      loans!inner(
        id,
        weekly_payment,
        outstanding_balance,
        status
      ),
      microinsurance_policies!inner(
        id,
        premium_amount,
        is_active
      )
    `)
        .eq('center_id', centerId)
        .eq('is_active', true)
        .eq('loans.status', 'active')
        .eq('microinsurance_policies.is_active', true)

    if (error) throw error

    return data
}
