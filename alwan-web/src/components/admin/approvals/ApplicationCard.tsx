'use client'

import { useState } from 'react'
import { Eye, CheckCircle, XCircle, Phone, Mail, Building2, MapPin, Calendar, User, Image as ImageIcon } from 'lucide-react'
import { KYCApplication } from '@/app/actions/kyc-approvals'
import { ImageViewerModal } from './ImageViewerModal'

interface ApplicationCardProps {
  application: KYCApplication
  isSelected: boolean
  onSelect: (id: string) => void
  onView: () => void
  onApprove: () => void
  onReject: () => void
  showCheckbox?: boolean
}

export function ApplicationCard({
  application,
  isSelected,
  onSelect,
  onView,
  onApprove,
  onReject,
  showCheckbox = true
}: ApplicationCardProps) {
  const [showImageModal, setShowImageModal] = useState(false)
  const metadata = application.metadata
  const fullName = `${metadata.firstName} ${metadata.middleName} ${metadata.lastName}`.trim()

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
      in_review: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      approved: 'bg-green-500/20 text-green-700 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-700 border-red-500/30'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || ''}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${
      isSelected ? 'border-green-500 shadow-md' : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          {showCheckbox && (application.status === 'pending' || application.status === 'in_review') && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(application.id)}
              className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
            />
          )}

          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
              {getStatusBadge(application.status)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 truncate">{application.mobile_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 truncate">{metadata.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 truncate">{metadata.business?.businessName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 truncate">
                  {metadata.address?.city}, {metadata.address?.province}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 text-xs">
                  {application.submitted_at ? formatDate(application.submitted_at) : 'Not submitted'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 capitalize">{metadata.gender || 'N/A'}</span>
              </div>
            </div>

            {application.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">
                  <span className="font-semibold">Rejection Reason:</span> {application.rejection_reason}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onView}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200 text-sm"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </button>

            <button
              onClick={() => setShowImageModal(true)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200 text-sm"
              title="View ID Images"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Images</span>
            </button>

            {(application.status === 'pending' || application.status === 'in_review') && (
              <>
                <button
                  onClick={onApprove}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                  title="Approve"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Approve</span>
                </button>
                <button
                  onClick={onReject}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Reject</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ImageViewerModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={{
          idFrontUrl: metadata.identity?.idFrontUrl,
          idBackUrl: metadata.identity?.idBackUrl,
          selfieUrl: metadata.identity?.selfieUrl
        }}
        applicantName={fullName}
      />
    </div>
  )
}
