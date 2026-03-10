'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, ArrowRight, ArrowLeft, Check, X, Loader2, AlertCircle } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { identitySchema, type IdentityFormData } from '@/lib/validations/kyc-schemas'
import { ID_TYPES } from '@/lib/constants/philippines'
import { toast } from 'sonner'
import { loadFaceModels, compareFaces, createImageElement, captureImageFromVideo, canvasToBlob } from '@/lib/utils/faceRecognition'

export default function IdentityStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [idFrontFile, setIdFrontFile] = useState<File | null>(formData.idFrontFile)
  const [idBackFile, setIdBackFile] = useState<File | null>(formData.idBackFile)
  const [selfieFile, setSelfieFile] = useState<File | null>(formData.selfieFile)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [faceMatchScore, setFaceMatchScore] = useState(formData.faceMatchScore || 0)
  const [faceMatchVerified, setFaceMatchVerified] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const idFrontInputRef = useRef<HTMLInputElement>(null)
  const idBackInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      idType: formData.idType || undefined,
      idNumber: formData.idNumber,
    },
  })

  useEffect(() => {
    // Load face recognition models on mount
    loadFaceModels().catch(console.error)

    return () => {
      // Cleanup camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Failed to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const captureSelfie = async () => {
    if (!videoRef.current) return

    try {
      const canvas = captureImageFromVideo(videoRef.current)
      const blob = await canvasToBlob(canvas)
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
      
      setSelfieFile(file)
      stopCamera()
      toast.success('Selfie captured!')
    } catch (error) {
      console.error('Error capturing selfie:', error)
      toast.error('Failed to capture selfie')
    }
  }

  const handleFileChange = (file: File | null, type: 'idFront' | 'idBack' | 'selfie') => {
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    switch (type) {
      case 'idFront':
        setIdFrontFile(file)
        break
      case 'idBack':
        setIdBackFile(file)
        break
      case 'selfie':
        setSelfieFile(file)
        break
    }
  }

  const verifyFaceMatch = async () => {
    if (!idFrontFile || !selfieFile) {
      toast.error('Please upload both ID and selfie')
      return
    }

    setIsVerifying(true)

    try {
      // Create image elements
      const idImage = await createImageElement(idFrontFile)
      const selfieImage = await createImageElement(selfieFile)

      // Compare faces
      const result = await compareFaces(idImage, selfieImage)

      setFaceMatchScore(result.similarity)
      setFaceMatchVerified(result.match)

      if (result.match) {
        toast.success(`Face match verified! Similarity: ${result.similarity}%`)
      } else {
        toast.error(`Face match failed. Similarity: ${result.similarity}%. Please try again.`)
      }
    } catch (error) {
      console.error('Error verifying face match:', error)
      toast.error('Failed to verify face match. Please ensure faces are clearly visible.')
    } finally {
      setIsVerifying(false)
    }
  }

  const onSubmit = (data: IdentityFormData) => {
    if (!idFrontFile) {
      toast.error('Please upload ID front image')
      return
    }

    if (!selfieFile) {
      toast.error('Please upload or capture a selfie')
      return
    }

    if (!faceMatchVerified) {
      toast.error('Please verify face match before continuing')
      return
    }

    updateFormData({
      ...data,
      idFrontFile,
      idBackFile,
      selfieFile,
      faceMatchScore,
    })
    markStepComplete(7)
    toast.success('Identity verification completed!')
    setCurrentStep(8)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <Camera className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Identity Verification
        </h3>
        <p className="text-white/70">
          Upload your ID and take a selfie for KYC compliance
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ID Type */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            ID Type <span className="text-red-400">*</span>
          </label>
          <select
            {...register('idType')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
          >
            <option value="" className="bg-gray-800">Select ID type</option>
            {ID_TYPES.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
          {errors.idType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.idType.message}
            </motion.p>
          )}
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            ID Number <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('idNumber')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="Enter ID number"
          />
          {errors.idNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.idNumber.message}
            </motion.p>
          )}
        </div>

        {/* ID Front Upload */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            ID Front Image <span className="text-red-400">*</span>
          </label>
          <input
            ref={idFrontInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'idFront')}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => idFrontInputRef.current?.click()}
            className="w-full px-4 py-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-all flex flex-col items-center gap-2"
          >
            {idFrontFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-400" />
                <span className="text-sm text-white">{idFrontFile.name}</span>
                <span className="text-xs text-white/50">Click to change</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-white/60" />
                <span className="text-sm text-white">Upload ID Front</span>
                <span className="text-xs text-white/50">Clear photo of the front side</span>
              </>
            )}
          </button>
        </div>

        {/* ID Back Upload */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            ID Back Image <span className="text-white/50">(Optional)</span>
          </label>
          <input
            ref={idBackInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'idBack')}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => idBackInputRef.current?.click()}
            className="w-full px-4 py-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-all flex flex-col items-center gap-2"
          >
            {idBackFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-400" />
                <span className="text-sm text-white">{idBackFile.name}</span>
                <span className="text-xs text-white/50">Click to change</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-white/60" />
                <span className="text-sm text-white">Upload ID Back</span>
                <span className="text-xs text-white/50">Clear photo of the back side</span>
              </>
            )}
          </button>
        </div>

        {/* Selfie Capture */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Selfie <span className="text-red-400">*</span>
          </label>
          
          <AnimatePresence mode="wait">
            {showCamera ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3"
              >
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={captureSelfie}
                    className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3"
              >
                {selfieFile ? (
                  <div className="w-full px-4 py-6 bg-white/5 border-2 border-dashed border-emerald-400/50 rounded-xl flex flex-col items-center gap-2">
                    <Check className="w-6 h-6 text-emerald-400" />
                    <span className="text-sm text-white">{selfieFile.name}</span>
                  </div>
                ) : null}
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <Camera className="w-5 h-5" />
                    Take Selfie
                  </button>
                  <button
                    type="button"
                    onClick={() => selfieInputRef.current?.click()}
                    className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <Upload className="w-5 h-5" />
                    Upload
                  </button>
                </div>
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'selfie')}
                  className="hidden"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Face Match Verification */}
        {idFrontFile && selfieFile && !showCamera && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <button
              type="button"
              onClick={verifyFaceMatch}
              disabled={isVerifying || faceMatchVerified}
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Face Match...
                </>
              ) : faceMatchVerified ? (
                <>
                  <Check className="w-5 h-5" />
                  Face Match Verified ({faceMatchScore}%)
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Verify Face Match
                </>
              )}
            </button>

            {faceMatchScore > 0 && (
              <div className={`p-4 rounded-xl border ${faceMatchVerified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-start gap-3">
                  {faceMatchVerified ? (
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${faceMatchVerified ? 'text-emerald-400' : 'text-red-400'}`}>
                      {faceMatchVerified ? 'Face Match Successful' : 'Face Match Failed'}
                    </p>
                    <p className={`text-xs mt-1 ${faceMatchVerified ? 'text-emerald-200' : 'text-red-200'}`}>
                      Similarity score: {faceMatchScore}%
                      {!faceMatchVerified && ' (Minimum 60% required)'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>KYC Requirement:</strong> Face matching prevents fraud and ensures compliance with BSP and AML regulations. Your biometric data is encrypted and securely stored.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(6)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={!faceMatchVerified}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
