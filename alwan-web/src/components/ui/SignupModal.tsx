'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Upload, Check } from 'lucide-react'
import { toast } from 'sonner'
import { signupMember, verifyOTP, resendOTP, completeSignup } from '@/app/actions/signup'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenLogin?: () => void
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

export default function SignupModal({ isOpen, onClose, onOpenLogin }: SignupModalProps) {
  const [step, setStep] = useState<SignupStep>('info')
  const [isLoading, setIsLoading] = useState(false)
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

  // Store temp data from signup
  const [tempData, setTempData] = useState<any>(null)

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    
    // Submit all data and send OTP
    const result = await signupMember({
      firstName,
      middleName,
      lastName,
      birthdate,
      phone: phoneNumber,
      address: {
        province,
        city,
        barangay,
        zipCode,
        houseStreet,
      },
      pin: '', // Will be set in PIN step
      proofOfBillingFile: proofOfBilling!,
    })

    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    // Store temp data for later use
    if (result.tempData) {
      setTempData(result.tempData)
    }

    toast.success('OTP sent to your phone!')
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

  const handleOtpChange = async (value: string, index: number) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(digit => digit !== '') && index === 5) {
      // Auto verify
      setIsLoading(true)
      const otpCode = newOtp.join('')
      
      const result = await verifyOTP(phoneNumber, otpCode)
      setIsLoading(false)

      if (result.error) {
        toast.error(result.error)
        setOtp(['', '', '', '', '', ''])
        otpRefs.current[0]?.focus()
        return
      }

      toast.success('Phone verified!')
      setTimeout(() => setStep('pin'), 500)
    }
  }

  const handlePinChange = async (value: string, index: number, isConfirm: boolean) => {
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
          // Complete signup by creating member record
          setIsLoading(true)
          
          const result = await completeSignup(tempData, pin.join(''))
          
          setIsLoading(false)
          
          if (result.error) {
            toast.error(result.error)
            return
          }
          
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
                className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar"
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
                      <div className="space-y-5">
                        {/* Personal Information Section */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Personal Information</h3>
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
                        </div>

                        {/* Address Section */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Address</h3>
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
                        </div>

                        {/* Document Section */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Document</h3>
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
                        </div>

                        <button
                          onClick={handleInfoSubmit}
                          className="btn-login-modal w-full"
                        >
                          Continue
                        </button>

                        <div className="relative flex items-center gap-4 py-2 mb-4">
                          <div className="flex-grow h-px bg-white/10"></div>
                          <span className="text-xs text-white font-medium uppercase">or</span>
                          <div className="flex-grow h-px bg-white/10"></div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            onOpenLogin?.()
                          }}
                          className="btn-signup-modal w-full flex justify-center items-center"
                        >
                          Log In
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
                            <button 
                              type="button"
                              onClick={async () => {
                                const result = await resendOTP(phoneNumber)
                                if (result.error) {
                                  toast.error(result.error)
                                } else {
                                  toast.success('OTP resent!')
                                  setTimer(60)
                                }
                              }} 
                              className="text-emerald-400 font-semibold text-sm hover:text-emerald-300"
                            >
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
                </div>

                <style jsx>{`
                  .btn-login-modal {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                    overflow: hidden;
                    min-height: 48px;
                  }
                  .btn-login-modal::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                      to right,
                      rgba(255, 255, 255, 0) 0%,
                      rgba(255, 255, 255, 0.6) 50%,
                      rgba(255, 255, 255, 0) 100%
                    );
                    transform: skewX(-25deg);
                    transition: none;
                  }
                  .btn-login-modal:hover::after {
                    left: 150%;
                    transition: left 0.7s ease-in-out;
                  }
                  .btn-login-modal:hover {
                    background: #ffffff;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                  }

                  .btn-signup-modal {
                    position: relative;
                    padding: 0.8rem 1.1rem;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #fff;
                    border-radius: 999px;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1.5px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 48px;
                  }
                  .btn-signup-modal:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.4);
                  }

                  /* Custom Scrollbar Styling */
                  :global(.custom-scrollbar::-webkit-scrollbar) {
                    width: 8px;
                  }
                  :global(.custom-scrollbar::-webkit-scrollbar-track) {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                  }
                  :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    transition: background 0.3s ease;
                  }
                  :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
                    background: rgba(255, 255, 255, 0.35);
                  }
                  /* Firefox scrollbar */
                  :global(.custom-scrollbar) {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
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
