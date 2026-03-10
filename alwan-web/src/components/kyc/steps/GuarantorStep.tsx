'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Users, ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { guarantorSchema, type GuarantorFormData } from '@/lib/validations/kyc-schemas'
import { toast } from 'sonner'

export default function GuarantorStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [guarantorIdFile, setGuarantorIdFile] = useState<File | null>(formData.guarantorIdFile)
  const [skipGuarantor, setSkipGuarantor] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuarantorFormData>({
    resolver: zodResolver(guarantorSchema),
    defaultValues: {
      guarantorFullName: formData.guarantorFullName,
      guarantorRelationship: formData.guarantorRelationship,
      guarantorAddress: formData.guarantorAddress,
      guarantorPhone: formData.guarantorPhone,
      guarantorOccupation: formData.guarantorOccupation,
    },
  })

  const handleFileChange = (file: File | null) => {
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

    setGuarantorIdFile(file)
  }

  const onSubmit = (data: GuarantorFormData) => {
    if (!skipGuarantor) {
      // Validate that at least name is provided if not skipping
      if (!data.guarantorFullName) {
        toast.error('Please provide guarantor information or skip this step')
        return
      }
    }

    updateFormData({
      ...data,
      guarantorIdFile: skipGuarantor ? null : guarantorIdFile,
    })
    markStepComplete(10)
    toast.success(skipGuarantor ? 'Skipped guarantor information' : 'Guarantor information saved!')
    setCurrentStep(11)
  }

  const handleSkip = () => {
    setSkipGuarantor(true)
    updateFormData({
      guarantorFullName: '',
      guarantorRelationship: '',
      guarantorAddress: '',
      guarantorPhone: '',
      guarantorOccupation: '',
      guarantorIdFile: null,
    })
    markStepComplete(10)
    toast.success('Skipped guarantor information')
    setCurrentStep(11)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <Users className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Guarantor Information
        </h3>
        <p className="text-white/70">
          Optional: Add a co-borrower or guarantor
        </p>
      </div>

      {/* Skip Option */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <p className="text-sm text-yellow-200 mb-3">
          <strong>Note:</strong> A guarantor is optional but may improve your loan approval chances.
        </p>
        <button
          type="button"
          onClick={handleSkip}
          className="w-full px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-medium rounded-lg transition-all"
        >
          Skip This Step
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Full Name
          </label>
          <input
            type="text"
            {...register('guarantorFullName')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="Juan Santos Dela Cruz"
          />
          {errors.guarantorFullName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.guarantorFullName.message}
            </motion.p>
          )}
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Relationship
          </label>
          <select
            {...register('guarantorRelationship')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
          >
            <option value="" className="bg-gray-800">Select relationship</option>
            <option value="spouse" className="bg-gray-800">Spouse</option>
            <option value="parent" className="bg-gray-800">Parent</option>
            <option value="sibling" className="bg-gray-800">Sibling</option>
            <option value="child" className="bg-gray-800">Child</option>
            <option value="relative" className="bg-gray-800">Relative</option>
            <option value="friend" className="bg-gray-800">Friend</option>
            <option value="business_partner" className="bg-gray-800">Business Partner</option>
            <option value="other" className="bg-gray-800">Other</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Address
          </label>
          <textarea
            {...register('guarantorAddress')}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all resize-none"
            placeholder="Complete address"
          />
        </div>

        {/* Phone & Occupation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
                +63
              </div>
              <input
                type="tel"
                {...register('guarantorPhone')}
                placeholder="9XX XXX XXXX"
                maxLength={10}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Occupation
            </label>
            <input
              type="text"
              {...register('guarantorOccupation')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="e.g., Teacher, Driver"
            />
          </div>
        </div>

        {/* ID Upload */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Valid ID <span className="text-white/50">(Optional)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-all flex flex-col items-center gap-2"
          >
            {guarantorIdFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-400" />
                <span className="text-sm text-white">{guarantorIdFile.name}</span>
                <span className="text-xs text-white/50">Click to change</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-white/60" />
                <span className="text-sm text-white">Upload Guarantor's ID</span>
                <span className="text-xs text-white/50">Any valid government ID</span>
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>About guarantors:</strong> A guarantor agrees to repay the loan if you're unable to. This can strengthen your application and may result in better loan terms.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(9)}
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
