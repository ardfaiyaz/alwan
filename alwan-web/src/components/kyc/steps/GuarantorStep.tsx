'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react'
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setGuarantorIdFile(file)
  }

  const onSubmit = (data: GuarantorFormData) => {
    if (!skipGuarantor) {
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
      {/* Skip Option */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800 mb-3">
          <strong>Note:</strong> A guarantor is optional but may improve your loan approval chances.
        </p>
        <button
          type="button"
          onClick={handleSkip}
          className="w-full px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium rounded-lg transition-all duration-300 ease-in-out"
        >
          Skip This Step
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            {...register('guarantorFullName')}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            placeholder="Juan Santos Dela Cruz"
          />
          {errors.guarantorFullName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.guarantorFullName.message}
            </motion.p>
          )}
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship
          </label>
          <select
            {...register('guarantorRelationship')}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
          >
            <option value="">Select relationship</option>
            <option value="spouse">Spouse</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="child">Child</option>
            <option value="relative">Relative</option>
            <option value="friend">Friend</option>
            <option value="business_partner">Business Partner</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            {...register('guarantorAddress')}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out resize-none"
            placeholder="Complete address"
          />
        </div>

        {/* Phone & Occupation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-medium">
                +63
              </div>
              <input
                type="tel"
                {...register('guarantorPhone')}
                placeholder="9XX XXX XXXX"
                maxLength={10}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation
            </label>
            <input
              type="text"
              {...register('guarantorOccupation')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
              placeholder="e.g., Teacher, Driver"
            />
          </div>
        </div>

        {/* ID Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valid ID <span className="text-gray-500">(Optional)</span>
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
            className="w-full px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 ease-in-out flex flex-col items-center gap-2"
          >
            {guarantorIdFile ? (
              <>
                <Check className="w-6 h-6 text-emerald-500" />
                <span className="text-sm text-gray-900">{guarantorIdFile.name}</span>
                <span className="text-xs text-gray-500">Click to change</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-900">Upload Guarantor's ID</span>
                <span className="text-xs text-gray-500">Any valid government ID</span>
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>About guarantors:</strong> A guarantor agrees to repay the loan if you're unable to. This can strengthen your application and may result in better loan terms.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(9)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 ease-in-out"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-semibold rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
