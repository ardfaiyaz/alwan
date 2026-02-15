'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const features = [
    {
        id: 'fast',
        title: 'Lightning Fast',
        description: 'Get approved in minutes, not days. Our AI-driven system processes applications instantly.',
        color: 'from-[#009245] to-[#007a3d]',
        mockupColor: 'bg-emerald-50'
    },
    {
        id: 'secure',
        title: 'Bank-Grade Security',
        description: 'Your data is protected by state-of-the-art encryption and biometric security measures.',
        color: 'from-[#00a84f] to-[#009245]',
        mockupColor: 'bg-teal-50'
    },
    {
        id: 'easy',
        title: 'Paperless Process',
        description: '100% digital experience. No branches, no lines, no paperwork. Just your phone.',
        color: 'from-[#4dd88f] to-[#009245]',
        mockupColor: 'bg-green-50'
    },
    {
        id: 'smart',
        title: 'Smart Savings',
        description: 'Track your spending and grow your savings with our intelligent financial insights.',
        color: 'from-[#009245] to-[#056633]',
        mockupColor: 'bg-emerald-50'
    }
]

export default function FeatureShowcase() {
    const [activeFeature, setActiveFeature] = useState(0)

    return (
        <section className="py-12 sm:py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-14"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#009245] to-[#007a3d] shadow-[0_4px_14px_rgba(0,146,69,0.4)] mb-6"
                    >
                        Innovation
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
                        The Future of Finance is Here
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                        Experience a completely new way to manage your money with Alwan's cutting-edge features.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Feature List - Apple Style Sidebar */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        {features.map((feature, idx) => {
                            const isActive = idx === activeFeature

                            return (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setActiveFeature(idx)}
                                    className={`relative px-6 py-5 cursor-pointer transition-all duration-400 group rounded-[1.5rem] ${isActive ? 'bg-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'hover:bg-slate-50/50'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Active Indicator Pillar */}
                                        <div className={`mt-2 w-1.5 h-12 rounded-full transition-all duration-500 shrink-0 ${isActive ? 'bg-gradient-to-b from-[#009245] to-[#4dd88f] shadow-[0_0_12px_rgba(0,146,69,0.3)]' : 'bg-slate-100'}`} />

                                        <div>
                                            <h3 className={`text-2xl font-bold mb-2 transition-colors duration-400 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-500'}`}>
                                                {feature.title}
                                            </h3>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Right: Interactive Mockup Area - MacBook/iOS Fluidity */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative mx-auto w-full max-w-[360px] aspect-[9/19] bg-slate-900 rounded-[3.5rem] p-3 shadow-2xl ring-1 ring-slate-900/20">
                            {/* Device Chrome - Metallic Finish Line */}
                            <div className="absolute inset-0 rounded-[3.5rem] border-[3px] border-slate-800/50 pointer-events-none"></div>

                            {/* Speaker/Notch Area */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-1/3 bg-slate-900 rounded-b-2xl z-20"></div>

                            <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden border border-slate-200 shadow-inner">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFeature}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                        className={`w-full h-full flex flex-col items-center justify-center p-10 text-center bg-gradient-to-br ${features[activeFeature].color}`}
                                    >
                                        {/* Premium Glass Card in Mockup */}
                                        <div className="bg-white/20 backdrop-blur-2xl p-10 rounded-[2.5rem] mb-10 border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                                            <div className="w-24 h-24 bg-white/40 rounded-full mx-auto shadow-inner" />
                                        </div>

                                        <h4 className="text-3xl font-bold text-white mb-3">
                                            {features[activeFeature].title}
                                        </h4>
                                        <p className="text-white/80 font-medium">
                                            Alwan Experience
                                        </p>

                                        {/* Ultra-sharp Glass Mock UI */}
                                        <div className="w-full mt-14 space-y-5 px-4">
                                            <div className="h-14 bg-white/20 rounded-2xl w-full backdrop-blur-md border border-white/25 shadow-lg"></div>
                                            <div className="h-14 bg-white/10 rounded-2xl w-full backdrop-blur-md border border-white/15"></div>
                                            <div className="h-14 bg-white/10 rounded-2xl w-full backdrop-blur-md border border-white/15"></div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Background Ambiance - iOS Control Center Glow */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-gradient-to-br from-[#009245]/25 via-emerald-100/5 to-transparent rounded-full opacity-60 blur-[120px]"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
