'use client'

/**
 * Decorative “Loan Approved” card with floating animation. Used on Services hero/calculator area.
 */
import { motion } from 'framer-motion'

export default function LoanApprovedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-1/4 right-[10%] lg:right-[15%] z-10"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-white rounded-xl shadow-xl p-5 border border-slate-200 min-w-[180px]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0" />
          <div>
            <p className="text-slate-500 text-xs font-medium">Loan Approved</p>
            <p className="text-xl font-bold text-slate-900">₱15,000</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
