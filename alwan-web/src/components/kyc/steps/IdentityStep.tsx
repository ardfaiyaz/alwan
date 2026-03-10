'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, ArrowRight, ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { identitySchema, type IdentityFormData } from '@/lib/validations/kyc-schemas'
import { ID_TYPES } from '@/lib/constants/philippines'
import { toast } from 'sonner'
import { 
  loadFaceModels, 
  compareFaces, 
  createImageFromFile, 
  captureImageFromVideo, 
  canvasToBlob,
  validateImageQuality 
} from '@/lib/utils/face-verification'

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
    loadFaceModels().catch(console.error)

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
        audio: false,
      })
      
      setStream(mediaStream)
      setShowCamera(true)
      
      // Wait for next tick to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          // Explicitly play the video
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err)
          })
        }
      }, 100)
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

  const handleFileChange = async (file: File | null, type: 'idFront' | 'idBack' | 'selfie') => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Set the file first
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

    // Validate image quality in background (non-blocking)
    if (type === 'idFront' || type === 'selfie') {
      try {
        await loadFaceModels()
        const img = await createImageFromFile(file)
        const validation = await validateImageQuality(img)
        
        if (!validation.valid) {
          toast.warning(validation.issues[0] || 'Image quality could be better, but you can continue')
        }
      } catch (error) {
        console.error('Image validation error:', error)
        // Don't block upload on validation errors
      }
    }
  }

  const verifyFaceMatch = async () => {
    if (!idFrontFile || !selfieFile) {
      toast.error('Please upload both ID and selfie')
      return
    }

    setIsVerifying(true)

    try {
      // Load models if not already loaded
      await loadFaceModels()

      // Create image elements from files
      const idImage = await createImageFromFile(idFrontFile)
      const selfieImage = await createImageFromFile(selfieFile)

      // Compare faces
      const result = await compareFaces(idImage, selfieImage)

      setFaceMatchScore(result.similarity)
      setFaceMatchVerified(result.match)

      if (result.match) {
        toast.success(`Face match verified! Similarity: ${result.similarity}%`)
      } else {
        toast.error(`Face match failed. Similarity: ${result.similarity}%. Please try again with clearer photos.`)
      }
    } catch (error: any) {
      console.error('Error verifying face match:', error)
      
      // Provide specific error messages
      if (error.message?.includes('No face detected')) {
        toast.error('No face detected. Please ensure your face is clearly visible in both photos.')
      } else if (error.message?.includes('Failed to load')) {
        toast.error('Failed to load face recognition models. Please check your internet connection.')
      } else {
        toast.error('Failed to verify face match. Please try again with clearer photos.')
      }
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
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ID Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('idType')}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
          >
            <option value="">Select ID type</option>
            {ID_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.idType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.idType.message}
            </motion.p>
          )}
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('idNumber')}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            placeholder="Enter ID number"
          />
          {errors.idNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.idNumber.message}
            </motion.p>
          )}
        </div>

        {/* ID Front Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Front Image <span className="text-red-500">*</span>
          </label>
          <input
            ref={idFrontInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              handleFileChange(file, 'idFront')
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => idFrontInputRef.current?.click()}
            className="w-full px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 ease-in-out flex flex-col items-center gap-2"
          >
            {idFrontFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-500" />
                <span className="text-sm text-gray-900">{idFrontFile.name}</span>
                <span className="text-xs text-gray-500">Click to change</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-900">Upload ID Front</span>
                <span className="text-xs text-gray-500">Clear photo of the front side</span>
              </>
            )}
          </button>
        </div>

        {/* ID Back Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Back Image <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            ref={idBackInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              handleFileChange(file, 'idBack')
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => idBackInputRef.current?.click()}
            className="w-full px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 ease-in-out flex flex-col items-center gap-2"
          >
            {idBackFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-500" />
                <span className="text-sm text-gray-900">{idBackFile.name}</span>
                <span className="text-xs text-gray-500">Click to change</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-900">Upload ID Back</span>
                <span className="text-xs text-gray-500">Clear photo of the back side</span>
              </>
            )}
          </button>
        </div>

        {/* Selfie Capture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selfie <span className="text-red-500">*</span>
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
                    onLoadedMetadata={(e) => {
                      const video = e.target as HTMLVideoElement
                      video.play().catch(err => console.error('Video play error:', err))
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={captureSelfie}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-semibold rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
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
                  <div className="w-full px-4 py-6 bg-white border-2 border-dashed border-emerald-500 rounded-xl flex flex-col items-center gap-2">
                    <Check className="w-6 h-6 text-emerald-500" />
                    <span className="text-sm text-gray-900">{selfieFile.name}</span>
                  </div>
                ) : null}
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-gray-700 font-medium"
                  >
                    <Camera className="w-5 h-5" />
                    Take Selfie
                  </button>
                  <button
                    type="button"
                    onClick={() => selfieInputRef.current?.click()}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-gray-700 font-medium"
                  >
                    <Upload className="w-5 h-5" />
                    Upload
                  </button>
                </div>
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    handleFileChange(file, 'selfie')
                  }}
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
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className={`p-4 rounded-xl border ${faceMatchVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  {faceMatchVerified ? (
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${faceMatchVerified ? 'text-emerald-800' : 'text-red-800'}`}>
                      {faceMatchVerified ? 'Face Match Successful' : 'Face Match Failed'}
                    </p>
                    <p className={`text-xs mt-1 ${faceMatchVerified ? 'text-emerald-700' : 'text-red-700'}`}>
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>KYC Requirement:</strong> Face matching prevents fraud and ensures compliance with BSP and AML regulations. Your biometric data is encrypted and securely stored.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(6)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 ease-in-out"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={!faceMatchVerified}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-semibold rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
