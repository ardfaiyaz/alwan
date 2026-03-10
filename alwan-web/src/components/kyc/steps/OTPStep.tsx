'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { toast } from 'sonner'
import { verifyOTP, resendOTP } from '@/app/actions/kyc'

export default function OTPStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    otpRefs.current[0]?.focus()

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode: string) => {
    setIsLoading(true)

    try {
      const result = await verifyOTP(`+63${formData.mobileNumber}`, otpCode)

      if (result.error) {
        toast.error(result.error)
        setOtp(['', '', '', '', '', ''])
        otpRefs.current[0]?.focus()
        setIsLoading(false)
        return
      }

      // Update form data
      updateFormData({ otpVerified: true })
      markStepComplete(2)

      toast.success('Phone number verified!')
      setTimeout(() => setCurrentStep(3), 500)
    } catch (error) {
      toast.error('Failed to verify OTP')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsLoading(true)
    const result = await resendOTP(`+63${formData.mobileNumber}`)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('OTP resent!')
      setTimer(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()

      // Restart timer
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Verify Your Number
        </h3>
        <p className="text-white/70">
          Enter the 6-digit code sent to
        </p>
        <p className="text-emerald-400 font-semibold mt-1">
          +63 {formData.mobileNumber}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => { otpRefs.current[index] = ref }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isLoading}
            className="w-12 h-14 sm:w-14 sm:h-16 bg-white/5 border-2 border-white/20 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all disabled:opacity-50"
          />
        ))}
      </div>

      {/* Timer / Resend */}
      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-white/60 text-sm">
            Resend code in <span className="text-white font-semibold">{timer}s</span>
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-blue-200">
          <strong>Didn't receive the code?</strong> Check your messages or wait for the timer to resend.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(1)}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => handleVerify(otp.join(''))}
          disabled={isLoading || otp.some(digit => !digit)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
