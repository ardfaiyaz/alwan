/**
 * Secure KYC Approvals with Multi-Layer Security
 * Replaces kyc-approvals.ts with enhanced security
 */

'use server'

import { performSecurityCheck } from '@/lib/rbac/security-middleware'
import { filterSensitiveFields } from '@/lib/rbac/enhanced-permissions'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function secureApproveKYC(params: {
  kycApplicationId: string
  centerId: string
  approvedBy: string
  secondaryAuthToken?: string // For sensitive action verification
}) {
  // Multi-layer security check
  const securityCheck = await performSecurityCheck('approvals', 'approve', {
    requireAuth: true,
    checkRateLimit: true,
    checkTimeRestrictions: true,
    logAudit: true,
  })

  if (!securityCheck.allowed) {
    return { error: securityCheck.reason || 'Access denied', application: null }
  }

  const context = securityCheck.context!

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Verify the application exists and is in pending state
    const { data: application, error: fetchError } = await supabase
      .from('kyc_applications')
      .select('*')
      .eq('id', params.kycApplicationId)
      .single()

    if (fetchError || !application) {
      return { error: 'Application not found', application: null }
    }

    if (application.status !== 'pending' && application.status !== 'in_review') {
      return { error: 'Application is not in a pending state', application: null }
    }

    // Filter sensitive data based on user role
    const filteredApplication = filterSensitiveFields(
      context.userRole,
      'approvals',
      application
    )

    // Perform approval (existing logic from kyc-approvals.ts)
    const { error: updateError } = await supabase
      .from('kyc_applications')
      .update({
        status: 'approved',
        approved_by: params.approvedBy,
        approved_at: new Date().toISOString(),
        center_id: params.centerId,
      })
      .eq('id', params.kycApplicationId)

    if (updateError) {
      // Log failed approval attempt
      await supabase.from('security_audit_logs').insert({
        user_id: context.userId,
        user_role: context.userRole,
        action: 'approvals:approve',
        resource: 'approvals',
        resource_id: params.kycApplicationId,
        ip_address: context.ipAddress,
        user_agent: context.userAgent,
        success: false,
        failure_reason: updateError.message,
      })

      return { error: updateError.message, application: null }
    }

    // Log successful approval
    await supabase.from('security_audit_logs').insert({
      user_id: context.userId,
      user_role: context.userRole,
      action: 'approvals:approve',
      resource: 'approvals',
      resource_id: params.kycApplicationId,
      ip_address: context.ipAddress,
      user_agent: context.userAgent,
      success: true,
      metadata: {
        center_id: params.centerId,
        application_status: 'approved',
      },
    })

    return { error: null, application: filteredApplication }
  } catch (error) {
    console.error('Secure approval error:', error)
    return { error: 'Failed to approve application', application: null }
  }
}

export async function secureRejectKYC(params: {
  kycApplicationId: string
  rejectionReason: string
  rejectedBy: string
}) {
  // Multi-layer security check
  const securityCheck = await performSecurityCheck('approvals', 'approve', {
    requireAuth: true,
    checkRateLimit: true,
    checkTimeRestrictions: true,
    logAudit: true,
  })

  if (!securityCheck.allowed) {
    return { error: securityCheck.reason || 'Access denied' }
  }

  const context = securityCheck.context!

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Verify the application exists
    const { data: application, error: fetchError } = await supabase
      .from('kyc_applications')
      .select('*')
      .eq('id', params.kycApplicationId)
      .single()

    if (fetchError || !application) {
      return { error: 'Application not found' }
    }

    // Perform rejection
    const { error: updateError } = await supabase
      .from('kyc_applications')
      .update({
        status: 'rejected',
        rejected_by: params.rejectedBy,
        rejected_at: new Date().toISOString(),
        rejection_reason: params.rejectionReason,
      })
      .eq('id', params.kycApplicationId)

    if (updateError) {
      await supabase.from('security_audit_logs').insert({
        user_id: context.userId,
        user_role: context.userRole,
        action: 'approvals:reject',
        resource: 'approvals',
        resource_id: params.kycApplicationId,
        ip_address: context.ipAddress,
        user_agent: context.userAgent,
        success: false,
        failure_reason: updateError.message,
      })

      return { error: updateError.message }
    }

    // Log successful rejection
    await supabase.from('security_audit_logs').insert({
      user_id: context.userId,
      user_role: context.userRole,
      action: 'approvals:reject',
      resource: 'approvals',
      resource_id: params.kycApplicationId,
      ip_address: context.ipAddress,
      user_agent: context.userAgent,
      success: true,
      metadata: {
        rejection_reason: params.rejectionReason,
        application_status: 'rejected',
      },
    })

    return { error: null }
  } catch (error) {
    console.error('Secure rejection error:', error)
    return { error: 'Failed to reject application' }
  }
}
