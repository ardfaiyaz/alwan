'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Briefcase, ArrowRight, ArrowLeft } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { businessSchema, type BusinessFormData } from '@/lib/validations/kyc-schemas'
import { BUSINESS_TYPES, REGISTRATION_TYPES } from '@/lib/constants/philippines'
import { toast } from 'sonner'

export default function BusinessStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: formData.businessName,
      businessType: formData.businessType,
      businessAddress: formData.businessAddress,
      yearsOperating: formData.yearsOperating,
      registrationType: formData.registrationType || undefined,
      registrationNumber: formData.registrationNumber,
      dailySales: formData.dailySales,
      monthlyRevenue: formData.monthlyRevenue,
      numberOfEmployees: formData.numberOfEmployees,
    },
  })

  const registrationType = watch('registrationType')

  const onSubmit = (data: BusinessFormData) => {
    updateFormData(data)
    markStepComplete(8)
    toast.success('Business information saved!')
    setCurrentStep(9)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Business Information
        </h3>
        <p className="text-white/70">
          Tell us about your business for loan assessment
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Business Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('businessName')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="Juan's Sari-sari Store"
          />
          {errors.businessName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.businessName.message}
            </motion.p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Business Type <span className="text-red-400">*</span>
          </label>
          <select
            {...register('businessType')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
          >
            <option value="" className="bg-gray-800">Select business type</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type} className="bg-gray-800">
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.businessType.message}
            </motion.p>
          )}
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Business Address <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register('businessAddress')}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all resize-none"
            placeholder="Complete business address"
          />
          {errors.businessAddress && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.businessAddress.message}
            </motion.p>
          )}
        </div>

        {/* Years Operating */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Years Operating <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            {...register('yearsOperating', { valueAsNumber: true })}
            min="0"
            max="100"
            step="0.5"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="5"
          />
          {errors.yearsOperating && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.yearsOperating.message}
            </motion.p>
          )}
        </div>

        {/* Registration Type */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Business Registration <span className="text-red-400">*</span>
          </label>
          <select
            {...register('registrationType')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
          >
            <option value="" className="bg-gray-800">Select registration type</option>
            {REGISTRATION_TYPES.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
          {errors.registrationType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.registrationType.message}
            </motion.p>
          )}
        </div>

        {/* Registration Number (conditional) */}
        {registrationType && registrationType !== 'none' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              {...register('registrationNumber')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="Enter registration number"
            />
          </motion.div>
        )}

        {/* Daily Sales & Monthly Revenue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Daily Sales (₱) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              {...register('dailySales', { valueAsNumber: true })}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="5000"
            />
            {errors.dailySales && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.dailySales.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Monthly Revenue (₱) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              {...register('monthlyRevenue', { valueAsNumber: true })}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="150000"
            />
            {errors.monthlyRevenue && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.monthlyRevenue.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Number of Employees */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Number of Employees <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            {...register('numberOfEmployees', { valueAsNumber: true })}
            min="0"
            max="1000"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="2"
          />
          {errors.numberOfEmployees && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.numberOfEmployees.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-white/50">
            Include yourself and any helpers or employees
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>Why we need this:</strong> Business information helps us assess your loan eligibility and determine appropriate loan amounts.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(7)}
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
