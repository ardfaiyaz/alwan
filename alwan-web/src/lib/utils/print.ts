/**
 * Utility functions for printing application details
 */

import { KYCApplication } from '@/app/actions/kyc-approvals'

/**
 * Generate printable HTML for an application
 */
export function generatePrintableHTML(application: KYCApplication): string {
  const metadata = application.metadata
  const fullName = `${metadata.firstName} ${metadata.middleName} ${metadata.lastName}`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>KYC Application - ${fullName}</title>
      <style>
        @media print {
          @page { margin: 2cm; }
          body { margin: 0; }
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #4dd88f;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #009245;
          margin: 0 0 10px 0;
        }
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .section-title {
          background: #4dd88f;
          color: white;
          padding: 8px 15px;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .field-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }
        .field {
          margin-bottom: 10px;
        }
        .field-label {
          font-weight: bold;
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
        }
        .field-value {
          color: #333;
          font-size: 14px;
          margin-top: 2px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ALWAN KMBI</h1>
        <h2>KYC Application Details</h2>
        <p>Application ID: ${application.id}</p>
        <span class="status-badge status-${application.status}">${application.status.toUpperCase()}</span>
      </div>

      <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Full Name</div>
            <div class="field-value">${fullName}</div>
          </div>
          <div class="field">
            <div class="field-label">Date of Birth</div>
            <div class="field-value">${metadata.dateOfBirth}</div>
          </div>
          <div class="field">
            <div class="field-label">Gender</div>
            <div class="field-value">${metadata.gender}</div>
          </div>
          <div class="field">
            <div class="field-label">Civil Status</div>
            <div class="field-value">${metadata.civilStatus}</div>
          </div>
          <div class="field">
            <div class="field-label">Nationality</div>
            <div class="field-value">${metadata.nationality}</div>
          </div>
          <div class="field">
            <div class="field-label">Mobile Number</div>
            <div class="field-value">${application.mobile_number}</div>
          </div>
          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value">${metadata.email || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Address Information</div>
        <div class="field">
          <div class="field-label">Complete Address</div>
          <div class="field-value">
            ${metadata.address.houseNumber} ${metadata.address.street}, 
            ${metadata.address.barangay}, ${metadata.address.city}, 
            ${metadata.address.province} ${metadata.address.zipCode}
          </div>
        </div>
        <div class="field">
          <div class="field-label">Housing Type</div>
          <div class="field-value">${metadata.address.housingType.replace(/_/g, ' ')}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Business Information</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Business Name</div>
            <div class="field-value">${metadata.business.businessName}</div>
          </div>
          <div class="field">
            <div class="field-label">Business Type</div>
            <div class="field-value">${metadata.business.businessType}</div>
          </div>
          <div class="field">
            <div class="field-label">Years Operating</div>
            <div class="field-value">${metadata.business.yearsOperating.replace(/_/g, ' ')}</div>
          </div>
          <div class="field">
            <div class="field-label">Monthly Revenue</div>
            <div class="field-value">₱${metadata.business.monthlyRevenue.replace(/_/g, ' - ₱')}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Financial Information</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Monthly Income</div>
            <div class="field-value">₱${metadata.financial.monthlyIncome.replace(/_/g, ' - ₱')}</div>
          </div>
          <div class="field">
            <div class="field-label">Monthly Expenses</div>
            <div class="field-value">₱${metadata.financial.monthlyExpenses.replace(/_/g, ' - ₱')}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Identity Verification</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">ID Type</div>
            <div class="field-value">${metadata.identity.idType.replace(/_/g, ' ')}</div>
          </div>
          <div class="field">
            <div class="field-label">ID Number</div>
            <div class="field-value">${metadata.identity.idNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">Face Match Score</div>
            <div class="field-value">${(metadata.identity.faceMatchScore * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Application Timeline</div>
        <div class="field-group">
          <div class="field">
            <div class="field-label">Created At</div>
            <div class="field-value">${new Date(application.created_at).toLocaleString()}</div>
          </div>
          <div class="field">
            <div class="field-label">Submitted At</div>
            <div class="field-value">${application.submitted_at ? new Date(application.submitted_at).toLocaleString() : 'Not submitted'}</div>
          </div>
          ${application.approved_at ? `
          <div class="field">
            <div class="field-label">Processed At</div>
            <div class="field-value">${new Date(application.approved_at).toLocaleString()}</div>
          </div>
          ` : ''}
        </div>
      </div>

      ${application.rejection_reason ? `
      <div class="section">
        <div class="section-title">Rejection Reason</div>
        <div class="field-value">${application.rejection_reason}</div>
      </div>
      ` : ''}

      <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>Printed on: ${new Date().toLocaleString()}</p>
        <p>&copy; ${new Date().getFullYear()} ALWAN KMBI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

/**
 * Print an application
 */
export function printApplication(application: KYCApplication) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to print')
    return
  }

  const html = generatePrintableHTML(application)
  printWindow.document.write(html)
  printWindow.document.close()
  
  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.print()
  }
}
