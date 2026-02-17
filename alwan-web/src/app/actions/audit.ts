'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export interface AuditLogData {
    action: string
    resourceType: string
    resourceId?: string
    oldValues?: any
    newValues?: any
    success?: boolean
    errorMessage?: string
}

/**
 * Log an audit trail entry for any system action
 * Automatically captures user info, IP address, and user agent
 */
export async function logAudit(data: AuditLogData) {
    try {
        const supabase = await createClient()
        const headersList = await headers()

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        // Get user profile if user exists
        let profile = null
        if (user) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('email, role')
                .eq('id', user.id)
                .single()
            profile = profileData
        }

        // Get IP address and user agent
        const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
        const userAgent = headersList.get('user-agent') || 'unknown'

        // Insert audit log
        const { error } = await supabase.from('audit_logs').insert({
            user_id: user?.id || null,
            user_email: profile?.email || 'anonymous',
            user_role: profile?.role || null,
            action: data.action,
            resource_type: data.resourceType,
            resource_id: data.resourceId,
            old_values: data.oldValues || null,
            new_values: data.newValues || null,
            ip_address: ipAddress,
            user_agent: userAgent,
            success: data.success ?? true,
            error_message: data.errorMessage || null
        })

        if (error) {
            console.error('Failed to log audit trail:', error)
        }
    } catch (error) {
        // Don't throw errors from audit logging - just log them
        console.error('Audit logging error:', error)
    }
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(filters?: {
    userId?: string
    resourceType?: string
    action?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()

    let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

    if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
    }

    if (filters?.resourceType) {
        query = query.eq('resource_type', filters.resourceType)
    }

    if (filters?.action) {
        query = query.eq('action', filters.action)
    }

    if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString())
    }

    if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString())
    }

    if (filters?.limit) {
        query = query.limit(filters.limit)
    }

    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { logs: data, total: count || 0 }
}
