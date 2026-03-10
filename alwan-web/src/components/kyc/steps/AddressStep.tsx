'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { addressSchema, type AddressFormData } from '@/lib/validations/kyc-schemas'
import { PROVINCES, CITIES_BY_PROVINCE, HOUSING_TYPE_OPTIONS } from '@/lib/constants/philippines'
import { toast } from 'sonner'
import { useState } from 'react'

export default function AddressStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [selectedProvince, setSelectedProvince] = useState(formData.province || 'Metro Manila')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      houseNumber: formData.houseNumber,
      street: formData.street,
      barangay: formData.barangay,
      city: formData.city,
      province: formData.province || 'Metro Manila',
      zipCode: formData.zipCode,
      yearsLiving: formData.yearsLiving,
      housingType: formData.housingType || undefined,
    },
  })

  const onSubmit = (data: AddressFormData) => {
    updateFormData(data)
    markStepComplete(6)
    toast.success('Address information saved!')
    setCurrentStep(7)
  }

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province)
    setValue('province', province)
    // Reset city when province changes
    const cities = CITIES_BY_PROVINCE[province] || []
    if (cities.length > 0) {
      setValue('city', cities[0])
    }
  }

  const availableCities = CITIES_BY_PROVINCE[selectedProvince] || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Address Information
        </h3>
        <p className="text-white/70">
          Where do you currently live?
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* House Number & Street */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              House/Unit Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('houseNumber')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="123"
            />
            {errors.houseNumber && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.houseNumber.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Street <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('street')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="Main Street"
            />
            {errors.street && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.street.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Barangay */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Barangay <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('barangay')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="Barangay Name"
          />
          {errors.barangay && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.barangay.message}
            </motion.p>
          )}
        </div>

        {/* Province & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Province <span className="text-red-400">*</span>
            </label>
            <select
              {...register('province')}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            >
              {PROVINCES.map((province) => (
                <option key={province} value={province} className="bg-gray-800">
                  {province}
                </option>
              ))}
            </select>
            {errors.province && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.province.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              City/Municipality <span className="text-red-400">*</span>
            </label>
            {availableCities.length > 0 ? (
              <select
                {...register('city')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city} className="bg-gray-800">
                    {city}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                {...register('city')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                placeholder="Enter city"
              />
            )}
            {errors.city && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.city.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Zip Code & Years Living */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Zip Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('zipCode')}
              maxLength={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="1234"
            />
            {errors.zipCode && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.zipCode.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Years Living Here <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              {...register('yearsLiving', { valueAsNumber: true })}
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
              placeholder="5"
            />
            {errors.yearsLiving && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-400"
              >
                {errors.yearsLiving.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Housing Type */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Housing Type <span className="text-red-400">*</span>
          </label>
          <select
            {...register('housingType')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
          >
            <option value="" className="bg-gray-800">Select housing type</option>
            {HOUSING_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
          {errors.housingType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.housingType.message}
            </motion.p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>Why we need this:</strong> Address verification is required for microfinance lending under BSP regulations.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
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
