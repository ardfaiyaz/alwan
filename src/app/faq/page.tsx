'use client'

/**
 * FAQ page - Bento grid, category filter (General, Loans, Savings, Security), gentle colors. Mobile CTA at end.
 */

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import MobileCTA from '@/components/MobileCTA'

type FilterId = 'all' | 'general' | 'loans' | 'savings' | 'security'

const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'loans', label: 'Loans' },
  { id: 'savings', label: 'Savings' },
  { id: 'security', label: 'Security' },
]

const faqData: { category: FilterId; title: string; questions: { q: string; a: string }[] }[] = [
  {
    category: 'general',
    title: 'Getting Started',
    questions: [
      { q: 'How do I create an Alwan account?', a: 'Download our app or visit our website, click "Get Started", and follow the registration flow. You\'ll need a valid ID and a Philippine mobile number.' },
      { q: 'Is Alwan available in my area?', a: 'Alwan is available nationwide across the Philippines. We serve all regions from Luzon to Mindanao.' },
      { q: 'What documents do I need?', a: 'A valid government-issued ID (e.g., UMID, PhilSys, passport) and proof of address. For business loans, we may request additional documents.' },
    ],
  },
  {
    category: 'loans',
    title: 'Loans & Financing',
    questions: [
      { q: 'How much can I borrow?', a: 'Loan amounts vary based on your profile and purpose. Micro loans typically range from ₱5,000 to ₱50,000 for first-time borrowers.' },
      { q: 'What are the interest rates?', a: 'We offer competitive, transparent rates. Your exact rate depends on your loan amount, term, and risk assessment. All fees are disclosed upfront.' },
      { q: 'How fast can I get approved?', a: 'Most applications are reviewed within 24-48 hours. Once approved, funds can be disbursed to your account within 1-2 business days.' },
    ],
  },
  {
    category: 'savings',
    title: 'Savings & Goals',
    questions: [
      { q: 'How does Alwan savings work?', a: 'Set a goal, choose your timeline, and contribute regularly. We help you stay on track with reminders and progress tracking.' },
      { q: 'Are my savings insured?', a: 'We partner with regulated institutions to ensure your funds are safe. Details are disclosed when you open an account.' },
      { q: 'Can I withdraw anytime?', a: 'Yes, for flexible savings. Goal-based savings may have terms—check the product details before locking in.' },
    ],
  },
  {
    category: 'security',
    title: 'Security & Support',
    questions: [
      { q: 'Is my data secure?', a: 'We use bank-level encryption and follow Philippine data privacy regulations (Data Privacy Act). Your information is never shared without consent.' },
      { q: 'How do I contact support?', a: 'Reach us via in-app chat, email at support@alwan.ph, or call our hotline. We respond within 24 hours on business days.' },
      { q: 'What if I forget my password?', a: 'Click "Forgot Password" on the login screen. We\'ll send a reset link to your registered email.' },
    ],
  },
]

// Bento: first and last cards span 2 cols on md for visual interest
const bentoSpan = (i: number, total: number) =>
  total >= 4 && (i === 0 || i === 3) ? 'md:col-span-2' : ''

export default function FAQPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all')

  const filteredCategories = activeFilter === 'all'
    ? faqData
    : faqData.filter((c) => c.category === activeFilter)

  return (
    <>
      {/* Hero: gentle gradient (same vibe as homepage, softer) */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/90 via-violet-600/95 to-indigo-700/95" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/80 font-medium uppercase tracking-widest text-sm mb-4">
              Help Center
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/95 max-w-2xl mx-auto">
              Find answers to common questions about Alwan, loans, savings, and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter pills */}
      <section className="py-8 bg-[#faf9fc] border-b border-slate-100 sticky top-16 md:top-20 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <motion.button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f.id
                    ? 'bg-violet-100 text-violet-800 border border-violet-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-200 hover:text-violet-700'
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Bento grid FAQ - gentle colors */}
      <section className="py-12 lg:py-20 bg-[#faf9fc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <AnimatePresence mode="wait">
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, delay: catIndex * 0.05 }}
                  className={`rounded-2xl border border-slate-200/80 overflow-hidden bg-white/80 shadow-sm hover:shadow-md transition-shadow ${bentoSpan(catIndex, filteredCategories.length)}`}
                >
                  <div className="px-5 py-4 bg-gradient-to-r from-violet-50 to-teal-50/50 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">{category.title}</h2>
                  </div>
                  <div className="p-4 space-y-2">
                    {category.questions.map((faq, qIndex) => (
                      <FAQItem key={qIndex} question={faq.q} answer={faq.a} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Still have questions? - gentle lavender */}
      <section className="py-14 bg-[#f5f3ff]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-4 text-center"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-6">We&apos;re here to help. Reach out anytime.</p>
          <Link
            href="#"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-violet-500 to-teal-500 hover:opacity-90 transition-opacity text-sm"
          >
            Contact Support
          </Link>
        </motion.div>
      </section>

      <MobileCTA />
    </>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      layout
      className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/60"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors cursor-pointer"
      >
        <span className="font-medium text-slate-700 text-sm">{question}</span>
        <span className="shrink-0 w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm leading-none">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-3 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-2">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
