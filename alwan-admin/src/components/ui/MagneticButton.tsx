'use client'

/**
 * MagneticButton / MagneticLink - Framer Motion hover/tap animations. Use className for styling (no style prop).
 */

import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

export function MagneticButton({ children, className = '', type, disabled, onClick }: MagneticButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  )
}

interface MagneticLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function MagneticLink({ href, children, className = '' }: MagneticLinkProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`cursor-pointer inline-block ${className}`}
    >
      {children}
    </motion.a>
  )
}
