/**
 * Portfolio at Risk (PAR) Calculator
 * Calculates PAR metrics for loan portfolio analysis
 */

import { createClient } from '@/lib/supabase/client'

export interface PARBucket {
    amount: number
    count: number
    rate: number
}

export interface PARMetrics {
    par1_30: PARBucket
    par31_60: PARBucket
    par61_90: PARBucket
    parOver90: PARBucket
    totalPAR: number
    totalPortfolio: number
    overallPARRate: number
}

/**
 * Calculate Portfolio at Risk for a specific branch
 */
export async function calculatePAR(
    branchId: string,
    asOfDate: Date = new Date()
): Promise<PARMetrics> {
    const supabase = createClient()
    if (!supabase) throw new Error('Supabase client not initialized')

    if (!supabase) throw new Error('Supabase client not initialized')


    const { data, error } = await supabase.rpc('calculate_par_for_branch', {
        p_branch_id: branchId,
        p_as_of_date: asOfDate.toISOString().split('T')[0]
    } as any)


    if (error) throw error

    const totalPortfolio = data.total_portfolio || 0

    return {
        par1_30: {
            amount: data.par_1_30_amount || 0,
            count: data.par_1_30_count || 0,
            rate: totalPortfolio > 0 ? ((data.par_1_30_amount || 0) / totalPortfolio) * 100 : 0
        },
        par31_60: {
            amount: data.par_31_60_amount || 0,
            count: data.par_31_60_count || 0,
            rate: totalPortfolio > 0 ? ((data.par_31_60_amount || 0) / totalPortfolio) * 100 : 0
        },
        par61_90: {
            amount: data.par_61_90_amount || 0,
            count: data.par_61_90_count || 0,
            rate: totalPortfolio > 0 ? ((data.par_61_90_amount || 0) / totalPortfolio) * 100 : 0
        },
        parOver90: {
            amount: data.par_over_90_amount || 0,
            count: data.par_over_90_count || 0,
            rate: totalPortfolio > 0 ? ((data.par_over_90_amount || 0) / totalPortfolio) * 100 : 0
        },
        totalPAR: (data.par_1_30_amount || 0) + (data.par_31_60_amount || 0) +
            (data.par_61_90_amount || 0) + (data.par_over_90_amount || 0),
        totalPortfolio,
        overallPARRate: data.par_rate || 0
    }
}

/**
 * Calculate collection efficiency for a branch
 */
export async function calculateCollectionEfficiency(
    branchId: string,
    startDate: Date,
    endDate: Date
): Promise<number> {
    const supabase = createClient()
    if (!supabase) throw new Error('Supabase client not initialized')


    // Get all collections in date range
    const { data: collections, error } = await supabase
        .from('weekly_collection_sheets')
        .select(`
      total_loan_payments,
      center:centers!inner(branch_id)
    `)
        .eq('center.branch_id', branchId)
        .gte('collection_date', startDate.toISOString().split('T')[0])
        .lte('collection_date', endDate.toISOString().split('T')[0])

    if (error) throw error

    // Get expected payments in date range
    const { data: expectedPayments, error: expectedError } = await supabase
        .from('repayment_schedules')
        .select(`
      total_due,
      loan:loans!inner(
        center:centers!inner(branch_id)
      )
    `)
        .eq('loan.center.branch_id', branchId)
        .gte('due_date', startDate.toISOString().split('T')[0])
        .lte('due_date', endDate.toISOString().split('T')[0])

    if (expectedError) throw expectedError

    const totalCollected = collections?.reduce((sum, c) => sum + (c.total_loan_payments || 0), 0) || 0
    const totalExpected = expectedPayments?.reduce((sum, p) => sum + (p.total_due || 0), 0) || 0

    return totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0
}

/**
 * Get overdue loans for a branch
 */
export async function getOverdueLoans(branchId: string) {
    const supabase = createClient()
    if (!supabase) throw new Error('Supabase client not initialized')


    const { data, error } = await supabase
        .from('repayment_schedules')
        .select(`
      *,
      loan:loans!inner(
        id,
        principal_amount,
        outstanding_balance,
        member:members(full_name),
        center:centers!inner(
          name,
          branch_id
        )
      )
    `)
        .eq('loan.center.branch_id', branchId)
        .eq('is_paid', false)
        .lt('due_date', new Date().toISOString().split('T')[0])
        .order('days_overdue', { ascending: false })

    if (error) throw error

    return data
}

/**
 * Calculate loan calculations (interest, CBU, weekly payment)
 */
export function calculateLoan(
    principalAmount: number,
    monthlyInterestRate: number,
    termWeeks: number
) {
    // Calculate total interest (simple interest)
    const termMonths = termWeeks / 4.33 // Average weeks per month
    const totalInterest = principalAmount * (monthlyInterestRate / 100) * termMonths

    // Calculate CBU (5% of principal)
    const cbuAmount = principalAmount * 0.05

    // Total amount to repay
    const totalAmount = principalAmount + totalInterest

    // Weekly payment (excluding CBU which is one-time)
    const weeklyPayment = totalAmount / termWeeks

    return {
        principalAmount,
        totalInterest: Math.round(totalInterest * 100) / 100,
        cbuAmount: Math.round(cbuAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        weeklyPayment: Math.round(weeklyPayment * 100) / 100,
        monthlyInterestRate,
        termWeeks
    }
}

/**
 * Generate repayment schedule for a loan
 */
export function generateRepaymentSchedule(
    principalAmount: number,
    totalInterest: number,
    termWeeks: number,
    startDate: Date
) {
    const totalAmount = principalAmount + totalInterest
    const weeklyPayment = totalAmount / termWeeks
    const weeklyPrincipal = principalAmount / termWeeks
    const weeklyInterest = totalInterest / termWeeks

    const schedule = []
    let currentDate = new Date(startDate)

    for (let week = 1; week <= termWeeks; week++) {
        // Add 7 days for each week
        currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)

        schedule.push({
            weekNumber: week,
            dueDate: currentDate.toISOString().split('T')[0],
            principalDue: Math.round(weeklyPrincipal * 100) / 100,
            interestDue: Math.round(weeklyInterest * 100) / 100,
            totalDue: Math.round(weeklyPayment * 100) / 100
        })
    }

    return schedule
}
