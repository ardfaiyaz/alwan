/**
 * Global Type Definitions
 * @module lib/types
 */

import { ROLES } from '../constants/roles'

// User types
export type UserRole = typeof ROLES[keyof typeof ROLES]

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  branchId?: string | null
  areaId?: string | null
  phone?: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
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

// Common entity types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string
  updatedBy?: string
}

// Form types
export interface FormState<T = any> {
  data: T
  errors: Record<string, string>
  isSubmitting: boolean
  isValid: boolean
}

// Filter types
export interface BaseFilters {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  searchQuery?: string
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}
