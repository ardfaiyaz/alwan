'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { DollarSign, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react'
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
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
          <DollarSign className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Financial Information
        </h3>
        <p className="text-white/70">
          Help us understand your financial situation
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Monthly Income */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Average Monthly Income (₱) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            {...register('monthlyIncome', { valueAsNumber: true })}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="25000"
          />
          {errors.monthlyIncome && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.monthlyIncome.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-white/50">
            Include all sources of regular income
          </p>
        </div>

        {/* Other Income Sources */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Other Income Sources <span className="text-white/50">(Optional)</span>
          </label>
          <textarea
            {...register('otherIncomeSources')}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all resize-none"
            placeholder="e.g., Part-time work, rental income, remittances"
          />
        </div>

        {/* Monthly Expenses */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Monthly Household Expenses (₱) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            {...register('monthlyExpenses', { valueAsNumber: true })}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
            placeholder="15000"
          />
          {errors.monthlyExpenses && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.monthlyExpenses.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-white/50">
            Include rent, utilities, food, transportation, etc.
          </p>
        </div>

        {/* Existing Loans */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-white/90">
              Existing Loans <span className="text-white/50">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={addLoan}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium rounded-lg transition-all"
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
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  />
                  <input
                    type="number"
                    value={loan.amount || ''}
                    onChange={(e) => updateLoan(index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Amount"
                    min="0"
                    className="w-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeLoan(index)}
                    className="px-3 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 bg-white/5 border border-dashed border-white/10 rounded-xl text-center">
              <p className="text-sm text-white/50">No existing loans added</p>
            </div>
          )}
        </div>

        {/* Assets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-white/90">
              Assets <span className="text-white/50">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={addAsset}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium rounded-lg transition-all"
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
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  />
                  <input
                    type="number"
                    value={asset.value || ''}
                    onChange={(e) => updateAsset(index, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="Value"
                    min="0"
                    className="w-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeAsset(index)}
                    className="px-3 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 bg-white/5 border border-dashed border-white/10 rounded-xl text-center">
              <p className="text-sm text-white/50">No assets added</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            <strong>Why we need this:</strong> Financial information helps us determine your loan repayment capacity and set appropriate loan terms.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(8)}
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
