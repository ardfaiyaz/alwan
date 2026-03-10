'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
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

interface KYCSignupModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenLogin?: () => void
}

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

export default function KYCSignupModal({ isOpen, onClose, onOpenLogin }: KYCSignupModalProps) {
  const { currentStep, resetForm } = useKYCStore()

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-2xl pointer-events-auto my-8"
            >
              {/* Glass Modal Content */}
              <div
                className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
                style={{
                  background: 'rgba(20, 20, 20, 0.65)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 sm:p-8 pt-10 sm:pt-12">
                  {/* Logo and Title */}
                  <div className="flex flex-col items-center mb-6">
                    <Image
                      src="/icons/alwan-logo-white.png"
                      alt="Alwan Logo"
                      width={120}
                      height={40}
                      className="h-8 w-auto mb-6"
                    />
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">
                        Create Your Account
                      </h2>
                      <p className="text-sm text-gray-300">
                        Complete the KYC process to get started
                      </p>
                    </div>
                  </div>

                  {/* Step Indicator */}
                  <div className="mb-6">
                    <StepIndicator
                      currentStep={currentStep}
                      totalSteps={12}
                      stepTitles={STEP_TITLES}
                    />
                  </div>

                  {/* Step Content */}
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStep()}
                  </motion.div>

                  {/* Footer - Already have account */}
                  {currentStep === 1 && (
                    <div className="mt-6 text-center">
                      <p className="text-sm text-white/60">
                        Already have an account?{' '}
                        <button
                          onClick={() => {
                            onClose()
                            onOpenLogin?.()
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                          Log In
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
