'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
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
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
              placeholder="Juan"
            />
            {errors.firstName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.firstName.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              {...register('middleName')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
              placeholder="Santos"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('lastName')}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            placeholder="Dela Cruz"
          />
          {errors.lastName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.lastName.message}
            </motion.p>
          )}
        </div>

        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('dateOfBirth')}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            />
            {errors.dateOfBirth && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.dateOfBirth.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register('gender')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.gender.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Civil Status & Nationality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Civil Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register('civilStatus')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            >
              <option value="">Select status</option>
              {CIVIL_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.civilStatus && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.civilStatus.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nationality')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
              placeholder="Filipino"
            />
            {errors.nationality && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.nationality.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Mother's Maiden Name & Dependents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mother's Maiden Name
            </label>
            <input
              type="text"
              {...register('mothersMaidenName')}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Dependents <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('numberOfDependents', { valueAsNumber: true })}
              min="0"
              max="20"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
              placeholder="0"
            />
            {errors.numberOfDependents && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.numberOfDependents.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Why we need this:</strong> Personal information is required for KYC identity verification under BSP regulations.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
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
