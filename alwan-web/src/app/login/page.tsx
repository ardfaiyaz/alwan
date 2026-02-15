'use client'

/**
 * Login - Split layout: left branded panel (Alwan), right white card with form.
 * Billease-inspired, modern styling with password toggle and dual CTAs.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { loginSchema } from '@/lib/validations/auth'
import { MagneticButton } from '@/components/MagneticButton'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

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

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = password.length >= 8

  return (
    <div className="min-h-screen flex">
      {/* Left: branded panel - dark blue with subtle pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#009245] to-[#005a2b]">
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4dd88f] rounded-full blur-[100px] opacity-40"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#005a2b] rounded-full blur-[80px] opacity-60"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl mb-8">
            <img src="/icons/alwan-logo-colored.png" alt="Alwan Logo" className="w-48 h-auto" />
          </div>
          <p className="text-white/90 text-xl font-medium max-w-xs">
            Your financial partner for a brighter future.
          </p>
        </div>
      </motion.div>

      {/* Right: white area with floating card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:py-16 bg-slate-50 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 lg:top-8 lg:left-8 inline-flex items-center gap-2 text-slate-500 hover:text-[#009245] transition-colors text-sm font-medium z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Website
        </Link>
        <div className="lg:hidden mb-8">
          <img src="/icons/alwan-logo-colored.png" alt="Alwan Logo" className="w-32 h-auto" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-[420px]"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 overflow-hidden ring-1 ring-slate-900/5">
            <div className="pt-10 pb-2 px-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">Back</span>
              </h1>
              <p className="text-slate-500 mt-2 text-sm">Sign in to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5 pl-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#009245] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#009245] focus:ring-4 focus:ring-[#009245]/10 outline-none transition-all duration-200"
                    placeholder="you@example.com"
                  />
                  <AnimatePresence>
                    {isEmailValid && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, x: 10 }}
                        className="absolute inset-y-0 right-3 flex items-center pr-1 text-emerald-500"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5 pl-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#009245] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-20 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#009245] focus:ring-4 focus:ring-[#009245]/10 outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute right-0 inset-y-0 flex items-center gap-1 pr-3">
                    <AnimatePresence>
                      {isPasswordValid && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, x: 10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.5, x: 10 }}
                          className="text-emerald-500"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Link href="/register" className="flex-1">
                  <MagneticButton type="button" className="w-full py-3.5 font-semibold rounded-xl border-2 border-[#009245] text-[#009245] hover:bg-emerald-50 transition-colors">
                    Sign up
                  </MagneticButton>
                </Link>
                <MagneticButton
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 font-semibold rounded-xl bg-[#009245] text-white hover:bg-[#007a3d] transition-colors disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Log in'}
                </MagneticButton>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm pt-1">
                <Link href="#" className="text-[#009245] hover:underline">Live chat</Link>
                <Link href="#" className="text-[#009245] font-medium hover:underline">Forgot password?</Link>
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

