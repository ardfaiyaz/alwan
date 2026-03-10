'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermsAndConditionsPage() {
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
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: March 10, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Alwan platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services</h2>
              <p className="text-gray-700 leading-relaxed">
                Alwan provides microfinance lending services to qualified individuals and businesses in the Philippines. Our services include loan applications, disbursements, and repayment management.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To use our services, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Be at least 18 years old</li>
                <li>Be a Philippine resident</li>
                <li>Have a valid Philippine mobile number</li>
                <li>Provide accurate and complete information</li>
                <li>Pass our KYC verification process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Account Registration</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Loan Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                All loans are subject to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Credit assessment and approval</li>
                <li>Interest rates as disclosed in your loan agreement</li>
                <li>Repayment schedules as agreed upon</li>
                <li>Late payment fees and penalties as applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use the platform only for lawful purposes</li>
                <li>Provide truthful and accurate information</li>
                <li>Make timely loan repayments</li>
                <li>Notify us of any changes to your contact information</li>
                <li>Not share your account with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide false or misleading information</li>
                <li>Use the platform for fraudulent purposes</li>
                <li>Attempt to access unauthorized areas</li>
                <li>Interfere with the platform's operation</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any other reason we deem necessary to protect our platform and users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Alwan shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the platform after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: legal@alwan.ph<br />
                Phone: +63 XXX XXX XXXX
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
