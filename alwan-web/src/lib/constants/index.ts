/**
 * Application Constants - Public API
 * @module lib/constants
 */

export * from './routes'
export * from './roles'

// Business constants
export const LOAN_CONSTANTS = {
  MIN_AMOUNT: 1000,
  MAX_AMOUNT: 50000,
  MIN_TERM_WEEKS: 10,
  MAX_TERM_WEEKS: 52,
  INTEREST_RATE: 0.02, // 2% per week
} as const

export const CBU_CONSTANTS = {
  MIN_BALANCE: 0,
  WEEKLY_CONTRIBUTION: 20,
} as const

export const INSURANCE_CONSTANTS = {
  WEEKLY_PREMIUM: 10,
  COVERAGE_AMOUNT: 50000,
} as const

// Status constants
export const LOAN_STATUS = {
  DRAFT: 'draft',
  PENDING_FIELD_OFFICER: 'pending_field_officer',
  PENDING_BRANCH_MANAGER: 'pending_branch_manager',
  PENDING_AREA_MANAGER: 'pending_area_manager',
  APPROVED: 'approved',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  DEFAULTED: 'defaulted',
} as const

export const COLLECTION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  POSTED: 'posted',
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
} as const
