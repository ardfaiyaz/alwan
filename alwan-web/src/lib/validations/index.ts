import { z } from 'zod'

/**
 * Validation schema for member collection in weekly collection sheet
 */
export const memberCollectionSchema = z.object({
    memberId: z.string().uuid('Invalid member ID'),
    loanId: z.string().uuid('Invalid loan ID').nullable(),
    isPresent: z.boolean(),
    actualLoanPayment: z
        .number()
        .min(0, 'Loan payment cannot be negative')
        .max(1000000, 'Loan payment exceeds maximum'),
    actualCBUPayment: z
        .number()
        .min(0, 'CBU payment cannot be negative')
        .max(100000, 'CBU payment exceeds maximum'),
    actualInsurancePayment: z
        .number()
        .min(0, 'Insurance payment cannot be negative')
        .max(1000, 'Insurance payment exceeds maximum'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
})

/**
 * Validation schema for weekly collection sheet
 */
export const weeklyCollectionSchema = z.object({
    centerId: z.string().uuid('Invalid center ID'),
    collectionDate: z
        .string()
        .refine(
            (date) => {
                const d = new Date(date)
                return d <= new Date() && !isNaN(d.getTime())
            },
            { message: 'Collection date cannot be in the future' }
        ),
    collections: z
        .array(memberCollectionSchema)
        .min(1, 'At least one member collection is required'),
})

/**
 * Validation schema for loan approval
 */
export const loanApprovalSchema = z.object({
    loanId: z.string().uuid('Invalid loan ID'),
    action: z.enum(['approve', 'reject', 'request_revision'] as const, {
        message: 'Invalid approval action',
    }),

    comments: z.string().max(1000, 'Comments cannot exceed 1000 characters').optional(),
})

/**
 * Validation schema for creating/updating a center
 */
export const centerSchema = z.object({
    name: z.string().min(1, 'Center name is required').max(255),
    code: z.string().min(1, 'Center code is required').max(50),
    branchId: z.string().uuid('Invalid branch ID'),
    fieldOfficerId: z.string().uuid('Invalid field officer ID').optional(),
    leaderName: z.string().max(255).optional(),
    meetingLocation: z.string().min(1, 'Meeting location is required'),
    meetingDay: z.enum([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]),
    meetingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    isActive: z.boolean().default(true),
})

/**
 * Validation schema for creating/updating a member
 */
export const memberSchema = z.object({
    centerId: z.string().uuid('Invalid center ID'),
    fullName: z.string().min(1, 'Full name is required').max(255),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    civilStatus: z.string().max(20).optional(),
    address: z.string().optional(),
    phone: z.string().max(20).optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    spouseName: z.string().max(255).optional(),
    beneficiaryName: z.string().max(255).optional(),
    beneficiaryRelationship: z.string().max(100).optional(),
    beneficiaryPhone: z.string().max(20).optional(),
    isActive: z.boolean().default(true),
})

/**
 * Validation schema for creating a loan
 */
export const loanSchema = z.object({
    memberId: z.string().uuid('Invalid member ID'),
    centerId: z.string().uuid('Invalid center ID'),
    loanType: z.enum([
        'kabalikat',
        'maunlad',
        'masagana',
        'k_flex',
        'k_agapay',
        'k_silong',
    ]),
    principalAmount: z
        .number()
        .min(1000, 'Minimum loan amount is ₱1,000')
        .max(500000, 'Maximum loan amount is ₱500,000'),
    termWeeks: z
        .number()
        .int()
        .min(4, 'Minimum term is 4 weeks')
        .max(104, 'Maximum term is 104 weeks'),
    purpose: z.string().min(10, 'Purpose must be at least 10 characters').max(1000),
    businessViabilityScore: z
        .number()
        .int()
        .min(1, 'Score must be between 1 and 10')
        .max(10, 'Score must be between 1 and 10')
        .optional(),
    repaymentCapacityScore: z
        .number()
        .int()
        .min(1, 'Score must be between 1 and 10')
        .max(10, 'Score must be between 1 and 10')
        .optional(),
    characterScore: z
        .number()
        .int()
        .min(1, 'Score must be between 1 and 10')
        .max(10, 'Score must be between 1 and 10')
        .optional(),
    overallScore: z
        .number()
        .int()
        .min(1, 'Score must be between 1 and 10')
        .max(10, 'Score must be between 1 and 10')
        .optional(),
    evaluationNotes: z.string().max(2000).optional(),
    riskAssessment: z.string().max(2000).optional(),
})

/**
 * Validation schema for user creation/update
 */
export const userSchema = z.object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(1, 'Full name is required').max(255),
    role: z.enum(['admin', 'area_manager', 'branch_manager', 'field_officer']),
    phone: z.string().max(20).optional(),
    areaId: z.string().uuid('Invalid area ID').optional(),
    branchId: z.string().uuid('Invalid branch ID').optional(),
    isActive: z.boolean().default(true),
})

/**
 * Validation schema for global settings
 */
export const globalSettingSchema = z.object({
    key: z.string().min(1, 'Setting key is required').max(100),
    value: z.any(), // Can be any JSON value
    description: z.string().max(500).optional(),
})

export type MemberCollectionInput = z.infer<typeof memberCollectionSchema>
export type WeeklyCollectionInput = z.infer<typeof weeklyCollectionSchema>
export type LoanApprovalInput = z.infer<typeof loanApprovalSchema>
export type CenterInput = z.infer<typeof centerSchema>
export type MemberInput = z.infer<typeof memberSchema>
export type LoanInput = z.infer<typeof loanSchema>
export type UserInput = z.infer<typeof userSchema>
export type GlobalSettingInput = z.infer<typeof globalSettingSchema>
