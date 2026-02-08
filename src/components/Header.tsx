'use client'

/**
 * Header - Logo left, nav center, auth right. Sliding gradient underline on active link.
 */

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MagneticButton } from '@/components/MagneticButton'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(progress)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setIsLoading(false)
      return
    }
    createClient().auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await createClient().auth.signOut()
      }
    } catch {
      // Supabase not configured
    }
    setUser(null)
    router.refresh()
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      {/* Gradient scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-0.5 rounded-r-full bg-gradient-to-r from-teal-500 to-violet-600 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: logo + name */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.svg" alt="Alwan" width={32} height={32} />
            <span className="text-xl font-bold text-slate-900">Alwan</span>
          </Link>

          {/* Center: nav links with sliding underline */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 font-medium transition-colors ${
                  pathname === link.href ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-teal-500 to-violet-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right: auth buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 truncate max-w-[120px]">{user.email}</span>
                    <MagneticButton
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Sign Out
                    </MagneticButton>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <MagneticButton className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors">
                        Log In
                      </MagneticButton>
                    </Link>
                    <Link href="/register">
                      <MagneticButton className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-violet-600 hover:opacity-90 rounded-lg transition-opacity">
                        Get Started
                      </MagneticButton>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-slate-700 mb-1.5 rounded" />
            <span className="block w-6 h-0.5 bg-slate-700 mb-1.5 rounded" />
            <span className="block w-6 h-0.5 bg-slate-700 rounded" />
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-4 rounded-lg font-medium ${
                      pathname === link.href
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex flex-col gap-2 pt-4 px-4">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <button type="button" className="w-full py-2.5 text-center font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer">
                        Log In
                      </button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <button type="button" className="w-full py-2.5 text-center font-medium text-white bg-gradient-to-r from-teal-500 to-violet-600 rounded-lg cursor-pointer">
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
                {user && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-2.5 mt-2 mx-4 text-center font-medium text-slate-600 bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
