/**
 * Business Constants - Shared across Web and Mobile
 * @module @alwan/shared/constants
 */

export const LOAN_CONSTANTS = {
  MIN_AMOUNT: 1000,
  MAX_AMOUNT: 50000,
  MIN_TERM_WEEKS: 10,
  MAX_TERM_WEEKS: 52,
  INTEREST_RATE: 0.02, // 2% per week
  SERVICE_FEE_RATE: 0.01, // 1% service fee
} as const

export const CBU_CONSTANTS = {
  MIN_BALANCE: 0,
  WEEKLY_CONTRIBUTION: 20,
  WITHDRAWAL_FEE: 10,
} as const

export const INSURANCE_CONSTANTS = {
  WEEKLY_PREMIUM: 10,
  COVERAGE_AMOUNT: 50000,
  MIN_AGE: 18,
  MAX_AGE: 65,
} as const

export const COLLECTION_CONSTANTS = {
  DAYS_OF_WEEK: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const,
  GRACE_PERIOD_DAYS: 3,
  LATE_FEE: 50,
} as const

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

export const MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const
