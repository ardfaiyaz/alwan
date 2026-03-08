/**
 * Shared Type Definitions
 * @module @alwan/shared/types
 */

// User roles
export type UserRole = 'admin' | 'area_manager' | 'branch_manager' | 'field_officer' | 'member'

// Loan types
export type LoanStatus = 
  | 'draft'
  | 'pending_field_officer'
  | 'pending_branch_manager'
  | 'pending_area_manager'
  | 'approved'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'defaulted'

export type LoanType = 'regular' | 'emergency' | 'business' | 'education'

// Collection types
export type CollectionStatus = 'draft' | 'submitted' | 'verified' | 'posted'

export type PaymentMethod = 'cash' | 'bank_transfer' | 'gcash' | 'maya'

// Member types
export type MemberStatus = 'active' | 'inactive' | 'suspended'

export type Gender = 'male' | 'female' | 'other'

// Common interfaces
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Member extends BaseEntity {
  firstName: string
  lastName: string
  middleName?: string | null
  dateOfBirth: string
  gender: Gender
  phone?: string | null
  address: string
  centerId: string
  isActive: boolean
  cbuBalance: number
  joinedDate: string
}

export interface Loan extends BaseEntity {
  memberId: string
  loanType: LoanType
  principalAmount: number
  interestRate: number
  termWeeks: number
  weeklyPayment: number
  outstandingBalance: number
  status: LoanStatus
  disbursementDate?: string | null
  completionDate?: string | null
}

export interface Collection extends BaseEntity {
  memberId: string
  loanId?: string | null
  collectionDate: string
  loanPayment: number
  cbuPayment: number
  insurancePayment: number
  totalAmount: number
  paymentMethod: PaymentMethod
  status: CollectionStatus
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
