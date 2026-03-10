import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useKYCStore } from '@/lib/store/kyc-store'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export default function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  const { completedSteps } = useKYCStore()
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step Info */}
      <div className="flex items-center justify-between text-white">
        <div>
          <p className="text-sm text-white/60 mb-1">Step {currentStep} of {totalSteps}</p>
          <h2 className="text-xl sm:text-2xl font-bold">{stepTitles[currentStep - 1]}</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {completedSteps.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                {completedSteps.length} completed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Completed Steps */}
      {completedSteps.length > 0 && (
        <div className="sm:hidden mt-3 flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full w-fit">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            {completedSteps.length} completed
          </span>
        </div>
      )}
    </div>
  )
}
