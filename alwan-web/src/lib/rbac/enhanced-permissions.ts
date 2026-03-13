/**
 * Enhanced Permission System with Field-Level Access Control
 * Provides granular control over data access
 */

import { UserRole, PermissionResource } from './permissions'

// Field-level permissions for sensitive data
export interface FieldPermission {
  resource: PermissionResource
  field: string
  roles: UserRole[]
  readOnly?: boolean
}

// Define which roles can access which fields
export const FIELD_PERMISSIONS: FieldPermission[] = [
  // Member sensitive fields
  { resource: 'members', field: 'ssn', roles: ['admin'], readOnly: true },
  { resource: 'members', field: 'tax_id', roles: ['admin', 'area_manager'], readOnly: true },
  { resource: 'members', field: 'bank_account', roles: ['admin', 'area_manager', 'branch_manager'] },
  { resource: 'members', field: 'salary', roles: ['admin', 'area_manager', 'branch_manager'] },
  { resource: 'members', field: 'credit_score', roles: ['admin', 'area_manager'] },
  
  // Loan sensitive fields
  { resource: 'loans', field: 'interest_rate', roles: ['admin', 'area_manager', 'branch_manager'] },
  { resource: 'loans', field: 'collateral_value', roles: ['admin', 'area_manager', 'branch_manager'] },
  { resource: 'loans', field: 'guarantor_details', roles: ['admin', 'area_manager', 'branch_manager'] },
  
  // User management fields
  { resource: 'users', field: 'password_hash', roles: ['admin'], readOnly: true },
  { resource: 'users', field: 'email', roles: ['admin', 'area_manager'] },
  { resource: 'users', field: 'phone', roles: ['admin', 'area_manager', 'branch_manager'] },
  
  // Settings fields
  { resource: 'settings', field: 'api_keys', roles: ['admin'], readOnly: true },
  { resource: 'settings', field: 'database_config', roles: ['admin'], readOnly: true },
  { resource: 'settings', field: 'email_config', roles: ['admin'] },
]

/**
 * Check if a role can access a specific field
 */
export function canAccessField(
  userRole: UserRole,
  resource: PermissionResource,
  field: string
): { canRead: boolean; canWrite: boolean } {
  const permission = FIELD_PERMISSIONS.find(
    fp => fp.resource === resource && fp.field === field
  )

  if (!permission) {
    // If no specific permission defined, allow access based on resource permission
    return { canRead: true, canWrite: true }
  }

  const hasAccess = permission.roles.includes(userRole)
  return {
    canRead: hasAccess,
    canWrite: hasAccess && !permission.readOnly,
  }
}

/**
 * Filter object fields based on user role permissions
 */
export function filterSensitiveFields<T extends Record<string, any>>(
  userRole: UserRole,
  resource: PermissionResource,
  data: T
): Partial<T> {
  const filtered: Partial<T> = {}

  for (const [key, value] of Object.entries(data)) {
    const { canRead } = canAccessField(userRole, resource, key)
    if (canRead) {
      filtered[key as keyof T] = value
    }
  }

  return filtered
}

/**
 * Mask sensitive fields for unauthorized roles
 */
export function maskSensitiveData<T extends Record<string, any>>(
  userRole: UserRole,
  resource: PermissionResource,
  data: T
): T {
  const masked = { ...data }

  for (const key of Object.keys(data)) {
    const { canRead } = canAccessField(userRole, resource, key)
    if (!canRead) {
      masked[key as keyof T] = '***REDACTED***' as any
    }
  }

  return masked
}

// Data classification levels
export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

// Map resources to their data classification
export const RESOURCE_CLASSIFICATION: Record<PermissionResource, DataClassification> = {
  dashboard: DataClassification.INTERNAL,
  centers: DataClassification.INTERNAL,
  members: DataClassification.CONFIDENTIAL,
  loans: DataClassification.CONFIDENTIAL,
  collections: DataClassification.CONFIDENTIAL,
  reports: DataClassification.INTERNAL,
  users: DataClassification.RESTRICTED,
  settings: DataClassification.RESTRICTED,
  audit_logs: DataClassification.RESTRICTED,
  approvals: DataClassification.CONFIDENTIAL,
}

// Minimum role required for each classification level
export const CLASSIFICATION_MIN_ROLE: Record<DataClassification, UserRole[]> = {
  [DataClassification.PUBLIC]: ['admin', 'area_manager', 'branch_manager', 'field_officer'],
  [DataClassification.INTERNAL]: ['admin', 'area_manager', 'branch_manager', 'field_officer'],
  [DataClassification.CONFIDENTIAL]: ['admin', 'area_manager', 'branch_manager'],
  [DataClassification.RESTRICTED]: ['admin'],
}

/**
 * Check if user role meets minimum classification requirement
 */
export function meetsClassificationRequirement(
  userRole: UserRole,
  classification: DataClassification
): boolean {
  return CLASSIFICATION_MIN_ROLE[classification].includes(userRole)
}

/**
 * Get data classification for a resource
 */
export function getResourceClassification(resource: PermissionResource): DataClassification {
  return RESOURCE_CLASSIFICATION[resource]
}
