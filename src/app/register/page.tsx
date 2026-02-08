'use client'

/**
 * Register / Sign up page - No form. Encourages users to download the app and sign up there.
 * Shows steps: 1) Download app, 2) Open and create account or log in. Single section with mockup.
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import TypingAnimation from '@/components/TypingAnimation'
import { MagneticButton } from '@/components/MagneticButton'

const steps = [
  { num: '1', title: 'Download the Alwan app', desc: 'Get it on the App Store or Google Play.' },
  { num: '2', title: 'Open and sign up or log in', desc: 'Create your account or sign in right inside the app.' },
]

export default function RegisterPage() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center py-12 lg:py-16 px-4 sm:px-6 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left: title with typing, steps, download CTA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full max-w-lg font-sans"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            <TypingAnimation variant="register" />
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            Sign up and manage your finances in the Alwan app. Download once, then create your account or log in there.
          </p>

          <div className="space-y-6 mb-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-semibold flex items-center justify-center text-lg">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 text-sm mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="#" className="w-full sm:flex-1">
              <MagneticButton className="w-full py-3.5 bg-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:bg-violet-700 transition-all font-sans">
                Download the app
              </MagneticButton>
            </Link>
            <Link href="/login" className="w-full sm:flex-1 flex items-center justify-center py-3.5 font-semibold rounded-xl border-2 border-slate-300 text-slate-700 hover:border-violet-500 hover:text-violet-600 transition-colors font-sans">
              I already have an account
            </Link>
          </div>
        </motion.div>

        {/* Right: mobile mockup with same loop animation as homepage */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative shrink-0"
        >
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="w-52 h-[420px] bg-slate-200 rounded-[1.75rem] border border-slate-300 overflow-hidden shadow-2xl">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-300 rounded-full" />
              <div className="pt-10 px-3 space-y-3">
                <div className="h-8 bg-white rounded-lg border border-slate-200" />
                <div className="h-10 bg-white rounded-lg border border-slate-200" />
                <div className="h-10 bg-white rounded-lg border border-slate-200" />
                <div className="h-10 bg-white rounded-lg border border-slate-200" />
                <div className="h-12 bg-violet-600 rounded-lg mt-6 shadow-lg shadow-violet-500/30 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold font-sans">Sign up in the app</span>
                </div>
                <p className="text-xs text-slate-500 text-center pt-2 font-sans">Alwan app</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
