'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { toast } from 'sonner'

export default function PINStep() {
  const { updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [pinStep, setPinStep] = useState<'create' | 'confirm'>('create')
  const [pin, setPin] = useState(['', '', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', ''])
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  const currentPin = pinStep === 'create' ? pin : confirmPin
  const setCurrentPin = pinStep === 'create' ? setPin : setConfirmPin

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return

    const newPin = [...currentPin]
    newPin[index] = value
    setCurrentPin(newPin)

    // Auto-focus next input
    if (value && index < 4) {
      pinRefs.current[index + 1]?.focus()
    }

    // Auto-proceed when all digits are entered
    if (newPin.every(digit => digit !== '') && index === 4) {
      if (pinStep === 'create') {
        // Move to confirm step
        setTimeout(() => {
          setPinStep('confirm')
          setConfirmPin(['', '', '', '', ''])
          setTimeout(() => pinRefs.current[0]?.focus(), 100)
        }, 300)
      } else {
        // Verify match
        handleVerifyMatch(newPin.join(''))
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyMatch = (confirmedPin: string) => {
    const createdPin = pin.join('')

    if (createdPin === confirmedPin) {
      // PINs match
      updateFormData({ pin: createdPin })
      markStepComplete(3)
      toast.success('PIN created successfully!')
      setTimeout(() => setCurrentStep(4), 500)
    } else {
      // PINs don't match
      toast.error("PINs don't match. Please try again.")
      setPinStep('create')
      setPin(['', '', '', '', ''])
      setConfirmPin(['', '', '', '', ''])
      setTimeout(() => pinRefs.current[0]?.focus(), 100)
    }
  }

  const handleBack = () => {
    if (pinStep === 'confirm') {
      setPinStep('create')
      setConfirmPin(['', '', '', '', ''])
      setTimeout(() => pinRefs.current[0]?.focus(), 100)
    } else {
      setCurrentStep(2)
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
          {pinStep === 'create' ? 'Create Your PIN' : 'Confirm Your PIN'}
        </h3>
        <p className="text-gray-600">
          {pinStep === 'create'
            ? 'Create a 5-digit PIN to secure your account'
            : 'Re-enter your PIN to confirm'}
        </p>
      </div>

      {/* PIN Input */}
      <div className="flex justify-center gap-3">
        {currentPin.map((digit, index) => (
          <motion.input
            key={`${pinStep}-${index}`}
            ref={(ref) => { pinRefs.current[index] = ref }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="w-12 h-14 sm:w-14 sm:h-16 bg-white border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        ))}
      </div>

      {/* Progress Indicator */}
      {pinStep === 'confirm' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-emerald-600"
        >
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">PIN created</span>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Security tip:</strong> Your PIN will be used to authorize transactions and access sensitive features. Choose a PIN that's easy to remember but hard to guess.
        </p>
      </div>

      {/* PIN Requirements */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">PIN Requirements:</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Must be exactly 5 digits
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Avoid obvious patterns (12345, 11111)
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Don't use your birthdate
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-full transition-all duration-300 ease-in-out hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => {
            if (pinStep === 'create' && pin.every(d => d)) {
              setPinStep('confirm')
              setConfirmPin(['', '', '', '', ''])
              setTimeout(() => pinRefs.current[0]?.focus(), 100)
            } else if (pinStep === 'confirm' && confirmPin.every(d => d)) {
              handleVerifyMatch(confirmPin.join(''))
            }
          }}
          disabled={!currentPin.every(d => d)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-bold rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
        >
          {pinStep === 'create' ? 'Continue' : 'Confirm PIN'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
