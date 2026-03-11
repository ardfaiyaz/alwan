'use client'

import { CheckCircle, XCircle, X } from 'lucide-react'

interface BulkActionsBarProps {
  selectedCount: number
  onApproveSelected: () => void
  onRejectSelected: () => void
  onClearSelection: () => void
}

export function BulkActionsBar({
  selectedCount,
  onApproveSelected,
  onRejectSelected,
  onClearSelection
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-green-700">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} {selectedCount === 1 ? 'application' : 'applications'} selected
          </span>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={onApproveSelected}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Approve All
          </button>

          <button
            onClick={onRejectSelected}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            <XCircle className="w-4 h-4" />
            Reject All
          </button>

          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Clear selection"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
