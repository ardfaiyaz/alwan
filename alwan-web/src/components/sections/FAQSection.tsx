'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
    {
        question: "What is KMBI and what services do you offer?",
        answer: "Kabalikat para sa Maunlad na Buhay, Inc. (KMBI) is a Christ-centered microfinance institution established in 1986. We provide microloans, savings programs, and microinsurance to low-income Filipino families and micro-entrepreneurs. Our services are designed to promote integral transformation - addressing not just economic needs, but the physical, emotional, and spiritual well-being of our members and their communities."
    },
    {
        question: "How does the center-based lending model work?",
        answer: "KMBI operates through a center-based approach where members form groups within their communities. Each center meets weekly for loan repayments, savings deposits, and fellowship. This model promotes accountability, mutual support, and community building. Members benefit from peer encouragement and shared financial responsibility, making microfinance more accessible and sustainable for everyone involved."
    },
    {
        question: "What is Capital Build-Up (CBU) and why is it required?",
        answer: "Capital Build-Up (CBU) is a mandatory savings component where a portion of your loan is automatically set aside as savings. This serves as your financial cushion and security for future needs. CBU helps members build assets over time and provides a safety net for emergencies. It's part of our commitment to holistic financial development, ensuring you're not just borrowing but also building wealth."
    },
    {
        question: "What are the loan requirements and approval process?",
        answer: "To qualify for a KMBI loan, you must be a Filipino citizen aged 18-65, have a stable source of income or business, and be willing to join a center in your community. The process includes attending an orientation, submitting basic documents (valid ID, proof of income/business), and undergoing a Credit Investigation and Business Inspection (CIBI). Our field officers work closely with you throughout the process to ensure you understand the terms and responsibilities."
    },
    {
        question: "How is KMBI different from traditional banks and other lenders?",
        answer: "Unlike traditional banks, KMBI doesn't require collateral or extensive paperwork. We focus on character-based lending and community support rather than just credit scores. Our interest rates are transparent and competitive, with no hidden fees. Most importantly, we're a non-profit organization driven by our mission of integral transformation, not profit maximization. We provide financial literacy training, values formation, and ongoing support to help our members succeed in their businesses and life goals."
    }
]

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const toggleFAQ = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx)
    }

    return (
        <section className="relative py-12 sm:py-16 overflow-hidden" id="faq">
            {/* Background Effects (Matching Hero) */}
            <div className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06] z-0">
                <div
                    className="absolute inset-0 opacity-[0.20]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                    }}
                />
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-emerald-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[#009245]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#4dd88f] to-white bg-clip-text text-transparent">
                        We're here to help
                    </p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative border rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 ${openIndex === idx
                                ? 'bg-white/10 border-emerald-500/30 shadow-[0_0_20px_rgba(0,146,69,0.2)]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(idx)} // Changed to use toggleFAQ
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                            >
                                <span className={`font-semibold text-lg transition-colors duration-300 ${openIndex === idx ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                    {faq.question}
                                </span>
                                <span className={`p-2 rounded-full transition-all duration-300 ${openIndex === idx ? 'bg-emerald-500/20 text-emerald-400 rotate-180' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'}`}>
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
                                        <div className="px-6 pb-6 text-white leading-loose border-t border-white/5 pt-4 opacity-90 text-justify indent-8">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
