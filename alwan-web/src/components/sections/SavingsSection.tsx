'use client'

import { motion } from 'framer-motion'

const savingsFeatures = [
  {
    title: 'Capital Build-Up (CBU)',
    description: 'Automatically save a portion of your loan for future security. Build your financial cushion while you borrow.'
  },
  {
    title: 'Grow Your Savings',
    description: 'Watch your savings grow with competitive interest rates. Your money works harder for you over time.'
  },
  {
    title: 'Secure & Protected',
    description: 'Your savings are safe and insured. Access your funds anytime through our mobile app or at any center.'
  }
]

export default function SavingsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
            Smart Savings
          </p>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Save While You{' '}
            <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
              Borrow
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Build your financial future with our integrated savings program
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {savingsFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#009245]/5 to-[#4dd88f]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
