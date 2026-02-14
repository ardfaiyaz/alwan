'use client'

/**
 * Mobile CTA - Gradient section with official Play Store / App Store badges, phone mockup.
 * No white card; badges from Wikipedia. Responsive, with entrance and loop animations.
 */

import Link from 'next/link'
import { motion } from 'framer-motion'

const GOOGLE_PLAY_BADGE = 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
const APP_STORE_BADGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/330px-Download_on_the_App_Store_Badge.svg.png'

export default function MobileCTA() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-violet-800 to-purple-600" />
      <div className="absolute inset-0 mobile-cta-mesh" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* Left: headline, description, badge links (no white background) */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 max-w-xl text-white text-center lg:text-left pl-0 lg:pl-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
            Naghahanap ka ba ng best-in-class na lending app? Sagot ka ni Alwan!
          </h2>
          <p className="text-base sm:text-lg text-white/95 mb-6 sm:mb-8">
            Quick approvals, flexible terms, and easy financial management. Download the Alwan app now!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start items-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="w-full sm:w-auto shadow-4xl ">
              <Link href="#" className="inline-block w-full sm:w-auto max-w-[200px] sm:max-w-[180px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg overflow-hidden" aria-label="Get it on Google Play">
                <img
                  src={GOOGLE_PLAY_BADGE}
                  alt="Get it on Google Play"
                  className="w-full h-auto object-contain"
                  width={180}
                  height={53}
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="w-full sm:w-auto shadow-4xl ">
              <Link href="#" className="inline-block w-full sm:w-auto max-w-[200px] sm:max-w-[180px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg overflow-hidden" aria-label="Get it on Google Play">
                <img
                  src={APP_STORE_BADGE}
                  alt="Get it on Google Play"
                  className="w-full h-auto object-contain"
                  width={180}
                  height={53}
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right: phone mockup with loop animation - responsive size */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative shrink-0 w-48 sm:w-52 lg:w-56"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="relative w-full aspect-[56/480] max-h-[420px] lg:max-h-[480px] bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-slate-700 overflow-hidden shadow-2xl">
            <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-5 sm:h-7 bg-slate-900 rounded-full z-10" />
            <div className="bg-white h-full pt-10 sm:pt-12 pb-4 sm:pb-6 px-2 sm:px-3 flex flex-col">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-violet-600 font-bold text-xs sm:text-sm">Alwan</span>
                <div className="flex gap-0.5 sm:gap-1">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-slate-300" />
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-slate-300" />
                </div>
              </div>
              <div className="bg-violet-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-violet-100 mb-3 sm:mb-4">
                <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Highest available</p>
                <p className="text-lg sm:text-2xl font-bold text-violet-800">₱50,000</p>
                <div className="flex gap-2 sm:gap-3 mt-1 sm:mt-2 text-[10px] sm:text-xs text-slate-600">
                  <span>As low as 0.26%/day</span>
                  <span>Term 90 days</span>
                </div>
                <div className="mt-2 sm:mt-3 py-2 sm:py-2.5 bg-gradient-to-r from-teal-500 to-violet-600 text-white text-center font-medium rounded-lg sm:rounded-xl text-xs sm:text-sm">
                  Borrow Now
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4">
                <p className="text-[10px] sm:text-xs font-medium text-slate-700 mb-1 sm:mb-2">Borrowing Process</p>
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                  <span>Apply</span>
                  <span>Submit</span>
                  <span>Get Funds</span>
                </div>
              </div>
              <div className="mt-auto flex justify-around py-1.5 sm:py-2 border-t border-slate-100">
                <span className="text-[10px] sm:text-xs font-medium text-violet-600">Home</span>
                <span className="text-[10px] sm:text-xs text-slate-400">Bill</span>
                <span className="text-[10px] sm:text-xs text-slate-400">Me</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
