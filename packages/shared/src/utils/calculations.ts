/**
 * Financial Calculations - Shared Business Logic
 * @module @alwan/shared/utils
 */

import { LOAN_CONSTANTS } from '../constants/business'

/**
 * Calculate weekly payment for a loan
 * @param principal - Loan principal amount
 * @param termWeeks - Loan term in weeks
 * @param interestRate - Weekly interest rate (default: 2%)
 * @returns Weekly payment amount
 */
export function calculateWeeklyPayment(
  principal: number,
  termWeeks: number,
  interestRate: number = LOAN_CONSTANTS.INTEREST_RATE
): number {
  const totalInterest = principal * interestRate * termWeeks
  const totalAmount = principal + totalInterest
  return Math.round(totalAmount / termWeeks)
}

/**
 * Calculate total interest for a loan
 * @param principal - Loan principal amount
 * @param termWeeks - Loan term in weeks
 * @param interestRate - Weekly interest rate (default: 2%)
 * @returns Total interest amount
 */
export function calculateTotalInterest(
  principal: number,
  termWeeks: number,
  interestRate: number = LOAN_CONSTANTS.INTEREST_RATE
): number {
  return Math.round(principal * interestRate * termWeeks)
}

/**
 * Calculate total amount to be repaid
 * @param principal - Loan principal amount
 * @param termWeeks - Loan term in weeks
 * @param interestRate - Weekly interest rate (default: 2%)
 * @returns Total repayment amount
 */
export function calculateTotalRepayment(
  principal: number,
  termWeeks: number,
  interestRate: number = LOAN_CONSTANTS.INTEREST_RATE
): number {
  return principal + calculateTotalInterest(principal, termWeeks, interestRate)
}

/**
 * Calculate service fee for a loan
 * @param principal - Loan principal amount
 * @param feeRate - Service fee rate (default: 1%)
 * @returns Service fee amount
 */
export function calculateServiceFee(
  principal: number,
  feeRate: number = LOAN_CONSTANTS.SERVICE_FEE_RATE
): number {
  return Math.round(principal * feeRate)
}

/**
 * Calculate remaining balance after a payment
 * @param currentBalance - Current outstanding balance
 * @param paymentAmount - Payment amount
 * @returns New balance
 */
export function calculateRemainingBalance(
  currentBalance: number,
  paymentAmount: number
): number {
  return Math.max(0, currentBalance - paymentAmount)
}

/**
 * Calculate number of weeks overdue
 * @param lastPaymentDate - Date of last payment
 * @param currentDate - Current date (default: now)
 * @returns Number of weeks overdue
 */
export function calculateWeeksOverdue(
  lastPaymentDate: Date,
  currentDate: Date = new Date()
): number {
  const diffTime = currentDate.getTime() - lastPaymentDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7)
}

/**
 * Check if loan amount is within limits
 * @param amount - Loan amount to check
 * @returns True if valid, false otherwise
 */
export function isValidLoanAmount(amount: number): boolean {
  return amount >= LOAN_CONSTANTS.MIN_AMOUNT && amount <= LOAN_CONSTANTS.MAX_AMOUNT
}

/**
 * Check if loan term is within limits
 * @param termWeeks - Loan term in weeks
 * @returns True if valid, false otherwise
 */
export function isValidLoanTerm(termWeeks: number): boolean {
  return termWeeks >= LOAN_CONSTANTS.MIN_TERM_WEEKS && termWeeks <= LOAN_CONSTANTS.MAX_TERM_WEEKS
}
