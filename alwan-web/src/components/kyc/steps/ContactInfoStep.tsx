'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { contactInfoSchema, type ContactInfoFormData } from '@/lib/validations/kyc-schemas'
import { toast } from 'sonner'

export default function ContactInfoStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: formData.email,
      alternatePhone: formData.alternatePhone,
    },
  })

  const onSubmit = (data: ContactInfoFormData) => {
    updateFormData(data)
    markStepComplete(5)
    toast.success('Contact information saved!')
    setCurrentStep(6)
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Primary Mobile (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Mobile Number
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-medium">
              +63
            </div>
            <input
              type="tel"
              value={formData.mobileNumber}
              disabled
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            This is your verified mobile number
          </p>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            placeholder="juan.delacruz@email.com"
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.email.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            We'll use this for important notifications and account recovery
          </p>
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternate Phone Number <span className="text-gray-500">(Optional)</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-medium">
              +63
            </div>
            <input
              type="tel"
              {...register('alternatePhone')}
              placeholder="9XX XXX XXXX"
              maxLength={10}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            />
          </div>
          {errors.alternatePhone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.alternatePhone.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Backup contact number for emergencies
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Privacy note:</strong> Your contact information is encrypted and will only be used for account-related communications.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 ease-in-out"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-semibold rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
