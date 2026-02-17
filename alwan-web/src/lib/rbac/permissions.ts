/**
 * Role-Based Access Control (RBAC) Utilities
 * Defines permissions and access control for KMBI microfinance system
 */

export type UserRole = 'admin' | 'area_manager' | 'branch_manager' | 'field_officer'

export type PermissionResource =
    | 'dashboard'
    | 'centers'
    | 'members'
    | 'loans'
    | 'collections'
    | 'reports'
    | 'users'
    | 'settings'
    | 'audit_logs'
    | 'approvals'

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export'

export interface Permission {
    resource: PermissionResource
    action: PermissionAction
}

/**
 * Permission matrix defining what each role can do
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    admin: [
        // Full access to everything
        { resource: 'dashboard', action: 'view' },
        { resource: 'centers', action: 'view' },
        { resource: 'centers', action: 'create' },
        { resource: 'centers', action: 'edit' },
        { resource: 'centers', action: 'delete' },
        { resource: 'members', action: 'view' },
        { resource: 'members', action: 'create' },
        { resource: 'members', action: 'edit' },
        { resource: 'members', action: 'delete' },
        { resource: 'loans', action: 'view' },
        { resource: 'loans', action: 'create' },
        { resource: 'loans', action: 'edit' },
        { resource: 'loans', action: 'delete' },
        { resource: 'loans', action: 'approve' },
        { resource: 'collections', action: 'view' },
        { resource: 'collections', action: 'create' },
        { resource: 'collections', action: 'edit' },
        { resource: 'reports', action: 'view' },
        { resource: 'reports', action: 'export' },
        { resource: 'users', action: 'view' },
        { resource: 'users', action: 'create' },
        { resource: 'users', action: 'edit' },
        { resource: 'users', action: 'delete' },
        { resource: 'settings', action: 'view' },
        { resource: 'settings', action: 'edit' },
        { resource: 'audit_logs', action: 'view' },
        { resource: 'approvals', action: 'view' },
        { resource: 'approvals', action: 'approve' },
    ],

    area_manager: [
        { resource: 'dashboard', action: 'view' },
        { resource: 'centers', action: 'view' },
        { resource: 'centers', action: 'edit' },
        { resource: 'members', action: 'view' },
        { resource: 'loans', action: 'view' },
        { resource: 'loans', action: 'approve' },
        { resource: 'collections', action: 'view' },
        { resource: 'reports', action: 'view' },
        { resource: 'reports', action: 'export' },
        { resource: 'approvals', action: 'view' },
        { resource: 'approvals', action: 'approve' },
    ],

    branch_manager: [
        { resource: 'dashboard', action: 'view' },
        { resource: 'centers', action: 'view' },
        { resource: 'centers', action: 'create' },
        { resource: 'centers', action: 'edit' },
        { resource: 'members', action: 'view' },
        { resource: 'members', action: 'create' },
        { resource: 'members', action: 'edit' },
        { resource: 'loans', action: 'view' },
        { resource: 'loans', action: 'create' },
        { resource: 'loans', action: 'approve' },
        { resource: 'collections', action: 'view' },
        { resource: 'collections', action: 'create' },
        { resource: 'reports', action: 'view' },
        { resource: 'reports', action: 'export' },
        { resource: 'approvals', action: 'view' },
        { resource: 'approvals', action: 'approve' },
    ],

    field_officer: [
        { resource: 'dashboard', action: 'view' },
        { resource: 'centers', action: 'view' },
        { resource: 'members', action: 'view' },
        { resource: 'members', action: 'create' },
        { resource: 'members', action: 'edit' },
        { resource: 'loans', action: 'view' },
        { resource: 'loans', action: 'create' },
        { resource: 'collections', action: 'view' },
        { resource: 'collections', action: 'create' },
        { resource: 'collections', action: 'edit' },
        { resource: 'reports', action: 'view' },
    ],
}

/**
 * Check if a user has permission to perform an action on a resource
 */
export function hasPermission(
    userRole: UserRole,
    resource: PermissionResource,
    action: PermissionAction
): boolean {
    const permissions = ROLE_PERMISSIONS[userRole]
    return permissions.some(
        (p) => p.resource === resource && p.action === action
    )
}

/**
 * Check if a user can approve a loan based on their role and loan amount
 */
export function canApproveLoan(
    userRole: UserRole,
    loanAmount: number
): boolean {
    if (userRole === 'admin') return true
    if (userRole === 'area_manager') return true
    if (userRole === 'branch_manager') return loanAmount <= 20000
    return false
}

/**
 * Get the next approval status for a loan based on current user role and amount
 */
export function getNextLoanStatus(
    currentRole: UserRole,
    loanAmount: number,
    action: 'approve' | 'reject' | 'request_revision'
): string {
    if (action === 'reject') return 'rejected'
    if (action === 'request_revision') return 'draft'

    if (currentRole === 'field_officer') {
        return 'pending_branch_manager'
    }

    if (currentRole === 'branch_manager') {
        return loanAmount > 20000 ? 'pending_area_manager' : 'approved'
    }

    if (currentRole === 'area_manager' || currentRole === 'admin') {
        return 'approved'
    }

    return 'pending_field_officer'
}

/**
 * Get all resources a role has access to
 */
export function getAccessibleResources(userRole: UserRole): PermissionResource[] {
    const permissions = ROLE_PERMISSIONS[userRole]
    return [...new Set(permissions.map(p => p.resource))]
}

/**
 * Get all actions a role can perform on a specific resource
 */
export function getResourceActions(
    userRole: UserRole,
    resource: PermissionResource
): PermissionAction[] {
    const permissions = ROLE_PERMISSIONS[userRole]
    return permissions
        .filter(p => p.resource === resource)
        .map(p => p.action)
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: UserRole, route: string): boolean {
    // Map routes to resources
    const routeResourceMap: Record<string, PermissionResource> = {
        '/admin/dashboard': 'dashboard',
        '/admin/centers': 'centers',
        '/admin/members': 'members',
        '/admin/loans': 'loans',
        '/admin/collections': 'collections',
        '/admin/reports': 'reports',
        '/admin/users': 'users',
        '/admin/settings': 'settings',
        '/admin/audit-logs': 'audit_logs',
        '/admin/approvals': 'approvals',
    }

    const resource = routeResourceMap[route]
    if (!resource) return false

    return hasPermission(userRole, resource, 'view')
}
