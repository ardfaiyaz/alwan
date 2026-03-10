'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { User, ArrowRight, ArrowLeft } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { personalInfoSchema, type PersonalInfoFormData } from '@/lib/validations/kyc-schemas'
import { CIVIL_STATUS_OPTIONS, GENDER_OPTIONS } from '@/lib/constants/philippines'
import { toast } from 'sonner'

export default function PersonalInfoStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender || undefined,
      civilStatus: formData.civilStatus || undefined,
      nationality: formData.nationality || 'Filipino',
      mothersMaidenName: formData.mothersMaidenName,
      numberOfDependents: formData.numberOfDependents,
    },
  })

  const onSubmit = (data: PersonalInfoFormData) => {
    updateFormData(data)
    markStepComplete(4)
    toast.success('Personal information saved!')
    setCurrentStep(5)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <User className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Personal Information
        </h3>
        <p className="text-white/70">
          Tell us about yourself for KYC verification
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="Juan"
            />
            {errors.firstName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.firstName.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              {...register('middleName')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="Santos"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('lastName')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="Dela Cruz"
          />
          {errors.lastName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.lastName.message}
            </motion.p>
          )}
        </div>

        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              {...register('dateOfBirth')}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            />
            {errors.dateOfBirth && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.dateOfBirth.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Gender <span className="text-red-400">*</span>
            </label>
            <select
              {...register('gender')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            >
              <option value="" className="bg-gray-800">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.gender.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Civil Status & Nationality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Civil Status <span className="text-red-400">*</span>
            </label>
            <select
              {...register('civilStatus')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            >
              <option value="" className="bg-gray-800">Select status</option>
              {CIVIL_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
            {errors.civilStatus && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.civilStatus.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Nationality <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('nationality')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="Filipino"
            />
            {errors.nationality && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.nationality.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Mother's Maiden Name & Dependents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Mother's Maiden Name
            </label>
            <input
              type="text"
              {...register('mothersMaidenName')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Number of Dependents <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              {...register('numberOfDependents', { valueAsNumber: true })}
              min="0"
              max="20"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="0"
            />
            {errors.numberOfDependents && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.numberOfDependents.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>Why we need this:</strong> Personal information is required for KYC identity verification under BSP regulations.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
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
