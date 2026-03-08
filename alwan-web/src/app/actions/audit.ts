'use server'

import { createClient } from '@/lib/supabase/server'

type AuditAction = 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'bulk_deactivate'

export async function createAuditLog({
    action,
    resourceType,
    resourceId,
    oldValues,
    newValues,
    userAgent,
    ipAddress
}: {
    action: AuditAction
    resourceType: string
    resourceId: string
    oldValues?: any
    newValues?: any
    userAgent?: string
    ipAddress?: string
}) {
    try {
        const supabase = await createClient()
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('User not authenticated')
        }

        // Get user profile for role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, email, full_name')
            .eq('id', user.id)
            .single()

        // Insert audit log
        const { error } = await supabase
            .from('audit_logs')
            .insert({
                user_id: user.id,
                user_email: profile?.email || user.email,
                user_role: profile?.role,
                action,
                resource_type: resourceType,
                resource_id: resourceId,
                old_values: oldValues || null,
                new_values: newValues || null,
                ip_address: ipAddress || null,
                user_agent: userAgent || null,
                success: true
            })

        if (error) {
            console.error('Error creating audit log:', error)
        }

        return { success: true }
    } catch (error) {
        console.error('Error in createAuditLog:', error)
        return { success: false }
    }
}

export async function getAuditLogs({
    resourceType,
    resourceId,
    userId,
    action,
    startDate,
    endDate,
    limit = 100,
    offset = 0
}: {
    resourceType?: string
    resourceId?: string
    userId?: string
    action?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
} = {}) {
    try {
        const supabase = await createClient()

        let query = supabase
            .from('audit_logs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (resourceType) {
            query = query.eq('resource_type', resourceType)
        }

        if (resourceId) {
            query = query.eq('resource_id', resourceId)
        }

        if (userId) {
            query = query.eq('user_id', userId)
        }

        if (action) {
            query = query.eq('action', action)
        }

        if (startDate) {
            query = query.gte('created_at', startDate)
        }

        if (endDate) {
            query = query.lte('created_at', endDate)
        }

        const { data, error, count } = await query

        if (error) throw error

        return {
            logs: data || [],
            total: count || 0
        }
    } catch (error) {
        console.error('Error fetching audit logs:', error)
        throw error
    }
}
