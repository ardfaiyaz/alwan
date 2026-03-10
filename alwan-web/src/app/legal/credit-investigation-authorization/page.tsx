'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreditInvestigationAuthorizationPage() {
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
            Credit Investigation Authorization
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Authorization for Credit Information and Background Verification
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authorization Statement</h2>
              <p className="text-gray-700 leading-relaxed">
                I hereby authorize Alwan and its authorized representatives to conduct credit investigations, background checks, and verification of information provided in my loan application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scope of Authorization</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                This authorization permits Alwan to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Obtain credit reports from the Credit Information Corporation (CIC)</li>
                <li>Verify employment and income information</li>
                <li>Contact references and guarantors</li>
                <li>Verify business information and registration</li>
                <li>Check with other financial institutions regarding credit history</li>
                <li>Conduct background checks as necessary</li>
                <li>Verify identity documents and biometric information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information to be Verified</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The following information may be verified:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Personal Information:</strong> Name, address, date of birth, civil status</li>
                <li><strong>Employment:</strong> Current and previous employment, income</li>
                <li><strong>Credit History:</strong> Existing loans, payment history, credit score</li>
                <li><strong>Business Information:</strong> Business registration, financial performance</li>
                <li><strong>References:</strong> Contact with provided references and guarantors</li>
                <li><strong>Public Records:</strong> Court records, regulatory filings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Credit Information Corporation (CIC)</h2>
              <p className="text-gray-700 leading-relaxed">
                I understand that Alwan will submit my credit information to the Credit Information Corporation (CIC) as required by Republic Act No. 9510 (Credit Information System Act). This information will be used to generate my credit report and credit score.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting to Credit Bureaus</h2>
              <p className="text-gray-700 leading-relaxed">
                I authorize Alwan to report my credit information, including loan details and payment history, to authorized credit bureaus. This information may affect my credit score and future credit applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The information obtained will be used to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Assess creditworthiness and loan eligibility</li>
                <li>Determine appropriate loan amounts and terms</li>
                <li>Verify the accuracy of application information</li>
                <li>Comply with regulatory requirements</li>
                <li>Prevent fraud and identity theft</li>
                <li>Monitor and manage credit risk</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Confidentiality</h2>
              <p className="text-gray-700 leading-relaxed">
                All information obtained through credit investigation will be treated as confidential and used solely for the purposes stated in this authorization. Information will be shared only with authorized parties as required by law or necessary for loan processing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Duration of Authorization</h2>
              <p className="text-gray-700 leading-relaxed">
                This authorization remains valid for the duration of my relationship with Alwan and for any future loan applications I may submit. I may revoke this authorization in writing, but such revocation will not affect information already obtained or shared.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Right to Access Credit Information</h2>
              <p className="text-gray-700 leading-relaxed">
                I have the right to access my credit information held by the Credit Information Corporation and to dispute any inaccurate information. I may contact CIC directly or through Alwan to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acknowledgment of Understanding</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                I acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>I have read and understood this authorization</li>
                <li>I voluntarily provide this authorization</li>
                <li>Credit investigation may affect my loan application decision</li>
                <li>Negative credit information may result in loan denial</li>
                <li>False information may result in application rejection and legal consequences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about credit investigation or to exercise your rights:
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Credit Department</strong><br />
                Email: credit@alwan.ph<br />
                Phone: +63 XXX XXX XXXX
              </p>
              <p className="text-gray-700 mt-4">
                <strong>Credit Information Corporation</strong><br />
                Website: www.cic.gov.ph<br />
                Hotline: (02) 8479-4242
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Consent</h2>
              <p className="text-gray-700 leading-relaxed">
                By accepting this authorization, I confirm that I have read, understood, and agree to allow Alwan to conduct credit investigations and background checks as described above.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
