'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Phone, ArrowRight, Loader2 } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { mobileSchema, type MobileFormData } from '@/lib/validations/kyc-schemas'
import { toast } from 'sonner'
import { sendOTP } from '@/app/actions/kyc'

export default function MobileStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MobileFormData>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobileNumber: formData.mobileNumber,
    },
  })

  const onSubmit = async (data: MobileFormData) => {
    setIsLoading(true)

    try {
      // Send OTP via Twilio Verify
      const result = await sendOTP(`+63${data.mobileNumber}`)

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      // Update form data
      updateFormData({ mobileNumber: data.mobileNumber })
      markStepComplete(1)

      toast.success('OTP sent to your mobile number!')
      setCurrentStep(2)
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <Phone className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Enter Your Mobile Number
        </h3>
        <p className="text-white/70">
          We'll send you a verification code to confirm your identity
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Mobile Number
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
              +63
            </div>
            <input
              type="tel"
              {...register('mobileNumber')}
              placeholder="9XX XXX XXXX"
              maxLength={10}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            />
          </div>
          {errors.mobileNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400"
            >
              {errors.mobileNumber.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-white/50">
            Enter your 10-digit mobile number starting with 9
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>Why we need this:</strong> Your mobile number serves as your unique account ID and is required for KYC verification under BSP and AML regulations.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-sm text-white/60">
          Already have an account?{' '}
          <a href="/" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}
