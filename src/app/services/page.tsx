'use client'

/**
 * Services page - Four sections: hero, loan calculator widget, service cards (Micro Loans, Savings, Bill Payments, Insurance), and CTA.
 */

import { motion } from 'framer-motion'
import LoanCalculator from '@/components/LoanCalculator'
import Link from 'next/link'
import { MagneticButton } from '@/components/MagneticButton'

const services = [
  {
    title: 'Micro Loans',
    description: 'Quick, accessible loans for small businesses and personal needs. No collateral required. Flexible repayment terms designed for Filipino entrepreneurs.',
  },
  {
    title: 'Savings & Goals',
    description: 'Build your savings with our goal-based accounts. Set targets for your sari-sari store, education, or dreams—we help you get there.',
  },
  {
    title: 'Bill Payments',
    description: 'Pay utility bills, load, and government fees in one app. Save time and avoid long lines—everything at your fingertips.',
  },
  {
    title: 'Insurance & Protection',
    description: 'Affordable micro-insurance to protect your family and business. Peace of mind for every Filipino family.',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero - gentle */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-violet-600/80 font-medium uppercase tracking-wider mb-4 text-sm">What We Offer</p>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Services Built for Filipinos
            </h1>
            <p className="text-lg text-slate-600">
              From micro loans to savings goals—everything you need to thrive, all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loan Calculator Widget - gentle */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Calculate Your Loan</h2>
            <p className="text-slate-600">See your estimated repayment in real-time</p>
          </motion.div>
          <LoanCalculator />
        </div>
      </section>

      {/* 4 Service Sections - gentle */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}
              >
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="flex-1 w-full max-w-md aspect-square rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-medium">
                  Add image
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-600 mb-8">
            Create your Alwan account and access all our services in minutes.
          </p>
          <Link href="/register">
            <MagneticButton className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
              Create Free Account
            </MagneticButton>
          </Link>
        </motion.div>
      </section>
    </>
  )
}
