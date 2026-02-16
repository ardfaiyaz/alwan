'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Shield, Lock, FileText, Globe } from 'lucide-react'

export default function DataProtectionPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#009245] transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="text-sm font-medium text-slate-900">Data Protection</div>
                </div>
            </header>

            <main className="pt-24 pb-16 lg:pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[#009245] bg-emerald-50 mb-6">
                                <Shield className="w-3 h-3" />
                                Security First
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Data Protection at Alwan</h1>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                                We use bank-grade security measures to ensure your financial data and personal information are always protected.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#009245] mb-6">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Encryption</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    All data in transit is encrypted using TLS 1.2+ protocols. Your sensitive personal and financial data is encrypted at rest using AES-256 encryption standards.
                                </p>
                            </div>
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#009245] mb-6">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Data Sovereignty</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    As a Philippine-based company, we ensure that your data is handled in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173).
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-slate prose-lg max-w-none">
                            <h3>Our Data Protection Principles</h3>
                            <p>
                                We adhere to the following key principles in processing your personal data:
                            </p>
                            <ul>
                                <li><strong>Transparency:</strong> We are clear about what data we collect and why.</li>
                                <li><strong>Legitimate Purpose:</strong> We only process data for specific, lawful purposes.</li>
                                <li><strong>Proportionality:</strong> We only collect data that is necessary for the service.</li>
                                <li><strong>Data Quality:</strong> We ensure your data is accurate and up-to-date.</li>
                                <li><strong>Security:</strong> We implement organizational, physical, and technical security measures.</li>
                            </ul>

                            <h3>How We Handle Data Breaches</h3>
                            <p>
                                We have a dedicated incident response team. In the unlikely event of a data breach, we have procedures in place to:
                            </p>
                            <ol>
                                <li>Immediately contain and assess the breach.</li>
                                <li>Notify the National Privacy Commission (NPC) and affected data subjects within 72 hours if there is a risk to rights and freedoms.</li>
                                <li>Mitigate any potential harm and implement measures to prevent recurrence.</li>
                            </ol>

                            <h3>Data Retention</h3>
                            <p>
                                We retain your personal data only for as long as necessary for the fulfillment of the purposes for which it was obtained
                                or for the establishment, exercise or defense of legal claims, or for legitimate business purposes, or as provided by law.
                            </p>

                            <h3>Contact Data Protection Officer</h3>
                            <p>
                                For any concerns regarding data privacy and protection, you may contact our Data Protection Officer (DPO) at:
                                <br />
                                <a href="mailto:dpo@alwan.ph" className="text-[#009245] hover:underline">dpo@alwan.ph</a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
