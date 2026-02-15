'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, ShieldCheck, Zap, Smartphone } from 'lucide-react'

const features = [
    {
        id: 'fast',
        title: 'Lightning Fast',
        description: 'Get approved in minutes, not days. Our AI-driven system processes applications instantly.',
        icon: Zap,
        color: 'from-amber-400 to-orange-500',
        mockupColor: 'bg-amber-100'
    },
    {
        id: 'secure',
        title: 'Bank-Grade Security',
        description: 'Your data is protected by state-of-the-art encryption and biometric security measures.',
        icon: ShieldCheck,
        color: 'from-blue-400 to-indigo-500',
        mockupColor: 'bg-blue-100'
    },
    {
        id: 'easy',
        title: 'Paperless Process',
        description: '100% digital experience. No branches, no lines, no paperwork. Just your phone.',
        icon: Smartphone,
        color: 'from-emerald-400 to-teal-500',
        mockupColor: 'bg-emerald-100'
    },
    {
        id: 'smart',
        title: 'Smart Savings',
        description: 'Track your spending and grow your savings with our intelligent financial insights.',
        icon: Sparkles,
        color: 'from-purple-400 to-pink-500',
        mockupColor: 'bg-purple-100'
    }
]

export default function FeatureShowcase() {
    const [activeFeature, setActiveFeature] = useState(0)

    return (
        <section className="py-20 sm:py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 sm:mb-24"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        The Future of Finance is Here
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                        Experience a completely new way to manage your money with Alwan's cutting-edge features.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Feature List */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        {features.map((feature, idx) => {
                            const isActive = idx === activeFeature
                            const Icon = feature.icon

                            return (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setActiveFeature(idx)}
                                    className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${isActive
                                            ? 'bg-slate-50 border-slate-200 shadow-lg scale-[1.02]'
                                            : 'bg-transparent border-transparent hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {feature.title}
                                            </h3>
                                            <p className={`text-slate-600 leading-relaxed ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeFeatureIndicator"
                                            className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-slate-900"
                                        />
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Right: Interactive Mockup Area */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative mx-auto w-full max-w-[360px] aspect-[9/19] bg-slate-900 rounded-[3rem] p-3 shadow-2xl ring-1 ring-slate-900/10">
                            {/* Phone Frame */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-1/3 bg-slate-900 rounded-b-xl z-20"></div>

                            <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFeature}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        className={`w-full h-full flex flex-col items-center justify-center p-8 text-center ${features[activeFeature].mockupColor}`}
                                    >
                                        {/* Placeholder UI content */}
                                        <div className={`p-6 rounded-full bg-gradient-to-br ${features[activeFeature].color} shadow-2xl mb-8`}>
                                            {(() => {
                                                const Icon = features[activeFeature].icon
                                                return <Icon className="w-16 h-16 text-white" />
                                            })()}
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-800 mb-2">
                                            {features[activeFeature].title}
                                        </h4>
                                        <p className="text-slate-600">
                                            Interactive Preview
                                        </p>

                                        {/* Simulated Skeleton Lines */}
                                        <div className="w-full mt-12 space-y-3 opacity-20">
                                            <div className="h-4 bg-slate-900 rounded w-3/4 mx-auto"></div>
                                            <div className="h-4 bg-slate-900 rounded w-1/2 mx-auto"></div>
                                            <div className="h-4 bg-slate-900 rounded w-5/6 mx-auto"></div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Floating UI Card Overlay */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <div className="h-2 w-24 bg-slate-200 rounded mb-1.5"></div>
                                            <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Background Blob */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-slate-100 to-transparent rounded-full opacity-50 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
