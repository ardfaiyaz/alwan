/**
 * Zod schemas for login and register forms. Philippine mobile: 09 + 9 digits, 11 total.
 */
import { z } from 'zod'

export const philippineMobileSchema = z.string()
  .regex(/^09\d{9}$/, 'Mobile number must start with 09 and be 11 digits (e.g., 09171234567)')
  .length(11, 'Mobile number must be exactly 11 digits')

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  mobile: philippineMobileSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
