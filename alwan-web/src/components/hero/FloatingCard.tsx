'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FloatingCardProps {
  icon: LucideIcon
  title: string
  value: string
  trend?: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  delay?: number
}

const positionClasses = {
  'top-left': 'top-[15%] left-[5%] lg:left-[10%]',
  'top-right': 'top-[15%] right-[5%] lg:right-[10%]',
  'bottom-left': 'bottom-[20%] left-[5%] lg:left-[10%]',
  'bottom-right': 'bottom-[20%] right-[5%] lg:right-[10%]',
}

export function FloatingCard({ icon: Icon, title, value, trend, position, delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute ${positionClasses[position]} hidden lg:block`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm border border-gray-100 min-w-[200px]"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-xs text-emerald-600 font-medium mt-1">{trend}</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
