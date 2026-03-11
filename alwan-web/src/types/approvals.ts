/**
 * Type definitions for approvals system
 */

export interface ApplicationNote {
  id: string
  application_id: string
  admin_id: string
  admin_name: string
  note: string
  created_at: string
}

export interface AuditTrailEntry {
  id: string
  application_id: string
  action: 'viewed' | 'approved' | 'rejected' | 'note_added' | 'status_changed'
  performed_by: string
  performed_by_name: string
  details: string
  created_at: string
}

export interface AdvancedFilters {
  dateRange?: {
    start: string
    end: string
  }
  cities?: string[]
  provinces?: string[]
  businessTypes?: string[]
  incomeRange?: {
    min: number
    max: number
  }
  riskLevel?: ('low' | 'medium' | 'high' | 'very_high')[]
}

export interface SavedSearch {
  id: string
  name: string
  filters: AdvancedFilters
  searchQuery: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  created_at: string
}

export interface DocumentVerificationStatus {
  id_front: boolean
  id_back: boolean
  selfie: boolean
  face_match: boolean
  id_number_match: boolean
  name_match: boolean
  id_valid: boolean
  images_clear: boolean
  verified_by?: string
  verified_at?: string
}

export interface ApprovalStatistics {
  total: number
  pending: number
  in_review: number
  approved: number
  rejected: number
  approval_rate: number
  avg_processing_time: number // in hours
  today_approved: number
  today_rejected: number
}
