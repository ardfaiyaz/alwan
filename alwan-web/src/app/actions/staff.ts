'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createAuditLog } from './audit'

type UserRole = 'admin' | 'area_manager' | 'branch_manager' | 'field_officer'

export interface CreateStaffData {
  username: string
  first_name: string
  last_name: string
  role: UserRole
  area_id?: string
  branch_id?: string
  phone?: string
  password: string
}

export interface UpdateStaffData {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  area_id?: string
  branch_id?: string
  phone?: string
}

/**
 * Create a new staff member using admin privileges
 * This bypasses RLS policies and creates both auth user and profile
 */
export async function createStaff(data: CreateStaffData) {
  try {
    const supabase = createAdminClient()
    
    // Validate username format
    if (data.username.length < 3) {
      return { error: 'Username must be at least 3 characters' }
    }

    if (!/^[a-z0-9]+([._-]?[a-z0-9]+)*$/.test(data.username)) {
      return { error: 'Invalid username format. Use letters, numbers, and single dots/hyphens/underscores.' }
    }

    if (/^[._-]|[._-]$/.test(data.username)) {
      return { error: 'Username cannot start or end with special characters' }
    }

    if (data.password.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }

    const full_name = `${data.first_name} ${data.last_name}`.trim()
    const email = `${data.username}@alwan.com`

    // Check if email already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingProfile) {
      return { error: 'This email is already taken' }
    }

    // Create auth user with admin client
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: data.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name,
        role: data.role
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user' }
    }

    // Create profile (trigger should handle this, but we'll do it explicitly for safety)
    const newProfile = {
      id: authData.user.id,
      email: email,
      full_name,
      role: data.role,
      area_id: data.area_id || null,
      branch_id: data.branch_id || null,
      phone: data.phone || null,
      is_active: true
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(newProfile, { onConflict: 'id' })

    if (profileError) {
      console.error('Profile error:', profileError)
      // Try to clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { error: profileError.message }
    }

    // Create audit log
    await createAuditLog({
      action: 'create',
      resourceType: 'staff',
      resourceId: authData.user.id,
      newValues: newProfile
    })

    return { 
      success: true, 
      data: newProfile
    }
  } catch (error: any) {
    console.error('Error creating staff:', error)
    return { error: error.message || 'Failed to create staff member' }
  }
}

/**
 * Update an existing staff member
 */
export async function updateStaff(data: UpdateStaffData) {
  try {
    const supabase = createAdminClient()
    
    const full_name = `${data.first_name} ${data.last_name}`.trim()

    const updates = {
      full_name,
      role: data.role,
      area_id: data.area_id || null,
      branch_id: data.branch_id || null,
      phone: data.phone || null,
      updated_at: new Date().toISOString()
    }

    // Get old values for audit
    const { data: oldProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.id)
      .single()

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', data.id)

    if (error) {
      console.error('Update error:', error)
      return { error: error.message }
    }

    // Create audit log
    await createAuditLog({
      action: 'update',
      resourceType: 'staff',
      resourceId: data.id,
      oldValues: oldProfile,
      newValues: updates
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error updating staff:', error)
    return { error: error.message || 'Failed to update staff member' }
  }
}

/**
 * Toggle staff active status
 */
export async function toggleStaffStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        is_active: !currentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Toggle status error:', error)
      return { error: error.message }
    }

    // Create audit log
    await createAuditLog({
      action: currentStatus ? 'deactivate' : 'activate',
      resourceType: 'staff',
      resourceId: id,
      oldValues: { is_active: currentStatus },
      newValues: { is_active: !currentStatus }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error toggling status:', error)
    return { error: error.message || 'Failed to update status' }
  }
}

/**
 * Check if email is available
 */
export async function checkEmailAvailability(username: string) {
  try {
    const supabase = createAdminClient()
    const email = `${username}@alwan.com`

    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      return { error: error.message }
    }

    return { available: !data }
  } catch (error: any) {
    console.error('Error checking email:', error)
    return { error: error.message }
  }
}
