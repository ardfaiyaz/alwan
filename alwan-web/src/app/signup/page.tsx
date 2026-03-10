'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useKYCStore } from '@/lib/store/kyc-store'
import { noiseTextureStyle } from '@/lib/constants/styles'
import StepIndicator from '@/components/kyc/StepIndicator'
import MobileStep from '@/components/kyc/steps/MobileStep'
import OTPStep from '@/components/kyc/steps/OTPStep'
import PINStep from '@/components/kyc/steps/PINStep'
import PersonalInfoStep from '@/components/kyc/steps/PersonalInfoStep'
import ContactInfoStep from '@/components/kyc/steps/ContactInfoStep'
import AddressStep from '@/components/kyc/steps/AddressStep'
import IdentityStep from '@/components/kyc/steps/IdentityStep'
import BusinessStep from '@/components/kyc/steps/BusinessStep'
import FinancialStep from '@/components/kyc/steps/FinancialStep'
import GuarantorStep from '@/components/kyc/steps/GuarantorStep'
import DocumentsStep from '@/components/kyc/steps/DocumentsStep'
import LegalConsentsStep from '@/components/kyc/steps/LegalConsentsStep'
import { createClient } from '@/lib/supabase/client'

const STEP_TITLES = [
  'Mobile Number',
  'Verify OTP',
  'Create PIN',
  'Personal Information',
  'Contact Information',
  'Address',
  'Identity Verification',
  'Business Information',
  'Financial Information',
  'Guarantor (Optional)',
  'Documents',
  'Legal Consents',
]

export default function SignupPage() {
  const router = useRouter()
  const { currentStep } = useKYCStore()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <MobileStep />
      case 2:
        return <OTPStep />
      case 3:
        return <PINStep />
      case 4:
        return <PersonalInfoStep />
      case 5:
        return <ContactInfoStep />
      case 6:
        return <AddressStep />
      case 7:
        return <IdentityStep />
      case 8:
        return <BusinessStep />
      case 9:
        return <FinancialStep />
      case 10:
        return <GuarantorStep />
      case 11:
        return <DocumentsStep />
      case 12:
        return <LegalConsentsStep />
      default:
        return <MobileStep />
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - Same as hero section */}
      <div className="fixed inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06]">
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={noiseTextureStyle}
        />
        <div
          className="absolute right-0 top-0 h-full w-1/2 opacity-30"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 70% 40%, rgba(0,146,69,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute left-0 bottom-0 h-2/3 w-1/2 opacity-40"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(0,0,0,0.8) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with logo */}
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <img
                src="/icons/alwan-logo-white.png"
                alt="Alwan"
                className="h-8 w-auto"
              />
              <button
                onClick={() => router.push('/')}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                Back to Home
              </button>
            </motion.div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={12}
              stepTitles={STEP_TITLES}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-2xl mx-auto">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              {renderStep()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
