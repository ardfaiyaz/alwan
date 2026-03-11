/**
 * Risk scoring utility for KYC applications
 * Calculates risk scores based on various factors
 */

import { KYCApplication } from '@/app/actions/kyc-approvals'

export interface RiskScore {
  overall: number // 0-100
  financial: number
  identity: number
  business: number
  level: 'low' | 'medium' | 'high' | 'very_high'
  factors: string[]
}

/**
 * Calculate comprehensive risk score for an application
 */
export function calculateRiskScore(application: KYCApplication): RiskScore {
  const metadata = application.metadata
  const factors: string[] = []
  
  // Financial risk (0-100, lower is better)
  let financialScore = 0
  
  // Income vs expenses ratio
  const income = parseIncomeRange(metadata.financial?.monthlyIncome)
  const expenses = parseIncomeRange(metadata.financial?.monthlyExpenses)
  
  if (income && expenses) {
    const ratio = expenses / income
    if (ratio > 0.8) {
      financialScore += 30
      factors.push('High expense-to-income ratio')
    } else if (ratio > 0.6) {
      financialScore += 15
    }
  }
  
  // Business revenue
  const revenue = parseIncomeRange(metadata.business?.monthlyRevenue)
  if (revenue && revenue < 10000) {
    financialScore += 20
    factors.push('Low monthly business revenue')
  }
  
  // Years operating
  const yearsOperating = metadata.business?.yearsOperating
  if (yearsOperating === 'less_than_1_year') {
    financialScore += 25
    factors.push('New business (less than 1 year)')
  } else if (yearsOperating === '1_2_years') {
    financialScore += 10
  }
  
  // Identity risk (0-100, lower is better)
  let identityScore = 0
  
  // Face match score
  const faceMatchScore = metadata.identity?.faceMatchScore || 0
  if (faceMatchScore < 0.6) {
    identityScore += 40
    factors.push('Low face match score')
  } else if (faceMatchScore < 0.7) {
    identityScore += 20
    factors.push('Moderate face match score')
  }
  
  // ID type reliability
  const idType = metadata.identity?.idType
  const lowReliabilityIds = ['barangay_id', 'voters_id']
  if (lowReliabilityIds.includes(idType)) {
    identityScore += 15
    factors.push('Lower reliability ID type')
  }
  
  // Business risk (0-100, lower is better)
  let businessScore = 0
  
  // Business type risk
  const highRiskBusinessTypes = ['online_selling', 'buy_and_sell']
  if (highRiskBusinessTypes.includes(metadata.business?.businessType)) {
    businessScore += 15
  }
  
  // Housing type
  const housingType = metadata.address?.housingType
  if (housingType === 'renting' || housingType === 'living_with_relatives') {
    businessScore += 10
    factors.push('Non-owned housing')
  }
  
  // Calculate overall score (weighted average)
  const overall = Math.round(
    (financialScore * 0.4) + 
    (identityScore * 0.4) + 
    (businessScore * 0.2)
  )
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high' | 'very_high'
  if (overall < 20) level = 'low'
  else if (overall < 40) level = 'medium'
  else if (overall < 60) level = 'high'
  else level = 'very_high'
  
  return {
    overall,
    financial: financialScore,
    identity: identityScore,
    business: businessScore,
    level,
    factors
  }
}

/**
 * Parse income range string to average number
 */
function parseIncomeRange(range?: string): number | null {
  if (!range) return null
  
  // Extract numbers from range like "10000_20000" or "200001_300000"
  const numbers = range.match(/\d+/g)
  if (!numbers || numbers.length < 2) return null
  
  const min = parseInt(numbers[0])
  const max = parseInt(numbers[1])
  return (min + max) / 2
}

/**
 * Get risk level color for UI
 */
export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'very_high':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

/**
 * Get risk level label
 */
export function getRiskLevelLabel(level: string): string {
  switch (level) {
    case 'low':
      return 'Low Risk'
    case 'medium':
      return 'Medium Risk'
    case 'high':
      return 'High Risk'
    case 'very_high':
      return 'Very High Risk'
    default:
      return 'Unknown'
  }
}
