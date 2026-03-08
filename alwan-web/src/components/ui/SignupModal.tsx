'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Upload, Check } from 'lucide-react'
import { toast } from 'sonner'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

type SignupStep = 'info' | 'phone' | 'otp' | 'pin'

// Philippine data
const PROVINCES = [
  'Metro Manila', 'Cebu', 'Davao del Sur', 'Laguna', 'Cavite', 'Bulacan',
  'Pampanga', 'Batangas', 'Rizal', 'Pangasinan', 'Iloilo', 'Negros Occidental'
]

const CITIES: { [key: string]: string[] } = {
  'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 'Mandaluyong'],
  'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu'],
  'Davao del Sur': ['Davao City', 'Digos'],
  'Laguna': ['Calamba', 'Santa Rosa', 'Biñan'],
  'Cavite': ['Bacoor', 'Dasmariñas', 'Imus'],
}

const BARANGAYS = ['Barangay 1', 'Barangay 2', 'Barangay 3', 'San Jose', 'Santa Maria']

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [step, setStep] = useState<SignupStep>('info')
  // Step 1: Personal Info
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthdate, setBirthdate] = useState('')

  // Address
  const [province, setProvince] = useState('Metro Manila')
  const [city, setCity] = useState('Manila')
  const [barangay, setBarangay] = useState('Barangay 1')
  const [zipCode, setZipCode] = useState('')
  const [houseStreet, setHouseStreet] = useState('')

  // Document
  const [proofOfBilling, setProofOfBilling] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 2: Phone
  const [phoneNumber, setPhoneNumber] = useState('')

  // Step 3: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [timer, setTimer] = useState(60)

  // Step 4: PIN
  const [pin, setPin] = useState(['', '', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', ''])
  const [pinStep, setPinStep] = useState<'create' | 'confirm'>('create')
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfBilling(e.target.files[0])
    }
  }

  const handleInfoSubmit = () => {
    if (!firstName || !lastName || !birthdate || !zipCode || !houseStreet || !proofOfBilling) {
      toast.error('Please fill in all required fields')
      return
    }
    setStep('phone')
  }

  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    setStep('otp')
    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(digit => digit !== '') && index === 5) {
      // Auto verify
      setTimeout(() => setStep('pin'), 500)
    }
  }

  const handlePinChange = (value: string, index: number, isConfirm: boolean) => {
    if (value.length > 1) return

    if (isConfirm) {
      const newPin = [...confirmPin]
      newPin[index] = value
      setConfirmPin(newPin)

      if (value && index < 4) {
        pinRefs.current[index + 1]?.focus()
      }

      if (newPin.every(digit => digit !== '') && index === 4) {
        // Check match
        if (pin.join('') === newPin.join('')) {
          toast.success('Account created successfully!')
          setTimeout(() => {
            onClose()
            // Redirect or refresh
            window.location.href = '/'
          }, 1000)
        } else {
          toast.error('PINs do not match. Please try again.')
          setConfirmPin(['', '', '', '', ''])
          setPinStep('create')
          setPin(['', '', '', '', ''])
          setTimeout(() => pinRefs.current[0]?.focus(), 100)
        }
      }
    } else {
      const newPin = [...pin]
      newPin[index] = value
      setPin(newPin)

      if (value && index < 4) {
        pinRefs.current[index + 1]?.focus()
      }

      if (newPin.every(digit => digit !== '') && index === 4) {
        setPinStep('confirm')
        setConfirmPin(['', '', '', '', ''])
        setTimeout(() => pinRefs.current[0]?.focus(), 100)
      }
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 'info': return 'Create Account'
      case 'phone': return 'Phone Number'
      case 'otp': return 'Verify OTP'
      case 'pin': return pinStep === 'create' ? 'Create PIN' : 'Confirm PIN'
    }
  }

  const getStepSubtitle = () => {
    switch (step) {
      case 'info': return 'Step 1 of 4: Personal Information'
      case 'phone': return 'Step 2 of 4: We\'ll send you an OTP'
      case 'otp': return 'Step 3 of 4: Enter the code sent to your phone'
      case 'pin': return pinStep === 'create' ? 'Step 4 of 4: Create a 5-digit security PIN' : 'Re-enter your PIN to confirm'
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
                className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto"
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

                <div className="p-6 sm:p-8 pt-12">
                  {/* Header */}
                  <div className="flex flex-col items-center mb-6">
                    <Image
                      src="/icons/alwan-logo-white.png"
                      alt="Alwan Logo"
                      width={120}
                      height={40}
                      className="h-8 w-auto mb-6"
                    />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">{getStepTitle()}</h2>
                      <p className="text-sm text-gray-300">{getStepSubtitle()}</p>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-4">
                    {/* Step 1: Personal Info */}
                    {step === 'info' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-300 ml-1">First Name *</label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-300 ml-1">Middle Name</label>
                            <input
                              type="text"
                              value={middleName}
                              onChange={(e) => setMiddleName(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                              placeholder="Optional"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-300 ml-1">Last Name *</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                            placeholder="Enter last name"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-300 ml-1">Birthdate *</label>
                          <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-300 ml-1">Province *</label>
                            <select
                              value={province}
                              onChange={(e) => {
                                setProvince(e.target.value)
                                setCity(CITIES[e.target.value]?.[0] || '')
                              }}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                            >
                              {PROVINCES.map((prov) => (
                                <option key={prov} value={prov} className="bg-gray-800">{prov}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-300 ml-1">City *</label>
                            <select
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                            >
                              {(CITIES[province] || []).map((c) => (
                                <option key={c} value={c} className="bg-gray-800">{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-300 ml-1">Barangay *</label>
                            <select
                              value={barangay}
                              onChange={(e) => setBarangay(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                            >
                              {BARANGAYS.map((brgy) => (
                                <option key={brgy} value={brgy} className="bg-gray-800">{brgy}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-300 ml-1">Zip Code *</label>
                            <input
                              type="text"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              maxLength={4}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                              placeholder="1234"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-300 ml-1">House Number and Street *</label>
                          <input
                            type="text"
                            value={houseStreet}
                            onChange={(e) => setHouseStreet(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm mt-1"
                            placeholder="e.g., 123 Main Street"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-300 ml-1">Proof of Billing *</label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-4 py-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors mt-1 flex flex-col items-center gap-2"
                          >
                            {proofOfBilling ? (
                              <>
                                <Check className="w-6 h-6 text-green-400" />
                                <span className="text-sm">{proofOfBilling.name}</span>
                                <span className="text-xs text-gray-400">Click to change</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6" />
                                <span className="text-sm">Upload Proof of Billing</span>
                                <span className="text-xs text-gray-400">Utility bill, bank statement, etc.</span>
                              </>
                            )}
                          </button>
                        </div>

                        <button
                          onClick={handleInfoSubmit}
                          className="btn-signup-modal w-full mt-4"
                        >
                          Continue
                        </button>
                      </div>
                    )}

                    {/* Step 2: Phone */}
                    {step === 'phone' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-300 ml-1">Mobile Number *</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm">+63</span>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                              maxLength={10}
                              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 text-sm"
                              placeholder="9XX XXX XXXX"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-2 ml-1">We'll send a verification code to this number</p>
                        </div>

                        <button
                          onClick={handlePhoneSubmit}
                          disabled={phoneNumber.length < 10}
                          className="btn-signup-modal w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send OTP
                        </button>
                      </div>
                    )}

                    {/* Step 3: OTP */}
                    {step === 'otp' && (
                      <div className="space-y-6">
                        <div className="flex justify-between gap-2">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              ref={(ref) => { otpRefs.current[index] = ref }}
                              type="text"
                              value={digit}
                              onChange={(e) => handleOtpChange(e.target.value, index)}
                              maxLength={1}
                              className="w-12 h-14 bg-white/5 border-2 border-white/20 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-white/40 focus:bg-white/10"
                            />
                          ))}
                        </div>

                        <div className="text-center">
                          {timer > 0 ? (
                            <p className="text-gray-400 text-sm">Resend code in {timer}s</p>
                          ) : (
                            <button onClick={() => setTimer(60)} className="text-emerald-400 font-semibold text-sm">
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 4: PIN */}
                    {step === 'pin' && (
                      <div className="space-y-6">
                        <div className="flex justify-between gap-2">
                          {(pinStep === 'confirm' ? confirmPin : pin).map((digit, index) => (
                            <input
                              key={`${pinStep}-${index}`}
                              ref={(ref) => { pinRefs.current[index] = ref }}
                              type="password"
                              value={digit}
                              onChange={(e) => handlePinChange(e.target.value, index, pinStep === 'confirm')}
                              maxLength={1}
                              className="w-12 h-14 bg-white/5 border-2 border-white/20 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-white/40 focus:bg-white/10"
                            />
                          ))}
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                          <p className="text-sm text-blue-200">
                            Your PIN will be used to secure your account and authorize transactions.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Login Link */}
                  {step === 'info' && (
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <button onClick={onClose} className="text-emerald-400 font-semibold hover:text-emerald-300">
                          Log In
                        </button>
                      </p>
                    </div>
                  )}
                </div>

                <style jsx>{`
                  .btn-signup-modal {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-center;
                    padding: 0.8rem 1.1rem;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #000;
                    border-radius: 999px;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1.5px solid rgba(255, 255, 255, 1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 48px;
                  }
                  .btn-signup-modal:hover {
                    background: #ffffff;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                  }
                `}</style>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
