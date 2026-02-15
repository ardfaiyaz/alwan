'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#009245] transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="text-sm font-medium text-slate-900">Terms of Service</div>
                </div>
            </header>

            <main className="pt-24 pb-16 lg:pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Terms of Service</h1>
                        <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                        <div className="prose prose-slate prose-lg max-w-none">
                            <p>
                                These Terms of Service ("Terms") govern your access to and use of the Alwan website and mobile application
                                (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                            </p>

                            <h3>1. Eligibility</h3>
                            <p>
                                To use our Services, you must be at least 18 years old and a resident of the Philippines.
                                You represent and warrant that you have the right, authority, and capacity to enter into this agreement.
                            </p>

                            <h3>2. Account Registration</h3>
                            <p>
                                You must register for an account to access certain features of our Services. You agree to provide accurate,
                                current, and complete information during the registration process and to keep your account information updated.
                            </p>

                            <h3>3. Loan Services</h3>
                            <p>
                                Alwan provides microfinance services. All loan applications are subject to approval based on our credit assessment criteria.
                                We reserve the right to approve or deny any loan application at our sole discretion.
                            </p>
                            <ul>
                                <li>Interest rates and fees are transparently disclosed before loan acceptance.</li>
                                <li>Repayment terms must be strictly adhered to.</li>
                                <li>Late payments may incur additional fees and affect your credit score.</li>
                            </ul>

                            <h3>4. User Conduct</h3>
                            <p>
                                You agree not to:
                            </p>
                            <ul>
                                <li>Use the Services for any illegal purpose</li>
                                <li>Provide false or misleading information</li>
                                <li>Interfere with or disrupt the integrity or performance of the Services</li>
                                <li>Attempt to gain unauthorized access to the Services or related systems</li>
                            </ul>

                            <h3>5. Intellectual Property</h3>
                            <p>
                                The Services and their entire contents, features, and functionality (including but not limited to all information,
                                software, text, displays, images, video, and audio) are owned by Alwan and are protected by copyright, trademark,
                                and other intellectual property laws.
                            </p>

                            <h3>6. Limitation of Liability</h3>
                            <p>
                                In no event shall Alwan be liable for any indirect, incidental, special, consequential, or punitive damages,
                                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from
                                your access to or use of or inability to access or use the Services.
                            </p>

                            <h3>7. Changes to Terms</h3>
                            <p>
                                We may modify these Terms at any time. We will provide notice of any material changes by posting the updated
                                Terms on our website. Your continued use of the Services following the posting of changes constitutes your
                                acceptance of such changes.
                            </p>

                            <h3>8. Contact Us</h3>
                            <p>
                                For any questions regarding these Terms, please contact us at:
                                <br />
                                <a href="mailto:support@alwan.ph" className="text-[#009245] hover:underline">support@alwan.ph</a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
