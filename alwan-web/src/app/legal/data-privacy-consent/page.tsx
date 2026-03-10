'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DataPrivacyConsentPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 sm:p-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Data Privacy Consent
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            In compliance with the Data Privacy Act of 2012 (Republic Act No. 10173)
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Consent Statement</h2>
              <p className="text-gray-700 leading-relaxed">
                By providing your consent, you authorize Alwan to collect, use, process, store, and share your personal and sensitive personal information as described in this document and our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information to be Collected</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We will collect and process the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Personal Information:</strong> Name, date of birth, gender, civil status, nationality, contact details, address</li>
                <li><strong>Sensitive Personal Information:</strong> Government-issued IDs, biometric data (facial recognition), financial information</li>
                <li><strong>Business Information:</strong> Business name, type, address, financial performance</li>
                <li><strong>Financial Information:</strong> Income, expenses, assets, existing loans</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Purpose of Collection</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Your information will be used for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Identity verification and KYC compliance</li>
                <li>Credit assessment and loan processing</li>
                <li>Fraud prevention and security</li>
                <li>Compliance with BSP, SEC, and AML regulations</li>
                <li>Communication regarding your account and services</li>
                <li>Legal and regulatory reporting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Your information may be shared with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Credit Information Corporation (CIC) for credit reporting</li>
                <li>Bangko Sentral ng Pilipinas (BSP) for regulatory compliance</li>
                <li>Anti-Money Laundering Council (AMLC) when required</li>
                <li>Authorized service providers (with data processing agreements)</li>
                <li>Law enforcement agencies when legally mandated</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security Measures</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement the following security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure access controls and authentication</li>
                <li>Regular security audits and assessments</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights as a Data Subject</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Under the Data Privacy Act, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Right to be Informed:</strong> Know how your data is being processed</li>
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Object:</strong> Object to processing in certain circumstances</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to legal requirements)</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to File a Complaint:</strong> Lodge complaints with the National Privacy Commission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Withdrawal of Consent</h2>
              <p className="text-gray-700 leading-relaxed">
                You may withdraw your consent at any time by contacting our Data Protection Officer. However, withdrawal may affect our ability to provide services to you and may not apply to processing required by law or for legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We will retain your personal information for as long as necessary to fulfill the purposes outlined in this consent and as required by law. Financial records are typically retained for 7 years in compliance with Philippine regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about data privacy or to exercise your rights:
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Data Protection Officer</strong><br />
                Email: dpo@alwan.ph<br />
                Phone: +63 XXX XXX XXXX<br />
                Address: [Company Address]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acknowledgment</h2>
              <p className="text-gray-700 leading-relaxed">
                By accepting this consent, you acknowledge that you have read, understood, and agree to the collection, use, processing, and sharing of your personal and sensitive personal information as described above.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
