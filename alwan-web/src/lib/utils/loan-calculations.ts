/**
 * Loan calculation utilities for KMBI microfinance system
 */

export interface LoanCalculation {
    principalAmount: number
    interestRate: number // Monthly percentage
    termWeeks: number
    totalInterest: number
    cbuAmount: number // Capital Build-Up (5% of principal)
    totalAmount: number // Principal + Interest
    weeklyPayment: number
}

/**
 * Calculate loan amounts and weekly payment
 */
export function calculateLoan(
    principal: number,
    interestRateMonthly: number = 2.0,
    termWeeks: number = 52,
    cbuRate: number = 5.0
): LoanCalculation {
    // Convert monthly interest to total interest over term
    const termMonths = termWeeks / 4.33 // Average weeks per month
    const totalInterest = (principal * interestRateMonthly * termMonths) / 100

    // Calculate CBU (Capital Build-Up) - 5% of principal
    const cbuAmount = (principal * cbuRate) / 100

    // Total amount to repay (principal + interest)
    const totalAmount = principal + totalInterest

    // Weekly payment (principal + interest divided by weeks)
    const weeklyPayment = totalAmount / termWeeks

    return {
        principalAmount: principal,
        interestRate: interestRateMonthly,
        termWeeks,
        totalInterest,
        cbuAmount,
        totalAmount,
        weeklyPayment
    }
}

/**
 * Generate repayment schedule
 */
export interface RepaymentScheduleItem {
    weekNumber: number
    dueDate: Date
    principalDue: number
    interestDue: number
    totalDue: number
}

export function generateRepaymentSchedule(
    calculation: LoanCalculation,
    startDate: Date = new Date()
): RepaymentScheduleItem[] {
    const schedule: RepaymentScheduleItem[] = []
    const { principalAmount, totalInterest, termWeeks, weeklyPayment } = calculation

    const principalPerWeek = principalAmount / termWeeks
    const interestPerWeek = totalInterest / termWeeks

    for (let week = 1; week <= termWeeks; week++) {
        const dueDate = new Date(startDate)
        dueDate.setDate(dueDate.getDate() + (week * 7))

        schedule.push({
            weekNumber: week,
            dueDate,
            principalDue: principalPerWeek,
            interestDue: interestPerWeek,
            totalDue: weeklyPayment
        })
    }

    return schedule
}

/**
 * Calculate Portfolio at Risk (PAR)
 * PAR-30: Percentage of outstanding portfolio with payments overdue > 30 days
 */
export function calculatePAR(
    totalOutstanding: number,
    overdueAmount: number
): number {
    if (totalOutstanding === 0) return 0
    return (overdueAmount / totalOutstanding) * 100
}

/**
 * Calculate collection efficiency
 */
export function calculateCollectionEfficiency(
    expectedAmount: number,
    collectedAmount: number
): number {
    if (expectedAmount === 0) return 0
    return (collectedAmount / expectedAmount) * 100
}
