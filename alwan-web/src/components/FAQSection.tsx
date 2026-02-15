'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
    {
        question: "How do I apply for a loan?",
        answer: "Download the Alwan app from the App Store or Google Play, sign up with your mobile number, and complete the 5-minute application form. You'll need one valid government ID."
    },
    {
        question: "What are the requirements?",
        answer: "You must be a Filipino citizen aged 18-65, have a valid government ID, and a stable source of income. No collateral is required for most loan types."
    },
    {
        question: "How long does approval take?",
        answer: "Our AI-powered system approves eligible applications in minutes. Once approved, funds are typically transferred to your account within 1-2 hours."
    },
    {
        question: "What are the interest rates?",
        answer: "Interest rates start as low as 2.5% per month, depending on your credit score and loan terms. We believe in transparency—all fees are shown upfront before you accept."
    },
    {
        question: "Can I repay my loan early?",
        answer: "Yes! We encourage early repayment to improve your credit score. There are no pre-termination fees or hidden penalties for paying early."
    }
]

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="py-20 sm:py-28 bg-white" id="faq">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-slate-600">Everything you need to know about Alwan</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-white transition-colors"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-semibold text-slate-900 text-lg">{faq.question}</span>
                                <span className={`p-2 rounded-full transition-colors ${openIndex === idx ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
