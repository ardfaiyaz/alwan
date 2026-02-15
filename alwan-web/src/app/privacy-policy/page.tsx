'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#009245] transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="text-sm font-medium text-slate-900">Privacy Policy</div>
                </div>
            </header>

            <main className="pt-24 pb-16 lg:pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
                        <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                        <div className="prose prose-slate prose-lg max-w-none">
                            <p>
                                At Alwan ("we," "our," or "us"), we are committed to protecting your privacy and personal information.
                                This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website
                                or use our mobile application.
                            </p>

                            <h3>1. Information We Collect</h3>
                            <p>
                                We collect information that you provide directly to us when you register for an account, apply for a loan,
                                or communicate with us. This may include:
                            </p>
                            <ul>
                                <li>Personal identification information (Name, email address, phone number, date of birth)</li>
                                <li>Financial information (Bank account details, income statements)</li>
                                <li>Government-issued identification numbers</li>
                                <li>Employment information</li>
                            </ul>

                            <h3>2. How We Use Your Information</h3>
                            <p>
                                We use the information we collect to:
                            </p>
                            <ul>
                                <li>Process your loan applications and transactions</li>
                                <li>Verify your identity and assess creditworthiness</li>
                                <li>Send you technical notices, updates, security alerts, and support messages</li>
                                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                            </ul>

                            <h3>3. Sharing of Information</h3>
                            <p>
                                We may share your information with:
                            </p>
                            <ul>
                                <li>Financial partners and credit bureaus for loan processing</li>
                                <li>Service providers who perform services on our behalf</li>
                                <li>Law enforcement or other government entities if required by law</li>
                            </ul>
                            <p>
                                We do not sell your personal information to third parties.
                            </p>

                            <h3>4. Data Security</h3>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal information against
                                unauthorized access, alteration, disclosure, or destruction. We use bank-grade encryption for all sensitive data.
                            </p>

                            <h3>5. Your Rights</h3>
                            <p>
                                You have the right to:
                            </p>
                            <ul>
                                <li>Access the personal information we hold about you</li>
                                <li>Request correction of any inaccurate information</li>
                                <li>Request deletion of your account and personal information</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>

                            <h3>6. Contact Us</h3>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:
                                <br />
                                <a href="mailto:privacy@alwan.ph" className="text-[#009245] hover:underline">privacy@alwan.ph</a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
