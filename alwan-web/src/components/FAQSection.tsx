'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Sparkles } from 'lucide-react'

const faqs = [
    {
        question: "How do I apply for a loan?",
        answer: "To start your application, simply download the Alwan app from the App Store or Google Play. Sign up with your mobile number, verify your identity with one valid government ID, and complete our intuitive 5-minute application form directly from your phone. Our system will then process your details instantly for a quick decision."
    },
    {
        question: "What are the requirements?",
        answer: "We strive to keep our services accessible to all Filipinos. You must be a Filipino citizen aged 18 to 65 with a stable source of income or employment. A single valid government-issued ID is required for verification, and unlike traditional banks, no collateral or complex paperwork is necessary for most of our loan types."
    },
    {
        question: "How long does approval take?",
        answer: "Our cutting-edge AI-powered system is designed for speed and reliability, approving eligible applications in just a few minutes. Once your loan is approved and you've accepted the terms, the funds are typically transferred to your designated bank account or e-wallet within 1 to 2 hours, ensuring you get help when it's needed."
    },
    {
        question: "What are the interest rates?",
        answer: "Alwan offers competitive interest rates starting as low as 2.5% per month. Your specific rate and terms will be determined based on your credit profile and repayment history. We are committed to complete transparency, meaning you will see a full breakdown of all interest and fees upfront before you ever commit to a loan."
    },
    {
        question: "Can I repay my loan early?",
        answer: "Absolutely! We encourage responsible borrowing and early repayment. Paying back your loan ahead of schedule not only helps you save on total interest but also significantly boosts your credit score within our platform. There are never any pre-termination fees, hidden penalties, or extra charges for settling your balance early."
    }
]

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="relative py-12 sm:py-16 overflow-hidden" id="faq">
            {/* Background Effects (Matching Hero) */}
            <div className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06] z-0">
                <style>{`
                    @keyframes glass-shimmer {
                        0% { transform: translateX(-100%) skewX(-15deg); }
                        100% { transform: translateX(200%) skewX(-15deg); }
                    }
                    .glass-shine-active::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            transparent 0%,
                            rgba(255, 255, 255, 0.15) 50%,
                            transparent 100%
                        );
                        animation: glass-shimmer 1s forwards ease-in-out;
                        pointer-events: none;
                    }
                `}</style>
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        animate={{
                            boxShadow: ["0 0 15px rgba(0,146,69,0.3)", "0 0 25px rgba(0,146,69,0.6)", "0 0 15px rgba(0,146,69,0.3)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-sm mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                        We're here to help
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white opacity-70"
                    >
                        Everything you need to know about getting funded with Alwan
                    </motion.p>
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
                                ? 'bg-white/10 border-emerald-500/30 shadow-[0_0_20px_rgba(0,146,69,0.2)] glass-shine-active'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
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
                                        <div className="px-6 pb-6 text-white leading-loose border-t border-white/5 pt-4 opacity-90">
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
