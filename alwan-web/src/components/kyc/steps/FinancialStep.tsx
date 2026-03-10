'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'
import { financialSchema, type FinancialFormData } from '@/lib/validations/kyc-schemas'
import { toast } from 'sonner'

export default function FinancialStep() {
  const { formData, updateFormData, setCurrentStep, markStepComplete } = useKYCStore()
  const [existingLoans, setExistingLoans] = useState<Array<{ institution: string; amount: number }>>(
    formData.existingLoans || []
  )
  const [assets, setAssets] = useState<Array<{ type: string; value: number }>>(
    formData.assets || []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinancialFormData>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      monthlyIncome: formData.monthlyIncome,
      otherIncomeSources: formData.otherIncomeSources,
      monthlyExpenses: formData.monthlyExpenses,
    },
  })

  const addLoan = () => {
    setExistingLoans([...existingLoans, { institution: '', amount: 0 }])
  }

  const removeLoan = (index: number) => {
    setExistingLoans(existingLoans.filter((_, i) => i !== index))
  }

  const updateLoan = (index: number, field: 'institution' | 'amount', value: string | number) => {
    const updated = [...existingLoans]
    updated[index] = { ...updated[index], [field]: value }
    setExistingLoans(updated)
  }

  const addAsset = () => {
    setAssets([...assets, { type: '', value: 0 }])
  }

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index))
  }

  const updateAsset = (index: number, field: 'type' | 'value', value: string | number) => {
    const updated = [...assets]
    updated[index] = { ...updated[index], [field]: value }
    setAssets(updated)
  }

  const onSubmit = (data: FinancialFormData) => {
    updateFormData({
      ...data,
      existingLoans,
      assets,
    })
    markStepComplete(9)
    toast.success('Financial information saved!')
    setCurrentStep(10)
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Monthly Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Monthly Income (₱) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('monthlyIncome', { valueAsNumber: true })}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            placeholder="25000"
          />
          {errors.monthlyIncome && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.monthlyIncome.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Include all sources of regular income
          </p>
        </div>

        {/* Other Income Sources */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Income Sources <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea
            {...register('otherIncomeSources')}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out resize-none"
            placeholder="e.g., Part-time work, rental income, remittances"
          />
        </div>

        {/* Monthly Expenses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Household Expenses (₱) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('monthlyExpenses', { valueAsNumber: true })}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
            placeholder="15000"
          />
          {errors.monthlyExpenses && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.monthlyExpenses.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Include rent, utilities, food, transportation, etc.
          </p>
        </div>

        {/* Existing Loans */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Existing Loans <span className="text-gray-500">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={addLoan}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out"
            >
              <Plus className="w-4 h-4" />
              Add Loan
            </button>
          </div>
          
          {existingLoans.length > 0 ? (
            <div className="space-y-3">
              {existingLoans.map((loan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={loan.institution}
                    onChange={(e) => updateLoan(index, 'institution', e.target.value)}
                    placeholder="Lending institution"
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
                  />
                  <input
                    type="number"
                    value={loan.amount || ''}
                    onChange={(e) => updateLoan(index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Amount"
                    min="0"
                    className="w-32 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
                  />
                  <button
                    type="button"
                    onClick={() => removeLoan(index)}
                    className="px-3 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300 ease-in-out"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center">
              <p className="text-sm text-gray-500">No existing loans added</p>
            </div>
          )}
        </div>

        {/* Assets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Assets <span className="text-gray-500">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={addAsset}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          </div>
          
          {assets.length > 0 ? (
            <div className="space-y-3">
              {assets.map((asset, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={asset.type}
                    onChange={(e) => updateAsset(index, 'type', e.target.value)}
                    placeholder="Asset type (e.g., House, Motorcycle)"
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
                  />
                  <input
                    type="number"
                    value={asset.value || ''}
                    onChange={(e) => updateAsset(index, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="Value"
                    min="0"
                    className="w-32 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ease-in-out"
                  />
                  <button
                    type="button"
                    onClick={() => removeAsset(index)}
                    className="px-3 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300 ease-in-out"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center">
              <p className="text-sm text-gray-500">No assets added</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Why we need this:</strong> Financial information helps us determine your loan repayment capacity and set appropriate loan terms.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(8)}
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
