'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft, Check, Loader2, ExternalLink } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { legalConsentsSchema, type LegalConsentsFormData } from '@/lib/validations/kyc-schemas'
import { toast } from 'sonner'
import { submitKYCApplication } from '@/app/actions/kyc'
import { useRouter } from 'next/navigation'

export default function LegalConsentsStep() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, markStepComplete, resetForm } = useKYCStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Update form data with consents
      updateFormData(data)
      markStepComplete(12)

      // Submit complete KYC application
      const result = await submitKYCApplication({
        ...formData,
        ...data,
      })

      if (result.error) {
        toast.error(result.error)
        setIsSubmitting(false)
        return
      }

      toast.success('KYC application submitted successfully!')
      
      // Reset form and redirect
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
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Legal Consents
        </h3>
        <p className="text-white/70">
          Review and accept our legal agreements
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Legal Documents */}
        <div className="space-y-4">
          {legalDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    {...register(doc.id as keyof LegalConsentsFormData)}
                    className="w-5 h-5 rounded border-2 border-white/20 bg-white/5 text-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-white/60">
                        {doc.description}
                      </p>
                    </div>
                    <a
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              {errors[doc.id as keyof LegalConsentsFormData] && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 ml-8 text-sm text-red-400"
                >
                  {errors[doc.id as keyof LegalConsentsFormData]?.message}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Regulatory Compliance Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200 mb-2">
            <strong>Regulatory Compliance:</strong>
          </p>
          <ul className="space-y-1 text-xs text-blue-200/80">
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>BSP (Bangko Sentral ng Pilipinas) regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>SEC (Securities and Exchange Commission) requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Data Privacy Act of 2012 compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Anti-Money Laundering Act (AMLA) requirements</span>
            </li>
          </ul>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-sm text-yellow-200">
            <strong>Important:</strong> By accepting these agreements, you confirm that all information provided is accurate and complete. False information may result in application rejection or legal consequences.
          </p>
        </div>

        {/* Progress Summary */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Check className="w-5 h-5 text-emerald-400" />
            <p className="text-sm font-semibold text-emerald-400">
              Application Complete!
            </p>
          </div>
          <p className="text-xs text-emerald-200/80">
            You've completed all required steps. Review the legal agreements above and submit your application for review.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(11)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={!allAccepted || isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
