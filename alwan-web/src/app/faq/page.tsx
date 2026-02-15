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
      {/* Hero: matching homepage gradient with grain effect */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Full-bleed background with gradient and grain */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06]">
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/2 opacity-30"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 70% 40%, rgba(0,146,69,0.5) 0%, transparent 70%)' }}
          />
          <div
            className="absolute left-0 bottom-0 h-2/3 w-1/2 opacity-40"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(0,0,0,0.8) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#4dd88f] to-white bg-clip-text text-transparent">
              Help Center
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-[#4dd88f] to-white bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-lg text-white/95 max-w-2xl mx-auto">
              Find answers to common questions about Alwan, loans, savings, and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter pills */}
      <section className="py-8 bg-[#faf9fc] border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {filters.map((f) => (
              <motion.button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === f.id
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-sm'
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
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 ${bentoSpan(catIndex, filteredCategories.length)}`}
                >
                  <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50/50 border-b border-slate-100">
                    <h2 className="text-base md:text-lg font-semibold text-slate-800">{category.title}</h2>
                  </div>
                  <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
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
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-[#009245] to-[#4dd88f] hover:opacity-90 transition-opacity text-sm"
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
      className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/60 hover:bg-slate-50 transition-colors duration-200"
    >
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.9)' }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 sm:py-4 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
      >
        <span className="font-medium text-slate-700 text-sm sm:text-base">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-base sm:text-lg leading-none font-bold"
        >
          +
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 sm:pb-5 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-3 sm:pt-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
