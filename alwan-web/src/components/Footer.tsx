'use client'

/**
 * Footer - Reusable site footer with product/company/legal links and auth CTA.
 * White background; consistent teal/violet accent colors.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/MagneticButton'

const footerLinks = {
  product: [
    { href: '/services', label: 'Services' },
    { href: '/faq', label: 'FAQ' },
    { href: '#', label: 'Calculator' },
    { href: '#', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/data-protection', label: 'Data Protection' },
  ],
}

export default function Footer() {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/register') return null

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2"
          >
            <Link href="/" className="inline-flex items-center mb-4">
              <Image src="/icons/alwan-footer-logo.png" alt="Alwan" width={120} height={32} className="h-6 w-auto" />
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              Empowering Filipinos with accessible microfinance solutions. Your dreams, within reach.
            </p>
            <p className="mt-4 text-sm font-medium text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4dd88f 0%, #009245 60%)' }}>
              Proudly Philippine-based
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Alwan. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login">
              <MagneticButton className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Log In
              </MagneticButton>
            </Link>
            <Link href="/register">
              <MagneticButton className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4dd88f] via-[#009245] to-[#007a3d] hover:opacity-90 rounded-lg transition-opacity cursor-pointer">
                Get Started
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
