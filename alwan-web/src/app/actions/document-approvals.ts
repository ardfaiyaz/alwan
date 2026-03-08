'use server'

import { createClient } from '@/lib/supabase/server'
import * as Sentry from '@sentry/nextjs'

export async function getDocumentApprovals() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Check if user is admin/staff
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'branch_manager', 'area_manager'].includes(profile.role)) {
      return { error: 'Unauthorized - Admin access required' }
    }

    // Get documents with member info
    const { data, error } = await supabase
      .from('member_documents')
      .select(`
        *,
        members:member_id (
          id,
          first_name,
          middle_name,
          last_name,
          phone,
          address
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return { error: error.message }
    }

    // Format the data
    const documents = data.map((doc: any) => ({
      id: doc.id,
      member_id: doc.member_id,
      member_name: `${doc.members.first_name} ${doc.members.middle_name || ''} ${doc.members.last_name}`.trim(),
      member_phone: doc.members.phone,
      member_address: doc.members.address,
      document_type: doc.document_type,
      file_name: doc.file_name,
      file_url: doc.file_url,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      status: doc.status,
      created_at: doc.created_at,
      rejection_reason: doc.rejection_reason,
    }))

    return { documents }
  } catch (error: any) {
    console.error('Error in getDocumentApprovals:', error)
    Sentry.captureException(error, {
      tags: { action: 'getDocumentApprovals' },
    })
    return { error: error.message || 'Failed to fetch documents' }
  }
}

export async function approveDocument(documentId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Check if user is admin/staff
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'branch_manager', 'area_manager'].includes(profile.role)) {
      return { error: 'Unauthorized - Admin access required' }
    }

    // Update document status
    const { error } = await supabase
      .from('member_documents')
      .update({
        status: 'verified',
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) {
      console.error('Error approving document:', error)
      return { error: error.message }
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: profile.role,
      action: 'approve_document',
      resource_type: 'member_documents',
      resource_id: documentId,
      success: true,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error in approveDocument:', error)
    Sentry.captureException(error, {
      tags: { action: 'approveDocument' },
    })
    return { error: error.message || 'Failed to approve document' }
  }
}

export async function rejectDocument(documentId: string, reason: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Check if user is admin/staff
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'branch_manager', 'area_manager'].includes(profile.role)) {
      return { error: 'Unauthorized - Admin access required' }
    }

    // Update document status
    const { error } = await supabase
      .from('member_documents')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) {
      console.error('Error rejecting document:', error)
      return { error: error.message }
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: profile.role,
      action: 'reject_document',
      resource_type: 'member_documents',
      resource_id: documentId,
      new_values: { rejection_reason: reason },
      success: true,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error in rejectDocument:', error)
    Sentry.captureException(error, {
      tags: { action: 'rejectDocument' },
    })
    return { error: error.message || 'Failed to reject document' }
  }
}
