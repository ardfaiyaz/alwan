/**
 * Utility functions for exporting data to CSV/Excel formats
 */

import { KYCApplication } from '@/app/actions/kyc-approvals'

/**
 * Convert applications to CSV format
 */
export function exportToCSV(applications: KYCApplication[], filename: string = 'kyc-applications.csv') {
  if (applications.length === 0) {
    throw new Error('No applications to export')
  }

  // Define CSV headers
  const headers = [
    'Application ID',
    'Name',
    'Mobile Number',
    'Email',
    'Status',
    'Date of Birth',
    'Gender',
    'Civil Status',
    'Nationality',
    'City',
    'Province',
    'Business Name',
    'Business Type',
    'Years Operating',
    'Monthly Revenue',
    'Monthly Income',
    'Monthly Expenses',
    'ID Type',
    'ID Number',
    'Face Match Score',
    'Submitted At',
    'Created At',
    'Rejection Reason'
  ]

  // Convert applications to CSV rows
  const rows = applications.map(app => {
    const metadata = app.metadata
    return [
      app.id,
      `${metadata.firstName} ${metadata.middleName} ${metadata.lastName}`,
      app.mobile_number,
      metadata.email || '',
      app.status,
      metadata.dateOfBirth || '',
      metadata.gender || '',
      metadata.civilStatus || '',
      metadata.nationality || '',
      metadata.address?.city || '',
      metadata.address?.province || '',
      metadata.business?.businessName || '',
      metadata.business?.businessType || '',
      metadata.business?.yearsOperating || '',
      metadata.business?.monthlyRevenue || '',
      metadata.financial?.monthlyIncome || '',
      metadata.financial?.monthlyExpenses || '',
      metadata.identity?.idType || '',
      metadata.identity?.idNumber || '',
      metadata.identity?.faceMatchScore || '',
      app.submitted_at || '',
      app.created_at || '',
      app.rejection_reason || ''
    ].map(field => `"${String(field).replace(/"/g, '""')}"`) // Escape quotes
  })

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export applications to Excel format (using CSV with .xlsx extension)
 */
export function exportToExcel(applications: KYCApplication[], filename: string = 'kyc-applications.xlsx') {
  // For now, we'll use CSV format with .xlsx extension
  // In production, you might want to use a library like xlsx or exceljs
  exportToCSV(applications, filename.replace('.xlsx', '.csv'))
}

/**
 * Format date for export
 */
export function formatDateForExport(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
