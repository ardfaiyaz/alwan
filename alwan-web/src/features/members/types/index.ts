/**
 * Member Feature - Type Definitions
 * @module features/members/types
 */

export interface Member {
  id: string
  firstName: string
  lastName: string
  middleName?: string | null
  centerId: string
  center?: { id: string; name: string; code?: string } | null
  isActive: boolean
  cbuBalance: number
  joinedDate: string
  phone?: string | null
  address: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  businessName?: string | null
  businessType?: string | null
  businessAddress?: string | null
  spouseName?: string | null
  beneficiaryName?: string | null
  beneficiaryRelationship?: string | null
  beneficiaryPhone?: string | null
}

export interface MemberFormData {
  centerId: string
  firstName: string
  lastName: string
  middleName?: string | null
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phone?: string | null
  address: string
  businessName?: string | null
  businessType?: string | null
  businessAddress?: string | null
  spouseName?: string | null
  beneficiaryName?: string | null
  beneficiaryRelationship?: string | null
  beneficiaryPhone?: string | null
}

export interface MemberLoan {
  id: string
  loanType: string
  principalAmount: number
  outstandingBalance: number
  status: string
  disbursementDate: string
  weeklyPayment: number
}

export interface MemberFilters {
  centerId?: string
  isActive?: boolean
  searchQuery?: string
}
