'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Users } from 'lucide-react'

export function RightOverlayCard() {
  const amount = useMotionValue(0)

  const formattedAmount = useTransform(amount, (value) =>
    Math.floor(value).toLocaleString()
  )

  useEffect(() => {
    let interval: NodeJS.Timeout

    // scrambling phase
    interval = setInterval(() => {
      amount.set(Math.random() * 3000 + 1000)
    }, 80)

    const timeout = setTimeout(() => {
      clearInterval(interval)

      // snap close to final value
      amount.set(3500 + Math.random() * 80)

      // tiny smooth lock-in
      animate(amount, 3590, {
        duration: 1,
        ease: 'easeInOut',
      })
    }, 4800)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      className="relative lg:rotate-[8deg] lg:hover:rotate-[8deg]"
    >
      {/* Card */}
      <div className="bg-white backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-2xl border border-violet-100 w-32 sm:w-36 lg:w-44">
        {/* Content */}
        <div className="space-y-1.5 sm:space-y-2">
          {/* Icon */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-[#F3E8FF] flex items-center justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full border-2 border-violet-500 flex items-center justify-center">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-violet-500" />
            </div>
          </div>

          {/* Stats */}
          <div className="gap-2 sm:gap-3 text-left">
            <motion.span className="text-base sm:text-xl lg:text-2xl font-bold">
              {formattedAmount}
            </motion.span>
            <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 mt-1 lg:mt-2">
              Total Members
            </p>
          </div>
        </div>

        {/* Floating particles */}
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-violet-400 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, -6, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className="absolute -bottom-0.5 -left-0.5 sm:-bottom-1 sm:-left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full blur-sm"
        />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-xl sm:rounded-2xl blur-xl -z-10" />
    </motion.div>
  )
}
