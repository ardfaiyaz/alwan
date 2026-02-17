/**
 * Formatting utilities for KMBI admin dashboard
 */

/**
 * Format amount in Philippine Peso
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}

/**
 * Format date in readable format
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(d)
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
}

/**
 * Format loan status with color
 */
export function formatLoanStatus(status: string): {
    label: string
    color: string
    bgColor: string
} {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
        draft: { label: 'Draft', color: 'text-gray-700', bgColor: 'bg-gray-100' },
        pending_branch_manager: { label: 'Pending Branch Manager', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
        pending_area_manager: { label: 'Pending Area Manager', color: 'text-orange-700', bgColor: 'bg-orange-100' },
        approved: { label: 'Approved', color: 'text-blue-700', bgColor: 'bg-blue-100' },
        disbursed: { label: 'Disbursed', color: 'text-green-700', bgColor: 'bg-green-100' },
        active: { label: 'Active', color: 'text-green-700', bgColor: 'bg-green-100' },
        completed: { label: 'Completed', color: 'text-gray-700', bgColor: 'bg-gray-100' },
        rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' }
    }

    return statusMap[status] || { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' }
}

/**
 * Format user role
 */
export function formatUserRole(role: string): string {
    const roleMap: Record<string, string> = {
        field_officer: 'Field Officer',
        branch_manager: 'Branch Manager',
        area_manager: 'Area Manager',
        admin: 'Administrator'
    }

    return roleMap[role] || role
}

/**
 * Format loan type
 */
export function formatLoanType(type: string): string {
    const typeMap: Record<string, string> = {
        kabalikat: 'Kabalikat',
        maunlad: 'Maunlad',
        masagana: 'Masagana',
        k_flex: 'K-Flex',
        k_agapay: 'K-Agapay',
        k_silong: 'K-Silong'
    }

    return typeMap[type] || type
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`
}
