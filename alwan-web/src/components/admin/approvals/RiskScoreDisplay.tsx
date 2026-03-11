'use client'

import { Shield, AlertTriangle } from 'lucide-react'
import { RiskScore, getRiskLevelColor, getRiskLevelLabel } from '@/lib/utils/risk-scoring'

interface RiskScoreDisplayProps {
  riskScore: RiskScore
  compact?: boolean
}

export function RiskScoreDisplay({ riskScore, compact = false }: RiskScoreDisplayProps) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${getRiskLevelColor(riskScore.level)}`}>
        <Shield className="w-3 h-3" />
        <span>{riskScore.overall}/100</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Risk Assessment</h4>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-sm font-medium ${getRiskLevelColor(riskScore.level)}`}>
          <Shield className="w-4 h-4" />
          <span>{getRiskLevelLabel(riskScore.level)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Score</span>
          <span className="font-bold text-gray-900">{riskScore.overall}/100</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Financial</span>
            <span className="font-medium">{riskScore.financial}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${riskScore.financial}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Identity</span>
            <span className="font-medium">{riskScore.identity}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${riskScore.identity}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Business</span>
            <span className="font-medium">{riskScore.business}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-orange-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${riskScore.business}%` }}
            ></div>
          </div>
        </div>
      </div>

      {riskScore.factors.length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700 mb-1">Risk Factors:</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {riskScore.factors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
