import { z } from 'zod'

// Step 1: Mobile Number
export const mobileSchema = z.object({
  mobileNumber: z.string()
    .min(10, 'Mobile number must be 10 digits')
    .max(10, 'Mobile number must be 10 digits')
    .regex(/^9\d{9}$/, 'Mobile number must start with 9'),
})

// Step 2: PIN
export const pinSchema = z.object({
  pin: z.string()
    .length(5, 'PIN must be exactly 5 digits')
    .regex(/^\d+$/, 'PIN must contain only numbers'),
  confirmPin: z.string()
    .length(5, 'PIN must be exactly 5 digits'),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
})

// Step 3: Personal Information
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender is required',
  }),
  civilStatus: z.enum(['single', 'married', 'widowed', 'separated', 'divorced'], {
    message: 'Civil status is required',
  }),
  nationality: z.string().min(2, 'Nationality is required'),
  mothersMaidenName: z.string().optional(),
  numberOfDependents: z.number().min(0).max(20),
})

// Step 4: Contact Information
export const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  alternatePhone: z.string()
    .regex(/^(9\d{9})?$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
})

// Step 5: Address Information
export const addressSchema = z.object({
  houseNumber: z.string().min(1, 'House number is required'),
  street: z.string().min(2, 'Street is required'),
  barangay: z.string().min(2, 'Barangay is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  zipCode: z.string()
    .length(4, 'Zip code must be 4 digits')
    .regex(/^\d+$/, 'Zip code must contain only numbers'),
  yearsLiving: z.number().min(0).max(100),
  housingType: z.enum(['owned', 'renting', 'living_with_family'], {
    message: 'Housing type is required',
  }),
})

// Step 6: Identity Verification
export const identitySchema = z.object({
  idType: z.enum(['national_id', 'drivers_license', 'passport', 'umid', 'philhealth'], {
    message: 'ID type is required',
  }),
  idNumber: z.string().min(5, 'ID number is required'),
})

// Step 7: Business Information
export const businessSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(2, 'Business type is required'),
  businessAddress: z.string().min(5, 'Business address is required'),
  yearsOperating: z.number().min(0).max(100),
  registrationType: z.enum(['dti', 'barangay_permit', 'sec', 'none'], {
    message: 'Registration type is required',
  }),
  registrationNumber: z.string().optional(),
  dailySales: z.number().min(0),
  monthlyRevenue: z.number().min(0),
  numberOfEmployees: z.number().min(0).max(1000),
})

// Step 8: Financial Information
export const financialSchema = z.object({
  monthlyIncome: z.number().min(0, 'Monthly income is required'),
  otherIncomeSources: z.string().optional(),
  monthlyExpenses: z.number().min(0, 'Monthly expenses is required'),
})

// Step 9: Guarantor (Optional - all fields optional)
export const guarantorSchema = z.object({
  guarantorFullName: z.string().optional(),
  guarantorRelationship: z.string().optional(),
  guarantorAddress: z.string().optional(),
  guarantorPhone: z.string().optional(),
  guarantorOccupation: z.string().optional(),
})

// Step 11: Legal Consents
export const legalConsentsSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms and Conditions',
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Privacy Policy',
  }),
  dataPrivacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Data Privacy Consent',
  }),
  creditInvestigationAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Credit Investigation Authorization',
  }),
})

export type MobileFormData = z.infer<typeof mobileSchema>
export type PinFormData = z.infer<typeof pinSchema>
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type IdentityFormData = z.infer<typeof identitySchema>
export type BusinessFormData = z.infer<typeof businessSchema>
export type FinancialFormData = z.infer<typeof financialSchema>
export type GuarantorFormData = z.infer<typeof guarantorSchema>
export type LegalConsentsFormData = z.infer<typeof legalConsentsSchema>
