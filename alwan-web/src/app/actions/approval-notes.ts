'use server'

import { createClient } from '@/lib/supabase/server'
import { ApplicationNote } from '@/types/approvals'

/**
 * Add a note to an application
 */
export async function addApplicationNote(data: {
  applicationId: string
  note: string
  adminId: string
  adminName: string
}) {
  try {
    const supabase = await createClient()

    const { data: noteData, error } = await supabase
      .from('application_notes')
      .insert({
        application_id: data.applicationId,
        admin_id: data.adminId,
        admin_name: data.adminName,
        note: data.note,
      })
      .select()
      .single()

    if (error) {
      console.error('Add note error:', error)
      return { error: error.message }
    }

    return { note: noteData as ApplicationNote, error: null }
  } catch (error) {
    console.error('Add note exception:', error)
    return { error: 'Failed to add note' }
  }
}

/**
 * Get all notes for an application
 */
export async function getApplicationNotes(applicationId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('application_notes')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get notes error:', error)
      return { error: error.message, notes: [] }
    }

    return { notes: data as ApplicationNote[], error: null }
  } catch (error) {
    console.error('Get notes exception:', error)
    return { error: 'Failed to load notes', notes: [] }
  }
}

/**
 * Delete a note
 */
export async function deleteApplicationNote(noteId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('application_notes')
      .delete()
      .eq('id', noteId)

    if (error) {
      console.error('Delete note error:', error)
      return { error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Delete note exception:', error)
    return { error: 'Failed to delete note' }
  }
}
