/**
 * Security Middleware for Server Actions
 * Enforces multi-layer security checks
 */

import { headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { hasPermission, type UserRole, type PermissionResource, type PermissionAction } from './permissions'
import {
  createSecurityContext,
  validateTimeBasedAccess,
  getRateLimit,
  isSensitiveAction,
  type SecurityContext,
  type SecurityAuditLog,
} from './security-layers'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export interface SecurityCheckResult {
  allowed: boolean
  reason?: string
  context?: SecurityContext
}

/**
 * Comprehensive security check for server actions
 */
export async function performSecurityCheck(
  resource: PermissionResource,
  action: PermissionAction,
  options: {
    requireAuth?: boolean
    checkRateLimit?: boolean
    checkTimeRestrictions?: boolean
    logAudit?: boolean
  } = {}
): Promise<SecurityCheckResult> {
  const {
    requireAuth = true,
    checkRateLimit = true,
    checkTimeRestrictions = true,
    logAudit = true,
  } = options

  try {
    // Layer 1: Authentication Check
    if (requireAuth) {
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

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return { allowed: false, reason: 'Authentication required' }
      }

      // Get user profile and role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, branch_id, area_id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        return { allowed: false, reason: 'User profile not found' }
      }

      const userRole = profile.role as UserRole

      // Layer 2: Permission Check
      if (!hasPermission(userRole, resource, action)) {
        await logSecurityEvent({
          userId: user.id,
          userRole,
          action: `${resource}:${action}`,
          resource,
          success: false,
          failureReason: 'Insufficient permissions',
        })
        return { allowed: false, reason: 'Insufficient permissions' }
      }

      // Layer 3: Time-based Access Control
      if (checkTimeRestrictions) {
        const timeCheck = validateTimeBasedAccess(userRole)
        if (!timeCheck.allowed) {
          await logSecurityEvent({
            userId: user.id,
            userRole,
            action: `${resource}:${action}`,
            resource,
            success: false,
            failureReason: timeCheck.reason,
          })
          return { allowed: false, reason: timeCheck.reason }
        }
      }

      // Layer 4: Rate Limiting
      if (checkRateLimit) {
        const rateLimitKey = `${user.id}:${resource}:${action}`
        const rateLimit = getRateLimit(userRole, `${resource}:${action}`)
        
        if (rateLimit) {
          const now = Date.now()
          const existing = rateLimitStore.get(rateLimitKey)

          if (existing) {
            if (now < existing.resetAt) {
              if (existing.count >= rateLimit.maxRequests) {
                await logSecurityEvent({
                  userId: user.id,
                  userRole,
                  action: `${resource}:${action}`,
                  resource,
                  success: false,
                  failureReason: 'Rate limit exceeded',
                })
                return { allowed: false, reason: 'Rate limit exceeded. Please try again later.' }
              }
              existing.count++
            } else {
              rateLimitStore.set(rateLimitKey, { count: 1, resetAt: now + rateLimit.windowMs })
            }
          } else {
            rateLimitStore.set(rateLimitKey, { count: 1, resetAt: now + rateLimit.windowMs })
          }
        }
      }

      // Layer 5: Sensitive Action Check
      const sensitiveAction = isSensitiveAction(resource, action)
      if (sensitiveAction && sensitiveAction.requiresSecondaryAuth) {
        // In production, verify secondary authentication (e.g., 2FA, PIN)
        // For now, we'll just log it
        await logSecurityEvent({
          userId: user.id,
          userRole,
          action: `${resource}:${action}`,
          resource,
          success: true,
          metadata: { sensitiveAction: true, requiresSecondaryAuth: true },
        })
      }

      // Get request metadata
      const headersList = headers()
      const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
      const userAgent = headersList.get('user-agent') || 'unknown'

      // Create security context
      const context = createSecurityContext(
        user.id,
        userRole,
        user.id, // Use user ID as session ID for now
        ipAddress,
        userAgent
      )

      // Layer 6: Audit Logging
      if (logAudit) {
        await logSecurityEvent({
          userId: user.id,
          userRole,
          action: `${resource}:${action}`,
          resource,
          success: true,
          ipAddress,
          userAgent,
        })
      }

      return { allowed: true, context }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Security check error:', error)
    return { allowed: false, reason: 'Security check failed' }
  }
}

/**
 * Log security events to audit trail
 */
async function logSecurityEvent(event: Partial<SecurityAuditLog>): Promise<void> {
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

    await supabase.from('security_audit_logs').insert({
      user_id: event.userId,
      user_role: event.userRole,
      action: event.action,
      resource: event.resource,
      resource_id: event.resourceId,
      ip_address: event.ipAddress || 'unknown',
      user_agent: event.userAgent || 'unknown',
      success: event.success ?? true,
      failure_reason: event.failureReason,
      metadata: event.metadata,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

/**
 * Decorator for server actions with security checks
 */
export function withSecurity<T extends any[], R>(
  resource: PermissionResource,
  action: PermissionAction,
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const securityCheck = await performSecurityCheck(resource, action)
    
    if (!securityCheck.allowed) {
      throw new Error(securityCheck.reason || 'Access denied')
    }

    return handler(...args)
  }
}
