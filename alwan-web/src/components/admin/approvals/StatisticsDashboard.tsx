'use client'

import { ApprovalStatistics } from '@/types/approvals'
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, FileText } from 'lucide-react'

interface StatisticsDashboardProps {
  statistics: ApprovalStatistics | null
  isLoading?: boolean
}

export function StatisticsDashboard({ statistics, isLoading }: StatisticsDashboardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!statistics) return null

  const stats = [
    {
      label: 'Total',
      value: statistics.total,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      label: 'Pending',
      value: statistics.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'In Review',
      value: statistics.in_review,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Approved',
      value: statistics.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Rejected',
      value: statistics.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Approval Rate',
      value: `${statistics.approval_rate}%`,
      icon: statistics.approval_rate >= 70 ? TrendingUp : TrendingDown,
      color: statistics.approval_rate >= 70 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.approval_rate >= 70 ? 'bg-green-50' : 'bg-red-50'
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg border border-gray-200 p-3 sm:p-4 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</span>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}
