'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
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
        toast.error('Failed to send OTP. Please try again.')
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
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/icons/alwan-footer-logo.png"
          alt="Alwan"
          className="h-10 w-auto"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Your Mobile Number
        </h3>
        <p className="text-gray-600">
          We'll send you a verification code to confirm your identity
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium">
              +63
            </div>
            <input
              type="tel"
              {...register('mobileNumber')}
              placeholder="9XX XXX XXXX"
              maxLength={10}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          {errors.mobileNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.mobileNumber.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Enter your 10-digit mobile number starting with 9
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-800">
            <strong>Why we need this:</strong> Your mobile number serves as your unique account ID and is required for KYC verification under BSP and AML regulations.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-bold rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
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

      {/* OR Divider */}
      <div className="relative flex items-center gap-4 py-2">
        <div className="flex-grow h-px bg-gray-200"></div>
        <span className="text-xs text-gray-500 font-medium uppercase">or</span>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>

      {/* Already have an account */}
      <button
        type="button"
        onClick={() => window.location.href = '/?login=true'}
        className="w-full px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-full transition-all duration-300 ease-in-out hover:shadow-md"
      >
        Already have an account?
      </button>
    </div>
  )
}
