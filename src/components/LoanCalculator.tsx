'use client'

/**
 * Loan calculator widget: slider for amount (₱5k–₱50k), shows interest at 2.5% and total repayment.
 * Used on Services page.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'

const INTEREST_RATE = 0.025
const MIN_LOAN = 5000
const MAX_LOAN = 50000
const STEP = 1000

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(15000)
  const interest = loanAmount * INTEREST_RATE
  const totalRepayment = loanAmount + interest

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-md mx-auto"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-6">Loan Calculator</h3>
      <p className="text-slate-500 text-sm mb-6">Estimate your repayment at 2.5% interest</p>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Loan Amount</span>
            <span className="font-semibold text-slate-900">₱{loanAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={MIN_LOAN}
            max={MAX_LOAN}
            step={STEP}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-800"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>₱{MIN_LOAN.toLocaleString()}</span>
            <span>₱{MAX_LOAN.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-600">Interest (2.5%)</span>
            <span className="font-medium text-slate-900">₱{interest.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-slate-700 font-medium">Total Repayment</span>
            <span className="font-bold text-slate-900 text-lg">₱{totalRepayment.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
