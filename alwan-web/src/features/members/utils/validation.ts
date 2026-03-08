/**
 * Member Feature - Validation Schemas
 * @module features/members/utils
 */

import { z } from 'zod'

export const memberSchema = z.object({
  centerId: z.string().uuid('Invalid center ID'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional().nullable(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  phone: z.string().optional().nullable(),
  address: z.string().min(1, 'Address is required'),
  businessName: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
  businessAddress: z.string().optional().nullable(),
  spouseName: z.string().optional().nullable(),
  beneficiaryName: z.string().optional().nullable(),
  beneficiaryRelationship: z.string().optional().nullable(),
  beneficiaryPhone: z.string().optional().nullable(),
})

export type MemberSchemaType = z.infer<typeof memberSchema>
