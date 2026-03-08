'use server'

import { createClient } from '@/lib/supabase/server'
import { loanApprovalSchema, type LoanApprovalInput } from '@/lib/validations'
import { getNextLoanStatus, canApproveLoan } from '@/lib/rbac/permissions'
import { createAuditLog } from './audit'

/**
 * Process loan approval/rejection
 * Implements tiered approval workflow based on role and loan amount
 */
export async function processApproval(data: LoanApprovalInput) {
    const supabase = await createClient()

    try {
        // Validate input
        const validated = loanApprovalSchema.parse(data)

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) throw new Error('User profile not found')

        // Get loan details
        const { data: loan, error: loanError } = await supabase
            .from('loans')
            .select('*, member:members(*)')
            .eq('id', validated.loanId)
            .single()

        if (loanError || !loan) throw new Error('Loan not found')

        // Check if user can approve this loan
        if (validated.action === 'approve' && !canApproveLoan(profile.role as any, loan.principal_amount)) {
            throw new Error('You do not have permission to approve this loan amount')
        }

        // Determine next status
        const nextStatus = getNextLoanStatus(
            profile.role as any,
            loan.principal_amount,
            validated.action
        )


        // Update loan status
        const updateData: Record<string, unknown> = {
            status: nextStatus
        }

        // Set approver ID based on role
        if (profile.role === 'field_officer') {
            updateData.field_officer_id = user.id
        } else if (profile.role === 'branch_manager') {
            updateData.branch_manager_id = user.id
        } else if (profile.role === 'area_manager') {
            updateData.area_manager_id = user.id
        }

        // Set approval date if fully approved
        if (nextStatus === 'approved') {
            updateData.approval_date = new Date().toISOString()
        }

        const { error: updateError } = await supabase
            .from('loans')
            .update(updateData)
            .eq('id', validated.loanId)

        if (updateError) throw updateError

        // Log approval action
        await supabase.from('loan_approvals').insert({
            loan_id: validated.loanId,
            approver_id: user.id,
            approver_role: profile.role,
            action: validated.action,
            comments: validated.comments
        })

        // Audit trail
        await createAuditLog({
            action: validated.action === 'approve' ? 'update' : 'delete',
            resourceType: 'loan',
            resourceId: validated.loanId,
            oldValues: { status: loan.status as unknown as Record<string, unknown> },
            newValues: {
                status: nextStatus,
                comments: validated.comments,
                approver: profile.full_name as unknown as Record<string, unknown>
            }
        })

        return {
            success: true,
            nextStatus,
            message: validated.action === 'approve'
                ? `Loan ${nextStatus === 'approved' ? 'approved' : 'forwarded for approval'}`
                : 'Loan rejected'
        }
    } catch (error) {
        throw error
    }
}

/**
 * Get pending approvals for current user
 */
export async function getPendingApprovals() {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, branch_id, area_id')
        .eq('id', user.id)
        .single()

    if (!profile) throw new Error('Profile not found')

    let query = supabase
        .from('loans')
        .select(`
      *,
      member:members(full_name, center:centers(name)),
      center:centers(name, branch:branches(name))
    `)
        .order('created_at', { ascending: false })

    // Filter based on role
    if (profile.role === 'field_officer') {
        query = query.eq('status', 'draft')
    } else if (profile.role === 'branch_manager') {
        query = query.eq('status', 'pending_branch_manager')
        if (profile.branch_id) {
            query = query.eq('center.branch_id', profile.branch_id)
        }
    } else if (profile.role === 'area_manager') {
        query = query.eq('status', 'pending_area_manager')
        if (profile.area_id) {
            query = query.eq('center.branch.area_id', profile.area_id)
        }
    } else if (profile.role === 'admin') {
        query = query.in('status', ['pending_branch_manager', 'pending_area_manager'])
    }

    const { data, error } = await query

    if (error) throw error

    return data
}

/**
 * Get approval history for a loan
 */
export async function getLoanApprovalHistory(loanId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('loan_approvals')
        .select(`
      *,
      approver:profiles(full_name, role)
    `)
        .eq('loan_id', loanId)
        .order('created_at', { ascending: true })

    if (error) throw error

    return data
}
