'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { logUserLogin } from '@/app/actions/auth-logging'
import { useAuthStore } from '@/stores/useAuthStore'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

// Simple toast function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (typeof window !== 'undefined') {
        alert(message) // Temporary solution until sonner is fixed
    }
}

export default function LoginPage() {
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
            showToast('Supabase is not configured. Check your environment variables.', 'error')
            return
        }
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                showToast(error.message, 'error')
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
                    showToast('User profile not found. Please contact an administrator.', 'error')
                    return
                }

                // Check if user has admin access
                const isAdminOrStaff = ['admin', 'field_officer', 'branch_manager', 'area_manager'].includes(profile.role)
                
                if (!isAdminOrStaff) {
                    showToast('Access denied. This portal is for staff members only.', 'error')
                    await supabase.auth.signOut()
                    return
                }

                showToast('Successfully logged in!', 'success')
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

                router.push('/admin/dashboard')
                router.refresh()
            }
        } catch (error) {
            showToast('An unexpected error occurred', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Green Gradient Background with Grainy Texture */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-[#009245] via-[#00a84f] to-[#4dd88f]"
                style={{
                    backgroundImage: `
                        url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")
                    `,
                    backgroundBlendMode: 'overlay'
                }}
            />

            {/* Animated Circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-white/10 rounded-full blur-3xl"
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div
                    className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
                    style={{
                        background: 'rgba(20, 20, 20, 0.65)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <div className="p-8 sm:p-10">
                        <div className="flex flex-col items-center mb-8">
                            <Image
                                src="/icons/alwan-logo-white.png"
                                alt="Alwan KMBI"
                                width={140}
                                height={45}
                                className="h-10 w-auto mb-6"
                                priority
                            />
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-sm">
                                    Admin Portal
                                </h1>
                                <p className="text-sm text-gray-300">
                                    Sign in to access the management dashboard
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-300 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="admin@alwan.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10 focus:ring-0 transition-all text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-300 ml-1">
                                    Password
                                </label>
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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-login w-full disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                                        <span>Signing In...</span>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400">
                                For staff members only. Unauthorized access is prohibited.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
                .btn-login {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.9rem 1.2rem;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #000;
                    border-radius: 999px;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.95);
                    border: 1.5px solid rgba(255, 255, 255, 1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    min-height: 52px;
                }
                .btn-login::after {
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
                .btn-login:hover::after {
                    left: 150%;
                    transition: left 0.7s ease-in-out;
                }
                .btn-login:hover {
                    background: #ffffff;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    )
}
