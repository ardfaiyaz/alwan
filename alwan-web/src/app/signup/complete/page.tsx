'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Home, FileText, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { noiseTextureStyle } from '@/lib/constants/styles'

export default function SignupCompletePage() {
  const router = useRouter()

  useEffect(() => {
    // Prevent back navigation
    window.history.pushState(null, '', window.location.href)
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href)
    }

    return () => {
      window.onpopstate = null
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - Same as signup page */}
      <div className="fixed inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06]">
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={noiseTextureStyle}
        />
        <div
          className="absolute right-0 top-0 h-full w-1/2 opacity-30"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 70% 40%, rgba(0,146,69,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute left-0 bottom-0 h-2/3 w-1/2 opacity-40"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(0,0,0,0.8) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 rounded-full mb-6"
            >
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Application Submitted!
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/70 mb-8"
            >
              Thank you for completing your KYC application. Our team will review your information and get back to you soon.
            </motion.p>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">Review Time</p>
                <p className="text-xs text-white/60">1-3 business days</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <FileText className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">Status Updates</p>
                <p className="text-xs text-white/60">Via SMS & Email</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">Next Steps</p>
                <p className="text-xs text-white/60">We'll contact you</p>
              </div>
            </motion.div>

            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8 text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Document Verification</p>
                    <p className="text-xs text-white/60 mt-1">
                      Our team will verify your submitted documents and identity
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Credit Assessment</p>
                    <p className="text-xs text-white/60 mt-1">
                      We'll evaluate your financial information and business details
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Approval Notification</p>
                    <p className="text-xs text-white/60 mt-1">
                      You'll receive an SMS and email with your application status
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Account Activation</p>
                    <p className="text-xs text-white/60 mt-1">
                      Once approved, you can start applying for loans
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => router.push('/')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <p className="text-sm text-white/60">
                Need help? Contact us at{' '}
                <a href="mailto:support@alwan.ph" className="text-emerald-400 hover:text-emerald-300">
                  support@alwan.ph
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
