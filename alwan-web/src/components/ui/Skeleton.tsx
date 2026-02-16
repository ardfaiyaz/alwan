'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  borderRadius?: string | number
}

export const Skeleton = ({
  className = '',
  width,
  height,
  borderRadius = '0.75rem'
}: SkeletonProps) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200 ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '1rem',
        borderRadius
      }}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </div>
  )
}

export const SkeletonCircle = ({ size = '3rem', className = '' }: { size?: string | number, className?: string }) => {
  return <Skeleton width={size} height={size} borderRadius="50%" className={className} />
}
