'use client'

import { useEffect } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, FileText, Lock, FileSearch } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
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
  'Mobile Verification',
  'OTP Verification',
  'Security PIN',
  'Personal Details',
  'Contact Information',
  'Address Details',
  'Identity Verification',
  'Business Information',
  'Financial Information',
  'Guarantor Details',
  'Document Upload',
  'Legal Agreements',
]



export default function SignupPage() {
  const router = useRouter()
  const { currentStep } = useKYCStore()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.push('/')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }
    checkAuth()
  }, [router])

  const [previousStep, setPreviousStep] = React.useState(currentStep)

  React.useEffect(() => {
    setPreviousStep(currentStep)
  }, [currentStep])

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

  const progressPercentage = (currentStep / 12) * 100

  // Get carousel items with better spacing
  const getCarouselItems = () => {
    const items = []
    const isMovingForward = currentStep > previousStep
    
    // Show 2 previous steps (more blurred as they go up)
    if (currentStep > 2) {
      items.push({
        title: STEP_TITLES[currentStep - 3],
        position: 'far-prev',
        opacity: 0.15,
        blur: 'blur-md',
        scale: 0.85,
        y: -120
      })
    }
    
    if (currentStep > 1) {
      items.push({
        title: STEP_TITLES[currentStep - 2],
        position: 'prev',
        opacity: 0.3,
        blur: 'blur-sm',
        scale: 0.9,
        y: -60
      })
    }
    
    // Current step (main focus)
    items.push({
      title: STEP_TITLES[currentStep - 1],
      position: 'current',
      opacity: 1,
      blur: '',
      scale: 1,
      y: 0,
      isMovingForward
    })
    
    // Show 2 next steps (more blurred as they go down)
    if (currentStep < 12) {
      items.push({
        title: STEP_TITLES[currentStep],
        position: 'next',
        opacity: 0.3,
        blur: 'blur-sm',
        scale: 0.9,
        y: 60
      })
    }
    
    if (currentStep < 11) {
      items.push({
        title: STEP_TITLES[currentStep + 1],
        position: 'far-next',
        opacity: 0.15,
        blur: 'blur-md',
        scale: 0.85,
        y: 120
      })
    }
    
    return items
  }

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Decorative Gradient Orbs - Full Page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-200/40 to-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-teal-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-bl from-emerald-300/20 to-green-400/10 rounded-full blur-3xl" />
      </div>

      {/* Back Button - Top Right */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-full text-gray-700 text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 ease-in-out hover:shadow-lg"
        >
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden sm:inline">Back to Website</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="min-h-screen flex flex-col">
        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center px-3 py-12 xs:px-4 xs:py-14 sm:px-6 sm:py-16 md:px-8 lg:px-20 lg:py-12">
          <div className="w-full max-w-[1600px] mx-auto">
            <div className="grid lg:grid-cols-[45%_55%] gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-20 xl:gap-32 items-center">
              {/* Left Side - Vertical Carousel */}
              <div className="hidden lg:flex flex-col items-center justify-center relative py-12">
                {/* Alwan Logo */}
                <div className="mb-8">
                  <img 
                    src="/icons/alwan-footer-logo.png" 
                    alt="Alwan" 
                    className="h-12 w-auto"
                  />
                </div>
                
                <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
                  {getCarouselItems().map((item, index) => {
                    const isMovingForward = currentStep > previousStep
                    
                    return (
                      <motion.div
                        key={`${item.position}-${currentStep}-${index}`}
                        initial={{ 
                          opacity: 0, 
                          y: isMovingForward ? item.y + 60 : item.y - 60,
                          scale: 0.8 
                        }}
                        animate={{ 
                          opacity: item.opacity, 
                          y: item.y, 
                          scale: item.scale 
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: isMovingForward ? item.y - 60 : item.y + 60,
                          scale: 0.8 
                        }}
                        transition={{ 
                          duration: 0.4, 
                          ease: [0.4, 0, 0.2, 1],
                          delay: index * 0.08
                        }}
                        className={`absolute text-center px-8 ${item.blur} ${
                          item.position === 'current' ? 'z-10' : 'z-0'
                        }`}
                      >
                        <h2 className={`font-bold bg-gradient-to-r from-[#009245] via-[#4dd88f] to-[#056633] bg-clip-text text-transparent leading-tight ${
                          item.position === 'current' ? 'text-5xl' : 'text-3xl'
                        }`}>
                          {item.title}
                        </h2>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Legal Links - Desktop */}
                <div className="flex items-center justify-center gap-8 mt-16">
                  <Link 
                    href="/legal/privacy-policy" 
                    target="_blank"
                    className="flex flex-col items-center gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out group"
                  >
                    <Shield className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">Privacy Policy</span>
                  </Link>
                  <Link 
                    href="/legal/terms-and-conditions" 
                    target="_blank"
                    className="flex flex-col items-center gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out group"
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">Terms & Conditions</span>
                  </Link>
                  <Link 
                    href="/legal/data-privacy-consent" 
                    target="_blank"
                    className="flex flex-col items-center gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out group"
                  >
                    <Lock className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">Data Privacy</span>
                  </Link>
                  <Link 
                    href="/legal/credit-investigation-authorization" 
                    target="_blank"
                    className="flex flex-col items-center gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out group"
                  >
                    <FileSearch className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">Credit Investigation</span>
                  </Link>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="w-full max-w-2xl mx-auto lg:mx-0">
                {/* Form Card */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12"
                >
                  {renderStep()}
                </motion.div>

                {/* Legal Links - Mobile */}
                <div className="lg:hidden flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <Link 
                    href="/legal/privacy-policy" 
                    target="_blank"
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-full hover:border-emerald-300 hover:shadow-md"
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">Privacy Policy</span>
                  </Link>
                  <Link 
                    href="/legal/terms-and-conditions" 
                    target="_blank"
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-full hover:border-emerald-300 hover:shadow-md"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">Terms & Conditions</span>
                  </Link>
                  <Link 
                    href="/legal/data-privacy-consent" 
                    target="_blank"
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-full hover:border-emerald-300 hover:shadow-md"
                  >
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">Data Privacy</span>
                  </Link>
                  <Link 
                    href="/legal/credit-investigation-authorization" 
                    target="_blank"
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 ease-in-out px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-full hover:border-emerald-300 hover:shadow-md"
                  >
                    <FileSearch className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">Credit Investigation</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Contact - Centered */}
        <div className="relative z-10 pb-4 xs:pb-5 sm:pb-6 md:pb-8 lg:pb-10">
          <div className="max-w-2xl mx-auto px-3 xs:px-4 sm:px-6">
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50/30 border border-gray-200/50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 md:p-5">
              <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                Need help? Contact us at{' '}
                <a href="mailto:support@alwan.ph" className="font-semibold bg-gradient-to-r from-[#009245] to-[#056633] bg-clip-text text-transparent hover:from-[#056633] hover:to-[#009245] transition-all break-all">
                  support@alwan.ph
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
