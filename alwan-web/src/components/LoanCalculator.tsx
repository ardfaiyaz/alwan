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
      className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-lg mx-auto relative overflow-hidden"
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4dd88f] to-[#009245]" />

      <h3 className="text-2xl font-bold text-slate-900 mb-2">Loan Calculator</h3>
      <p className="text-slate-500 mb-8">Estimate your repayment plan instantly.</p>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-600 font-medium">I want to borrow</span>
            <span className="text-3xl font-bold text-[#009245]">₱{loanAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={MIN_LOAN}
            max={MAX_LOAN}
            step={STEP}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#009245] hover:accent-[#007a3d] transition-all"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
            <span>₱{MIN_LOAN.toLocaleString()}</span>
            <span>₱{MAX_LOAN.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Interest Rate (Monthly)</span>
            <span className="font-semibold text-slate-900">2.5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Interest Amount</span>
            <span className="font-semibold text-slate-900">₱{interest.toLocaleString()}</span>
          </div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-slate-700 font-bold">Total Repayment</span>
            <span className="font-bold text-slate-900 text-2xl">₱{totalRepayment.toLocaleString()}</span>
          </div>
        </div>

        <button className="w-full py-4 bg-[#009245] hover:bg-[#007a3d] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98]">
          Apply for this Amount
        </button>
      </div>
    </motion.div>
  )
}
