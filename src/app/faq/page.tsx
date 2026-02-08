'use client'

/**
 * FAQ page - Bento-style cards by category (Getting Started, Loans, Savings, Security).
 * Expandable FAQItem per question; uses AnimatePresence for open/close.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagneticLink } from '@/components/MagneticButton'

const faqCategories = [
  {
    title: 'Getting Started',
    questions: [
      { q: 'How do I create an Alwan account?', a: 'Download our app or visit our website, click "Get Started", and follow the registration flow. You\'ll need a valid ID and a Philippine mobile number.' },
      { q: 'Is Alwan available in my area?', a: 'Alwan is available nationwide across the Philippines. We serve all regions from Luzon to Mindanao.' },
      { q: 'What documents do I need?', a: 'A valid government-issued ID (e.g., UMID, PhilSys, passport) and proof of address. For business loans, we may request additional documents.' },
    ],
    color: 'bg-slate-800',
  },
  {
    title: 'Loans & Financing',
    questions: [
      { q: 'How much can I borrow?', a: 'Loan amounts vary based on your profile and purpose. Micro loans typically range from ₱5,000 to ₱50,000 for first-time borrowers.' },
      { q: 'What are the interest rates?', a: 'We offer competitive, transparent rates. Your exact rate depends on your loan amount, term, and risk assessment. All fees are disclosed upfront.' },
      { q: 'How fast can I get approved?', a: 'Most applications are reviewed within 24-48 hours. Once approved, funds can be disbursed to your account within 1-2 business days.' },
    ],
    color: 'bg-slate-700',
  },
  {
    title: 'Savings & Goals',
    questions: [
      { q: 'How does Alwan savings work?', a: 'Set a goal, choose your timeline, and contribute regularly. We help you stay on track with reminders and progress tracking.' },
      { q: 'Are my savings insured?', a: 'We partner with regulated institutions to ensure your funds are safe. Details are disclosed when you open an account.' },
      { q: 'Can I withdraw anytime?', a: 'Yes, for flexible savings. Goal-based savings may have terms—check the product details before locking in.' },
    ],
    color: 'bg-slate-600',
  },
  {
    title: 'Security & Support',
    questions: [
      { q: 'Is my data secure?', a: 'We use bank-level encryption and follow Philippine data privacy regulations (Data Privacy Act). Your information is never shared without consent.' },
      { q: 'How do I contact support?', a: 'Reach us via in-app chat, email at support@alwan.ph, or call our hotline. We respond within 24 hours on business days.' },
      { q: 'What if I forget my password?', a: 'Click "Forgot Password" on the login screen. We\'ll send a reset link to your registered email.' },
    ],
    color: 'bg-slate-900',
  },
]

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-slate-500 font-medium uppercase tracking-wider mb-4">Help Center</p>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-600">
              Find answers to common questions about Alwan and our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {faqCategories.map((category, catIndex) => {
              const direction = catIndex % 2 === 0 ? -1 : 1
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, x: direction * 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className={`p-6 ${category.color} text-white`}>
                    <h2 className="text-xl font-bold">{category.title}</h2>
                  </div>
                  <div className="p-6 space-y-2">
                    {category.questions.map((faq, qIndex) => (
                      <FAQItem key={qIndex} question={faq.q} answer={faq.a} />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-4 text-center"
        >
          <p className="text-slate-600 mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <MagneticLink
            href="#"
            className="inline-block px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Contact Support
          </MagneticLink>
        </motion.div>
      </section>
    </>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      layout
      className="border border-slate-100 rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span className="font-medium text-slate-800">{question}</span>
        <span className="text-slate-500 text-lg shrink-0">{isOpen ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-slate-600 text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
