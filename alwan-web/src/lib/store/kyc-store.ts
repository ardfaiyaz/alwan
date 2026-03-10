import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface KYCFormData {
  // Step 1: Mobile & OTP
  mobileNumber: string
  otpVerified: boolean
  userId: string
  
  // Step 2: PIN
  pin: string
  
  // Step 3: Personal Information
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | ''
  civilStatus: 'single' | 'married' | 'widowed' | 'separated' | 'divorced' | ''
  nationality: string
  mothersMaidenName: string
  numberOfDependents: number
  
  // Step 4: Contact Information
  email: string
  alternatePhone: string
  
  // Step 5: Address Information
  houseNumber: string
  street: string
  barangay: string
  city: string
  province: string
  zipCode: string
  yearsLiving: number
  housingType: 'owned' | 'renting' | 'living_with_family' | ''
  
  // Step 6: Identity Verification
  idType: 'national_id' | 'drivers_license' | 'passport' | 'umid' | 'philhealth' | ''
  idNumber: string
  idFrontFile: File | null
  idBackFile: File | null
  selfieFile: File | null
  faceMatchScore: number
  
  // Step 7: Business Information
  businessName: string
  businessType: string
  businessAddress: string
  yearsOperating: number
  registrationType: 'dti' | 'barangay_permit' | 'sec' | 'none' | ''
  registrationNumber: string
  dailySales: number
  monthlyRevenue: number
  numberOfEmployees: number
  
  // Step 8: Financial Information
  monthlyIncome: number
  otherIncomeSources: string
  monthlyExpenses: number
  existingLoans: Array<{ institution: string; amount: number }>
  assets: Array<{ type: string; value: number }>
  
  // Step 9: Guarantor (Optional)
  guarantorFullName: string
  guarantorRelationship: string
  guarantorAddress: string
  guarantorPhone: string
  guarantorOccupation: string
  guarantorIdFile: File | null
  
  // Step 10: Documents
  utilityBillFile: File | null
  businessPermitFile: File | null
  
  // Step 11: Legal Consents
  termsAccepted: boolean
  privacyAccepted: boolean
  dataPrivacyAccepted: boolean
  creditInvestigationAccepted: boolean
}

interface KYCStore {
  currentStep: number
  formData: KYCFormData
  completedSteps: number[]
  
  setCurrentStep: (step: number) => void
  updateFormData: (data: Partial<KYCFormData>) => void
  markStepComplete: (step: number) => void
  resetForm: () => void
  canProceedToStep: (step: number) => boolean
}

const initialFormData: KYCFormData = {
  mobileNumber: '',
  otpVerified: false,
  userId: '',
  pin: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  civilStatus: '',
  nationality: 'Filipino',
  mothersMaidenName: '',
  numberOfDependents: 0,
  email: '',
  alternatePhone: '',
  houseNumber: '',
  street: '',
  barangay: '',
  city: '',
  province: '',
  zipCode: '',
  yearsLiving: 0,
  housingType: '',
  idType: '',
  idNumber: '',
  idFrontFile: null,
  idBackFile: null,
  selfieFile: null,
  faceMatchScore: 0,
  businessName: '',
  businessType: '',
  businessAddress: '',
  yearsOperating: 0,
  registrationType: '',
  registrationNumber: '',
  dailySales: 0,
  monthlyRevenue: 0,
  numberOfEmployees: 0,
  monthlyIncome: 0,
  otherIncomeSources: '',
  monthlyExpenses: 0,
  existingLoans: [],
  assets: [],
  guarantorFullName: '',
  guarantorRelationship: '',
  guarantorAddress: '',
  guarantorPhone: '',
  guarantorOccupation: '',
  guarantorIdFile: null,
  utilityBillFile: null,
  businessPermitFile: null,
  termsAccepted: false,
  privacyAccepted: false,
  dataPrivacyAccepted: false,
  creditInvestigationAccepted: false,
}

export const useKYCStore = create<KYCStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: initialFormData,
      completedSteps: [],
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateFormData: (data) => 
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      
      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step].sort((a, b) => a - b)
        })),
      
      resetForm: () =>
        set({
          currentStep: 1,
          formData: initialFormData,
          completedSteps: []
        }),
      
      canProceedToStep: (step) => {
        const { completedSteps } = get()
        // Can proceed if previous step is completed
        return step === 1 || completedSteps.includes(step - 1)
      }
    }),
    {
      name: 'kyc-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: {
          ...state.formData,
          // Don't persist File objects
          idFrontFile: null,
          idBackFile: null,
          selfieFile: null,
          guarantorIdFile: null,
          utilityBillFile: null,
          businessPermitFile: null,
        },
        completedSteps: state.completedSteps,
      }),
    }
  )
)
