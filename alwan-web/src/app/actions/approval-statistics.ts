'use server'

import { createClient } from '@/lib/supabase/server'
import { ApprovalStatistics } from '@/types/approvals'

/**
 * Get approval statistics
 */
export async function getApprovalStatistics() {
  try {
    const supabase = await createClient()

    // Get all applications
    const { data: applications, error } = await supabase
      .from('kyc_applications')
      .select('status, submitted_at, approved_at, created_at')

    if (error) {
      console.error('Get statistics error:', error)
      return { error: error.message, statistics: null }
    }

    const total = applications.length
    const pending = applications.filter(a => a.status === 'pending').length
    const in_review = applications.filter(a => a.status === 'in_review').length
    const approved = applications.filter(a => a.status === 'approved').length
    const rejected = applications.filter(a => a.status === 'rejected').length

    // Calculate approval rate
    const processed = approved + rejected
    const approval_rate = processed > 0 ? (approved / processed) * 100 : 0

    // Calculate average processing time (in hours)
    const processedApps = applications.filter(a => 
      (a.status === 'approved' || a.status === 'rejected') && 
      a.submitted_at && 
      a.approved_at
    )
    
    let avg_processing_time = 0
    if (processedApps.length > 0) {
      const totalTime = processedApps.reduce((sum, app) => {
        const submitted = new Date(app.submitted_at!).getTime()
        const processed = new Date(app.approved_at!).getTime()
        return sum + (processed - submitted)
      }, 0)
      avg_processing_time = totalTime / processedApps.length / (1000 * 60 * 60) // Convert to hours
    }

    // Get today's approvals and rejections
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const today_approved = applications.filter(a => 
      a.status === 'approved' && 
      a.approved_at && 
      new Date(a.approved_at) >= today
    ).length

    const today_rejected = applications.filter(a => 
      a.status === 'rejected' && 
      a.approved_at && 
      new Date(a.approved_at) >= today
    ).length

    const statistics: ApprovalStatistics = {
      total,
      pending,
      in_review,
      approved,
      rejected,
      approval_rate: Math.round(approval_rate * 10) / 10,
      avg_processing_time: Math.round(avg_processing_time * 10) / 10,
      today_approved,
      today_rejected
    }

    return { statistics, error: null }
  } catch (error) {
    console.error('Get statistics exception:', error)
    return { error: 'Failed to load statistics', statistics: null }
  }
}
