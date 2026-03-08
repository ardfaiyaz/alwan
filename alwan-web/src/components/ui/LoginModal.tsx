'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { logUserLogin } from '@/app/actions/auth-logging'
import { useAuthStore } from '@/stores/useAuthStore'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const { setUser } = useAuthStore()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!supabase) {
            toast.error('Supabase is not configured. Check your environment variables.')
            return
        }
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            if (data.user) {
                // Fetch user profile to check role
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single()

                if (profileError) {
                    console.error('Error fetching profile:', profileError.message, profileError.details)
                    toast.error('User profile not found. Please contact an administrator.')
                    // Fallback to home if profile fails
                    router.push('/')
                } else {
                    toast.success('Successfully logged in!')
                    await logUserLogin(data.user.email || 'unknown')

                    // Update auth store
                    const userProfile = {
                        id: profile.id,
                        email: profile.email,
                        fullName: profile.full_name,
                        role: profile.role,
                        branchId: profile.branch_id,
                        areaId: profile.area_id,
                        phone: profile.phone,
                        isActive: profile.is_active
                    }
                    setUser(userProfile)

                    // Redirect based on role
                    const isAdminOrStaff = ['admin', 'field_officer', 'branch_manager', 'area_manager'].includes(profile.role)

                    onClose()
                    router.refresh()

                    if (isAdminOrStaff) {
                        router.push('/admin')
                    } else {
                        router.push('/')
                    }
                }
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative w-full max-w-sm sm:max-w-md pointer-events-auto mx-4"
                        >
                            {/* Glass Modal Content */}
                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
                                style={{
                                    background: 'rgba(20, 20, 20, 0.65)',
                                    backdropFilter: 'blur(24px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="p-6 sm:p-8 pt-10 sm:pt-12">
                                    <div className="flex flex-col items-center mb-6">
                                        <Image
                                            src="/icons/alwan-logo-white.png"
                                            alt="Alwan Logo"
                                            width={120}
                                            height={40}
                                            className="h-8 w-auto mb-6"
                                        />
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">Welcome Back</h2>
                                            <p className="text-sm text-gray-300">
                                                Enter your credentials to access your account.
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-4 mb-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-300 ml-1">Email</label>
                                            <input
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 focus:ring-0 transition-all text-sm"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-xs font-medium text-gray-300">Password</label>
                                                <button type="button" className="text-xs text-white/70 hover:text-white transition-colors">Forgot Password?</button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 focus:ring-0 transition-all text-sm pr-10"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Login Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="btn-login-modal w-full mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                                                    <span>Logging In...</span>
                                                </div>
                                            ) : (
                                                'Log In'
                                            )}
                                        </button>
                                    </form>


                                    <div className="relative flex items-center gap-4 py-2 mb-4">
                                        <div className="flex-grow h-px bg-white/10"></div>
                                        <span className="text-xs text-white font-medium uppercase">or</span>
                                        <div className="flex-grow h-px bg-white/10"></div>
                                    </div>

                                    {/* Get Started Button */}
                                    <a href="/register" className="btn-signup-modal w-full flex justify-center items-center">
                                        Get Started
                                    </a>

                                    <style jsx>{`
                    .btn-login-modal {
                      position: relative;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      padding: 0.8rem 1.1rem;
                      font-size: 0.95rem;
                      font-weight: 600;
                      color: #000;
                      border-radius: 999px;
                      cursor: pointer;
                      background: rgba(255, 255, 255, 0.9);
                      border: 1.5px solid rgba(255, 255, 255, 1);
                      backdrop-filter: blur(12px);
                      -webkit-backdrop-filter: blur(12px);
                      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                      overflow: hidden;
                      min-height: 48px;
                    }
                    .btn-login-modal::after {
                      content: "";
                      position: absolute;
                      top: 0;
                      left: -100%;
                      width: 50%;
                      height: 100%;
                      background: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.6) 50%,
                        rgba(255, 255, 255, 0) 100%
                      );
                      transform: skewX(-25deg);
                      transition: none;
                    }
                    .btn-login-modal:hover::after {
                      left: 150%;
                      transition: left 0.7s ease-in-out;
                    }
                    .btn-login-modal:hover {
                      background: #ffffff;
                      transform: translateY(-2px);
                      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                    }
                    .btn-signup-modal {
                      position: relative;
                      padding: 0.8rem 1.1rem;
                      font-size: 0.95rem;
                      font-weight: 600;
                      color: #fff;
                      border-radius: 999px;
                      cursor: pointer;
                      background: rgba(255, 255, 255, 0.1);
                      border: 1.5px solid rgba(255, 255, 255, 0.2);
                      backdrop-filter: blur(12px);
                       -webkit-backdrop-filter: blur(12px);
                      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .btn-signup-modal:hover {
                      background: rgba(255, 255, 255, 0.2);
                      border-color: rgba(255, 255, 255, 0.4);
                      transform: translateY(-2px);
                    }
                   `}</style>

                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
