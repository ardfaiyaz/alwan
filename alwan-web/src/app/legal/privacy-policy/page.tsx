'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-300 ease-in-out"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: March 10, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect the following types of information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Personal identification information (name, date of birth, address)</li>
                <li>Contact information (phone number, email address)</li>
                <li>Financial information (income, expenses, assets)</li>
                <li>Business information (business name, type, revenue)</li>
                <li>Identity documents (government-issued IDs)</li>
                <li>Biometric data (facial recognition for verification)</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Process your loan applications</li>
                <li>Verify your identity (KYC compliance)</li>
                <li>Assess creditworthiness</li>
                <li>Communicate with you about your account</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Credit bureaus for credit assessment</li>
                <li>Regulatory authorities as required by law</li>
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when legally required</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Under the Data Privacy Act of 2012, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Object to processing in certain circumstances</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your information for as long as necessary to provide our services and comply with legal obligations. Loan records are typically retained for 7 years as required by Philippine law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                For privacy-related questions or to exercise your rights, contact our Data Protection Officer:
              </p>
              <p className="text-gray-700 mt-2">
                Email: privacy@alwan.ph<br />
                Phone: +63 XXX XXX XXXX
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
