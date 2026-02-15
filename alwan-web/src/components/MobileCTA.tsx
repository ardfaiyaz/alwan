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
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="mx-4 sm:mx-6 lg:mx-8 relative rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06] pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
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

        <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
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

          {/* Right: phone image - responsive size */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative shrink-0 w-64 sm:w-72 lg:w-80"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="relative w-full flex justify-center">
              {/* Light glowing background effect */}
              <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-90 -z-10" />

              <img
                src="/images/mockups/phone.png"
                alt="Alwan App Interface"
                className="w-full h-auto drop-shadow-2xl relative z-10"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
