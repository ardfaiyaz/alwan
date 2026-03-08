/**
 * Formatting Utilities - Shared across Web and Mobile
 * @module @alwan/shared/utils
 */

/**
 * Format currency in Philippine Peso
 * @param amount - Amount to format
 * @param includeSymbol - Include ₱ symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, includeSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return includeSymbol ? `₱${formatted}` : formatted
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @param format - Format type ('short' | 'long' | 'full')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'full' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    case 'long':
      return dateObj.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    case 'full':
      return dateObj.toLocaleDateString('en-PH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    default:
      return dateObj.toLocaleDateString('en-PH')
  }
}

/**
 * Format phone number to Philippine format
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as +63 XXX XXX XXXX
  if (cleaned.startsWith('63')) {
    const number = cleaned.slice(2)
    return `+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
  }
  
  // Format as 0XXX XXX XXXX
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  return phone
}

/**
 * Format full name from parts
 * @param firstName - First name
 * @param lastName - Last name
 * @param middleName - Middle name (optional)
 * @returns Formatted full name
 */
export function formatFullName(
  firstName: string,
  lastName: string,
  middleName?: string | null
): string {
  if (middleName) {
    return `${firstName} ${middleName} ${lastName}`
  }
  return `${firstName} ${lastName}`
}

/**
 * Format percentage
 * @param value - Value to format (0.02 = 2%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}
