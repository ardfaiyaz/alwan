/**
 * Multi-Layer Security System for RBAC
 * Implements defense-in-depth security strategy
 */

import { UserRole, PermissionResource, PermissionAction } from './permissions'

// Security Layer 1: Session Management
export interface SecuritySession {
  userId: string
  userRole: UserRole
  sessionId: string
  ipAddress: string
  userAgent: string
  createdAt: Date
  lastActivity: Date
  expiresAt: Date
}

// Security Layer 2: Action Audit Trail
export interface SecurityAuditLog {
  id: string
  userId: string
  userRole: UserRole
  action: string
  resource: PermissionResource
  resourceId?: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  success: boolean
  failureReason?: string
  metadata?: Record<string, any>
}

// Security Layer 3: Rate Limiting
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const RATE_LIMITS: Record<UserRole, Record<string, RateLimitConfig>> = {
  admin: {
    'approvals:approve': { maxRequests: 100, windowMs: 60000 },
    'approvals:reject': { maxRequests: 100, windowMs: 60000 },
    'members:create': { maxRequests: 50, windowMs: 60000 },
    'loans:approve': { maxRequests: 100, windowMs: 60000 },
  },
  area_manager: {
    'approvals:approve': { maxRequests: 50, windowMs: 60000 },
    'approvals:reject': { maxRequests: 50, windowMs: 60000 },
    'loans:approve': { maxRequests: 50, windowMs: 60000 },
  },
  branch_manager: {
    'approvals:approve': { maxRequests: 30, windowMs: 60000 },
    'approvals:reject': { maxRequests: 30, windowMs: 60000 },
    'members:create': { maxRequests: 20, windowMs: 60000 },
    'loans:approve': { maxRequests: 30, windowMs: 60000 },
  },
  field_officer: {
    'members:create': { maxRequests: 20, windowMs: 60000 },
    'collections:create': { maxRequests: 50, windowMs: 60000 },
  },
}

// Security Layer 4: IP Whitelisting (optional)
export interface IPWhitelistConfig {
  enabled: boolean
  allowedIPs: string[]
  allowedRanges: string[]
}

// Security Layer 5: Time-based Access Control
export interface TimeBasedAccessControl {
  enabled: boolean
  allowedDays: number[] // 0-6 (Sunday-Saturday)
  allowedHours: { start: number; end: number } // 0-23
  timezone: string
}

const TIME_RESTRICTIONS: Partial<Record<UserRole, TimeBasedAccessControl>> = {
  field_officer: {
    enabled: true,
    allowedDays: [1, 2, 3, 4, 5], // Monday-Friday
    allowedHours: { start: 8, end: 18 }, // 8 AM - 6 PM
    timezone: 'Asia/Manila',
  },
}

// Security Layer 6: Sensitive Action Verification
export interface SensitiveAction {
  resource: PermissionResource
  action: PermissionAction
  requiresSecondaryAuth: boolean
  requiresApproval: boolean
  approvalRoles: UserRole[]
  cooldownMs?: number
}

const SENSITIVE_ACTIONS: SensitiveAction[] = [
  {
    resource: 'members',
    action: 'delete',
    requiresSecondaryAuth: true,
    requiresApproval: true,
    approvalRoles: ['admin'],
    cooldownMs: 300000, // 5 minutes
  },
  {
    resource: 'loans',
    action: 'delete',
    requiresSecondaryAuth: true,
    requiresApproval: true,
    approvalRoles: ['admin'],
    cooldownMs: 300000,
  },
  {
    resource: 'users',
    action: 'delete',
    requiresSecondaryAuth: true,
    requiresApproval: true,
    approvalRoles: ['admin'],
    cooldownMs: 600000, // 10 minutes
  },
  {
    resource: 'settings',
    action: 'edit',
    requiresSecondaryAuth: true,
    requiresApproval: false,
    approvalRoles: ['admin'],
  },
]

// Security Layer 7: Data Access Scope
export interface DataAccessScope {
  userRole: UserRole
  canAccessAllBranches: boolean
  canAccessAllCenters: boolean
  restrictedToBranchIds?: string[]
  restrictedToCenterIds?: string[]
  restrictedToOwnData: boolean
}

export function getDataAccessScope(userRole: UserRole, userId: string): DataAccessScope {
  switch (userRole) {
    case 'admin':
      return {
        userRole,
        canAccessAllBranches: true,
        canAccessAllCenters: true,
        restrictedToOwnData: false,
      }
    case 'area_manager':
      return {
        userRole,
        canAccessAllBranches: false,
        canAccessAllCenters: false,
        restrictedToOwnData: false,
        // Should be populated from user's assigned area
      }
    case 'branch_manager':
      return {
        userRole,
        canAccessAllBranches: false,
        canAccessAllCenters: false,
        restrictedToOwnData: false,
        // Should be populated from user's assigned branch
      }
    case 'field_officer':
      return {
        userRole,
        canAccessAllBranches: false,
        canAccessAllCenters: false,
        restrictedToOwnData: false,
        // Should be populated from user's assigned centers
      }
  }
}

// Security validation functions
export function validateTimeBasedAccess(userRole: UserRole): { allowed: boolean; reason?: string } {
  const restriction = TIME_RESTRICTIONS[userRole]
  if (!restriction || !restriction.enabled) {
    return { allowed: true }
  }

  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()

  if (!restriction.allowedDays.includes(day)) {
    return { allowed: false, reason: 'Access not allowed on this day' }
  }

  if (hour < restriction.allowedHours.start || hour >= restriction.allowedHours.end) {
    return { allowed: false, reason: 'Access not allowed at this time' }
  }

  return { allowed: true }
}

export function getRateLimit(userRole: UserRole, action: string): RateLimitConfig | null {
  return RATE_LIMITS[userRole]?.[action] || null
}

export function isSensitiveAction(
  resource: PermissionResource,
  action: PermissionAction
): SensitiveAction | null {
  return SENSITIVE_ACTIONS.find(sa => sa.resource === resource && sa.action === action) || null
}

export function validateIPAccess(ipAddress: string, config: IPWhitelistConfig): boolean {
  if (!config.enabled) return true
  
  // Check exact IP match
  if (config.allowedIPs.includes(ipAddress)) return true
  
  // Check IP range match (simplified - in production use proper CIDR matching)
  for (const range of config.allowedRanges) {
    if (ipAddress.startsWith(range.split('/')[0].substring(0, range.indexOf('.')))) {
      return true
    }
  }
  
  return false
}

// Security context for requests
export interface SecurityContext {
  userId: string
  userRole: UserRole
  sessionId: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  dataScope: DataAccessScope
}

export function createSecurityContext(
  userId: string,
  userRole: UserRole,
  sessionId: string,
  ipAddress: string,
  userAgent: string
): SecurityContext {
  return {
    userId,
    userRole,
    sessionId,
    ipAddress,
    userAgent,
    timestamp: new Date(),
    dataScope: getDataAccessScope(userRole, userId),
  }
}
