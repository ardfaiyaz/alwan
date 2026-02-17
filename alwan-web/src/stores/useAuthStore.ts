/**
 * Zustand store for authentication state
 * Manages current user profile and permissions
 */

import { create } from 'zustand'

export type UserRole = 'field_officer' | 'branch_manager' | 'area_manager' | 'admin'

export interface UserProfile {
    id: string
    email: string
    fullName: string
    role: UserRole
    branchId?: string
    areaId?: string
    phone?: string
    isActive: boolean
}

interface AuthStoreState {
    user: UserProfile | null
    isLoading: boolean

    // Actions
    setUser: (user: UserProfile | null) => void
    setLoading: (isLoading: boolean) => void
    clearUser: () => void

    // Permission helpers
    canCreateLoan: () => boolean
    canApproveLoan: (loanAmount: number) => boolean
    canViewAllCenters: () => boolean
    canRecordCollection: () => boolean
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
    user: null,
    isLoading: true,

    setUser: (user) => set({ user, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
    clearUser: () => set({ user: null }),

    // Permission helpers
    canCreateLoan: () => {
        const { user } = get()
        if (!user) return false
        return ['field_officer', 'branch_manager', 'admin'].includes(user.role)
    },

    canApproveLoan: (loanAmount: number) => {
        const { user } = get()
        if (!user) return false

        // Admin can approve any loan
        if (user.role === 'admin') return true

        // Area Manager can approve any loan
        if (user.role === 'area_manager') return true

        // Branch Manager can approve loans up to ₱50,000
        if (user.role === 'branch_manager' && loanAmount <= 50000) return true

        return false
    },

    canViewAllCenters: () => {
        const { user } = get()
        if (!user) return false
        return ['admin', 'area_manager'].includes(user.role)
    },

    canRecordCollection: () => {
        const { user } = get()
        if (!user) return false
        return ['field_officer', 'branch_manager', 'admin'].includes(user.role)
    }
}))
