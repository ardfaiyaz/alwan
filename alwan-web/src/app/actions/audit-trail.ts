'use server'

import { createClient } from '@/lib/supabase/server'
import { AuditTrailEntry } from '@/types/approvals'

/**
 * Log an audit trail entry
 */
export async function logAuditTrail(data: {
  applicationId: string
  action: 'viewed' | 'approved' | 'rejected' | 'note_added' | 'status_changed'
  performedBy: string
  performedByName: string
  details: string
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('approval_audit_trail')
      .insert({
        application_id: data.applicationId,
        action: data.action,
        performed_by: data.performedBy,
        performed_by_name: data.performedByName,
        details: data.details,
      })

    if (error) {
      console.error('Log audit trail error:', error)
      return { error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Log audit trail exception:', error)
    return { error: 'Failed to log audit trail' }
  }
}

/**
 * Get audit trail for an application
 */
export async function getAuditTrail(applicationId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('approval_audit_trail')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get audit trail error:', error)
      return { error: error.message, entries: [] }
    }

    return { entries: data as AuditTrailEntry[], error: null }
  } catch (error) {
    console.error('Get audit trail exception:', error)
    return { error: 'Failed to load audit trail', entries: [] }
  }
}

/**
 * Get audit trail for multiple applications
 */
export async function getBulkAuditTrail(applicationIds: string[]) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('approval_audit_trail')
      .select('*')
      .in('application_id', applicationIds)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get bulk audit trail error:', error)
      return { error: error.message, entries: [] }
    }

    return { entries: data as AuditTrailEntry[], error: null }
  } catch (error) {
    console.error('Get bulk audit trail exception:', error)
    return { error: 'Failed to load audit trail', entries: [] }
  }
}
