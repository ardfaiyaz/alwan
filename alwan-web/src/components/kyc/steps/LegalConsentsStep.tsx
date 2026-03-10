'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Loader2, ExternalLink } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { legalConsentsSchema, type LegalConsentsFormData } from '@/lib/validations/kyc-schemas'
import { toast } from 'sonner'
import { submitKYCApplication } from '@/app/actions/kyc'
import { useRouter } from 'next/navigation'

export default function LegalConsentsStep() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, markStepComplete, resetForm } = useKYCStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LegalConsentsFormData>({
    resolver: zodResolver(legalConsentsSchema),
    defaultValues: {
      termsAccepted: formData.termsAccepted,
      privacyAccepted: formData.privacyAccepted,
      dataPrivacyAccepted: formData.dataPrivacyAccepted,
      creditInvestigationAccepted: formData.creditInvestigationAccepted,
    },
  })

  const allAccepted = watch('termsAccepted') && 
                      watch('privacyAccepted') && 
                      watch('dataPrivacyAccepted') && 
                      watch('creditInvestigationAccepted')

  const onSubmit = async (data: LegalConsentsFormData) => {
    setIsSubmitting(true)

    try {
      // Check if user data exists
      if (!formData.userId && !formData.mobileNumber) {
        toast.error('Session expired. Please start over from the beginning.')
        setIsSubmitting(false)
        // Reset form and go back to step 1
        setTimeout(() => {
          resetForm()
          router.push('/signup')
        }, 2000)
        return
      }

      updateFormData(data)
      markStepComplete(12)

      const result = await submitKYCApplication({
        ...formData,
        ...data,
      })

      if (result.error) {
        // Check if it's an authentication error
        if (result.error.includes('not authenticated')) {
          setAuthError(true)
          toast.error('Session expired. Please start over from the beginning.')
          setTimeout(() => {
            resetForm()
            router.push('/signup')
          }, 3000)
        } else {
          toast.error(result.error)
        }
        setIsSubmitting(false)
        return
      }

      toast.success('KYC application submitted successfully!')
      
      resetForm()
      router.push('/signup/complete')
    } catch (error) {
      console.error('Error submitting KYC application:', error)
      toast.error('Failed to submit application. Please try again.')
      setIsSubmitting(false)
    }
  }

  const legalDocuments = [
    {
      id: 'termsAccepted',
      title: 'Terms and Conditions',
      description: 'General terms of service for using Alwan platform',
      link: '/legal/terms-and-conditions',
    },
    {
      id: 'privacyAccepted',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information',
      link: '/legal/privacy-policy',
    },
    {
      id: 'dataPrivacyAccepted',
      title: 'Data Privacy Consent',
      description: 'Consent for processing personal data under Data Privacy Act of 2012',
      link: '/legal/data-privacy-consent',
    },
    {
      id: 'creditInvestigationAccepted',
      title: 'Credit Investigation Authorization',
      description: 'Authorization to conduct credit checks and background verification',
      link: '/legal/credit-investigation-authorization',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Authentication Error Alert */}
      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">Session Expired</h4>
              <p className="text-sm text-red-700">
                Your authentication session has expired. You'll be redirected to start the signup process again. 
                Please complete the entire process without refreshing the page.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Legal Documents */}
        <div className="space-y-4">
          {legalDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all duration-300 ease-in-out"
            >
              <a
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 cursor-pointer"
                onClick={(e) => {
                  // Don't prevent default - let the link work
                  e.stopPropagation()
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      {...register(doc.id as keyof LegalConsentsFormData)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 rounded border-2 border-gray-300 bg-white text-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer transition-all duration-300 ease-in-out"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {doc.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 p-2 text-emerald-600">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              {errors[doc.id as keyof LegalConsentsFormData] && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 pb-4 ml-8 text-sm text-red-500"
                >
                  {errors[doc.id as keyof LegalConsentsFormData]?.message}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Regulatory Compliance Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Regulatory Compliance:</strong>
          </p>
          <ul className="space-y-1 text-xs text-blue-700">
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>BSP (Bangko Sentral ng Pilipinas) regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>SEC (Securities and Exchange Commission) requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Data Privacy Act of 2012 compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Anti-Money Laundering Act (AMLA) requirements</span>
            </li>
          </ul>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> By accepting these agreements, you confirm that all information provided is accurate and complete. False information may result in application rejection or legal consequences.
          </p>
        </div>

        {/* Progress Summary */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Check className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-800">
              Application Complete!
            </p>
          </div>
          <p className="text-xs text-emerald-700">
            You've completed all required steps. Review the legal agreements above and submit your application for review.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(11)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={!allAccepted || isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-semibold rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
