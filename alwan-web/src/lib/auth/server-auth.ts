import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { canAccessPage, hasPermission, UserRole, Resource, Action } from '@/lib/rbac/permissions'

/**
 * Get the current user's session and profile
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    role: profile.role as UserRole,
    profile
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

/**
 * Require specific role - redirect to dashboard if insufficient permissions
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()
  
  if (!allowedRoles.includes(user.role)) {
    redirect('/admin/dashboard')
  }
  
  return user
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole(['admin'])
}

/**
 * Require manager role (area or branch manager)
 */
export async function requireManager() {
  return requireRole(['admin', 'area_manager', 'branch_manager'])
}

/**
 * Check page access and redirect if unauthorized
 */
export async function requirePageAccess(pathname: string) {
  const user = await requireAuth()
  
  if (!canAccessPage(user.role, pathname)) {
    redirect('/admin/dashboard')
  }
  
  return user
}

/**
 * Check if user has permission for a resource action
 */
export async function checkPermission(resource: Resource, action: Action) {
  const user = await requireAuth()
  
  if (!hasPermission(user.role, resource, action)) {
    throw new Error(`You do not have permission to ${action} ${resource}`)
  }
  
  return user
}

/**
 * Get user with permission check (returns null if no permission)
 */
export async function getUserWithPermission(resource: Resource, action: Action) {
  const user = await getCurrentUser()
  
  if (!user || !hasPermission(user.role, resource, action)) {
    return null
  }
  
  return user
}
