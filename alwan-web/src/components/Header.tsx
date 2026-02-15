'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Briefcase, Info, HelpCircle, X, Menu } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQs' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(progress)
      setScrolled(window.scrollY > 12)
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
    } catch { /* Supabase not configured */ }
    setUser(null)
    router.refresh()
    setIsMenuOpen(false)
  }

  if (pathname === '/login' || pathname === '/register') return null

  return (
    <>
      <style>{`
        /* ── Whole header bar — transparent, no background ── */
        .glass-nav {
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }

        /* ── Glass pill — wraps ONLY the nav links ── */
        .glass-nav-links {
          background: rgb(255, 255, 255, 0.6);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.42);
          border-radius: 999px;
          padding: 6px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.1),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.70),
            inset 0 -1px 0 rgba(255, 255, 255, 0.10);
        }
        /* ── Active pill — teal ── */
        /* ── Active pill — glass white with shadow ── */
        .nav-pill-active {
          background: rgba(255, 255, 255, 0.85);
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        /* ── Inactive nav link hover — frosted mini-pill ── */
        .nav-link-item {
          transition: background 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
        }
        .nav-link-item:not(.is-active):hover {
          background: rgba(255, 255, 255, 0.32);
          color: #0f172a;
          transform: translateY(-1px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.60),
            0 2px 10px rgba(0,0,0,0.2);
        }

        /* ── Log In — glass outline pill ── */
        .btn-login {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.48rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(10, 10, 10, 0.80);
          border-radius: 999px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.28);
          border: 1.5px solid rgba(255, 255, 255, 0.60);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.09),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.85);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
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
            rgba(255, 255, 255, 0.4) 50%,
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
          background: rgba(255, 255, 255, 0.50);
          color: #000;
          box-shadow:
            0 5px 18px rgba(0, 0, 0, 0.12),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
        }

        /* ── Get Started — glass pill with prominent white background ── */
        .btn-signup {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.48rem 1.2rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: rgba(10, 10, 10, 0.85);
          border-radius: 999px;
          cursor: pointer;
          background: rgba(255, 255, 255, 1);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.12),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.95);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-signup:hover {
          background: rgba(255, 255, 255, 0.85);
          box-shadow:
            0 5px 18px rgba(0, 0, 0, 0.16),
            inset 0 1.5px 0 rgba(255, 255, 255, 1);
          transform: translateY(-1px);
        }
        .btn-signup span { position: relative; z-index: 1; }

        /* ── Mobile menu ── */
        .mobile-glass-panel {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(30px) saturate(200%);
          -webkit-backdrop-filter: blur(30px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.60);
          box-shadow:
            0 20px 56px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
      `}</style>

      {/* Scroll progress */}
      <div
        className="fixed top-0 left-0 z-[60] h-[3px] pointer-events-none"
        style={{
          width: `${scrollProgress}%`,
          background: `
            linear-gradient(
              90deg,
              #ffffffff 0%,
              #ffffffff 35%,
              #ffffffff 70%,
              #ffffffff 100%
            )
          `,
          transition: 'width 0.15s ease-out',
        }}
      />

      {/* Header — floats above page with horizontal padding so it doesn't touch edges */}
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-6 pt-3">

        {/* Main nav bar */}
        <nav className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between h-[52px] px-2 sm:px-4 lg:px-6">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 md:flex-none flex-1 md:justify-start justify-center md:order-none order-2">
              <Image src="/icons/alwan-footer-logo.png" alt="Alwan" width={120} height={32} className="h-8 w-auto" priority />
            </Link>

            {/* Center nav links — glass wraps ONLY this pill */}
            <div className="hidden md:flex items-center gap-3 glass-nav-links ">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link-item relative px-4 py-[7px] rounded-full text-sm font-semibold select-none ${isActive ? 'text-neutral-900 is-active' : 'text-slate-700'
                      }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        initial={false}
                        className="absolute inset-0 rounded-full nav-pill-active"
                        transition={{ type: 'spring', stiffness: 440, damping: 36 }}
                      >

                        {/* top gloss streak */}
                        <span
                          className="absolute inset-x-2 top-[1px] h-[24%] rounded-full pointer-events-none"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0) 100%)',
                            filter: 'blur(1px)',
                          }}
                        />
                      </motion.span>
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-2 order-3">
              {user ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-slate-600 truncate max-w-[110px]">
                    {user.email}
                  </span>
                  <button onClick={handleSignOut} className="btn-login">Sign Out</button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <button className="btn-login">Log In</button>
                  </Link>
                  <Link href="/register">
                    <button className="btn-signup">
                      <span>Get Started</span>
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-white hover:bg-white/35 transition-colors cursor-pointer order-3"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5" /></motion.span>
                  : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5" /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.985 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden mobile-glass-panel max-w-[1600px] mx-auto mt-2 rounded-2xl"
            >
              <div className="px-3 pt-3 pb-4 space-y-0.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                        ? 'text-white nav-pill-active'
                        : 'text-slate-700 hover:bg-white/55 hover:text-slate-900'
                        }`}
                    >
                      {link.href === '/' && <Home className="w-4 h-4 shrink-0" />}
                      {link.href === '/services' && <Briefcase className="w-4 h-4 shrink-0" />}
                      {link.href === '/about' && <Info className="w-4 h-4 shrink-0" />}
                      {link.href === '/faq' && <HelpCircle className="w-4 h-4 shrink-0" />}
                      {link.label}
                    </Link>
                  )
                })}

                {/* Divider */}
                <div className="h-px bg-black/06 mx-1 my-1" />

                {/* Auth */}
                <div className="flex flex-col gap-2 px-1 pt-1">
                  {!user ? (
                    <>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <button type="button" className="btn-login w-full justify-center py-2.5">
                          Log In
                        </button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <button type="button" className="btn-signup w-full justify-center py-2.5">
                          <span>Get Started</span>
                        </button>
                      </Link>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="btn-login w-full justify-center py-2.5"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}