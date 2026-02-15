'use client'

/**
 * Login - Split layout: left branded panel (Alwan), right white card with form.
 * Billease-inspired, modern styling with password toggle and dual CTAs.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { loginSchema } from '@/lib/validations/auth'
import { MagneticButton } from '@/components/MagneticButton'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const firstError = result.error.flatten().fieldErrors
      const msg = firstError.email?.[0] || firstError.password?.[0] || 'Validation failed'
      toast.error(msg)
      setLoading(false)
      return
    }

    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left: branded panel - dark blue with subtle pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12"
        style={{
          background: 'radial-gradient(circle at center, #009245 0%, #005a2b 100%)'
        }}
      >
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-6xl font-bold tracking-tight text-white mb-6">
            Alwan
          </span>
          <p className="text-white/90 text-xl font-medium max-w-xs">
            Your financial partner for a brighter future.
          </p>
        </div>
      </motion.div>

      {/* Right: white area with floating card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-16 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-[420px]"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Card header */}
            <div className="pt-10 pb-2 px-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 mt-1 text-sm">Sign in to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up (outline) + Log In (solid) side by side */}
              <div className="flex gap-3 pt-1">
                <Link href="/register" className="flex-1">
                  <MagneticButton
                    type="button"
                    className="w-full py-3.5 font-semibold rounded-xl border-2 border-teal-500 text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                  >
                    Sign up
                  </MagneticButton>
                </Link>
                <MagneticButton
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {loading ? 'Signing in...' : 'Log in'}
                </MagneticButton>
              </div>

              {/* Links row */}
              <div className="flex items-center justify-center gap-4 text-sm pt-1">
                <Link href="#" className="text-teal-600 hover:underline">
                  Live chat
                </Link>
                <Link href="#" className="text-teal-600 font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
            </form>

            <p className="text-center text-xs text-slate-400 pb-6">
              Alwan © {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
