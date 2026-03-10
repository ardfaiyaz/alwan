'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
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
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <Mail className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Contact Information
        </h3>
        <p className="text-white/70">
          How can we reach you?
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Primary Mobile (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Primary Mobile Number
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
              +63
            </div>
            <input
              type="tel"
              value={formData.mobileNumber}
              disabled
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 cursor-not-allowed"
            />
          </div>
          <p className="mt-2 text-xs text-white/50">
            This is your verified mobile number
          </p>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Email Address <span className="text-white/50">(Optional)</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="juan.delacruz@email.com"
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.email.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-white/50">
            We'll use this for important notifications and account recovery
          </p>
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Alternate Phone Number <span className="text-white/50">(Optional)</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
              +63
            </div>
            <input
              type="tel"
              {...register('alternatePhone')}
              placeholder="9XX XXX XXXX"
              maxLength={10}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            />
          </div>
          {errors.alternatePhone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.alternatePhone.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-white/50">
            Backup contact number for emergencies
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>Privacy note:</strong> Your contact information is encrypted and will only be used for account-related communications.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
