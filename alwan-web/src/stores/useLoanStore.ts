/**
 * Zustand store for loan application wizard
 * Persists form state to localStorage to prevent data loss on refresh
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LoanFormData {
    // Step 1: Borrower Selection
    centerId?: string
    memberId?: string

    // Step 2: Loan Details
    loanType?: 'kabalikat' | 'maunlad' | 'masagana' | 'k_flex' | 'k_agapay' | 'k_silong'
    principalAmount?: number
    termWeeks?: number
    purpose?: string
    interestRate?: number

    // Step 3: Business Evaluation
    businessViabilityScore?: number
    repaymentCapacityScore?: number
    characterScore?: number
    overallScore?: number
    evaluationNotes?: string
    riskAssessment?: string
    photoUrls?: string[]

    // Calculated fields (auto-populated)
    totalInterest?: number
    cbuAmount?: number
    totalAmount?: number
    weeklyPayment?: number
}

interface LoanStoreState {
    // Current form data
    formData: LoanFormData

    // Current step (1-4)
    currentStep: number

    // Validation state
    isStepValid: Record<number, boolean>

    // Actions
    setFormData: (data: Partial<LoanFormData>) => void
    resetForm: () => void
    setCurrentStep: (step: number) => void
    setStepValid: (step: number, isValid: boolean) => void
    nextStep: () => void
    previousStep: () => void
}

const initialFormData: LoanFormData = {}

export const useLoanStore = create<LoanStoreState>()(
    persist(
        (set, get) => ({
            formData: initialFormData,
            currentStep: 1,
            isStepValid: {
                1: false,
                2: false,
                3: false,
                4: false
            },

            setFormData: (data) => set((state) => ({
                formData: { ...state.formData, ...data }
            })),

            resetForm: () => set({
                formData: initialFormData,
                currentStep: 1,
                isStepValid: {
                    1: false,
                    2: false,
                    3: false,
                    4: false
                }
            }),

            setCurrentStep: (step) => set({ currentStep: step }),

            setStepValid: (step, isValid) => set((state) => ({
                isStepValid: { ...state.isStepValid, [step]: isValid }
            })),

            nextStep: () => set((state) => ({
                currentStep: Math.min(state.currentStep + 1, 4)
            })),

            previousStep: () => set((state) => ({
                currentStep: Math.max(state.currentStep - 1, 1)
            }))
        }),
        {
            name: 'kmbi-loan-application',
            partialize: (state) => ({
                formData: state.formData,
                currentStep: state.currentStep
            })
        }
    )
)
