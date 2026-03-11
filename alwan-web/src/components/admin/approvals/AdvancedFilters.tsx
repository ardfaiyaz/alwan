'use client'

import { useState } from 'react'
import { X, Filter } from 'lucide-react'
import { AdvancedFilters as AdvancedFiltersType } from '@/types/approvals'
import { CITIES_BY_PROVINCE, PROVINCES, BUSINESS_TYPES } from '@/lib/constants/philippines'

// Get all unique cities from all provinces
const ALL_CITIES = Object.values(CITIES_BY_PROVINCE).flat().sort()

interface AdvancedFiltersProps {
  filters: AdvancedFiltersType
  onFiltersChange: (filters: AdvancedFiltersType) => void
  onClose: () => void
}

export function AdvancedFilters({ filters, onFiltersChange, onClose }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedFiltersType>(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const emptyFilters: AdvancedFiltersType = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.start || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    dateRange: {
                      start: e.target.value,
                      end: localFilters.dateRange?.end || ''
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.end || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    dateRange: {
                      start: localFilters.dateRange?.start || '',
                      end: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Province</label>
                <select
                  multiple
                  value={localFilters.provinces || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value)
                    setLocalFilters({ ...localFilters, provinces: selected })
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                >
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">City</label>
                <select
                  multiple
                  value={localFilters.cities || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value)
                    setLocalFilters({ ...localFilters, cities: selected })
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                >
                  {ALL_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type
            </label>
            <select
              multiple
              value={localFilters.businessTypes || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                setLocalFilters({ ...localFilters, businessTypes: selected })
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
            >
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          {/* Income Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Minimum (₱)</label>
                <input
                  type="number"
                  value={localFilters.incomeRange?.min || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    incomeRange: {
                      min: parseInt(e.target.value) || 0,
                      max: localFilters.incomeRange?.max || 0
                    }
                  })}
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Maximum (₱)</label>
                <input
                  type="number"
                  value={localFilters.incomeRange?.max || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    incomeRange: {
                      min: localFilters.incomeRange?.min || 0,
                      max: parseInt(e.target.value) || 0
                    }
                  })}
                  placeholder="999999"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['low', 'medium', 'high', 'very_high'].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.riskLevel?.includes(level as any) || false}
                    onChange={(e) => {
                      const current = localFilters.riskLevel || []
                      const updated = e.target.checked
                        ? [...current, level as any]
                        : current.filter(l => l !== level)
                      setLocalFilters({ ...localFilters, riskLevel: updated })
                    }}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {level.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
