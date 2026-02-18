'use client'

import { motion } from 'framer-motion'

export default function SavingsSection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
            Smart Savings
          </p>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-8 leading-tight">
            Your Future Starts with{' '}
            <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
              Every Save
            </span>
          </h2>
          
          <div className="space-y-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            <p>
              Building wealth doesn't happen overnight, but every small step counts. With Alwan's integrated savings program, you're not just borrowing—you're investing in your tomorrow.
            </p>
            
            <p className="text-2xl sm:text-3xl font-semibold text-slate-800 py-6">
              Save automatically while you grow your business
            </p>
            
            <p>
              Our Capital Build-Up (CBU) program works quietly in the background, setting aside a portion of your loan as savings. No extra effort needed. Just watch your financial cushion grow month after month.
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
            >
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                Ready to secure your financial future?
              </p>
              <p className="text-lg text-slate-700">
                Download the Alwan app and discover how easy it is to save while you borrow. Your dreams are closer than you think.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
