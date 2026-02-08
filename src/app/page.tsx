'use client'

/**
 * Homepage - Alwan Microfinance
 * Sections: Hero, Why Choose Alwan, See Alwan in Action (video), How it Works, Mobile CTA
 */

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/MagneticButton'

// Core value cards data for "Why Choose Alwan"
const coreValues = [
  {
    title: 'Accessible',
    description: 'We believe every Filipino deserves access to financial services. No complex requirements, no hidden fees—just straightforward solutions that work for you.',
    image: '/images/values-accessible.jpg',
  },
  {
    title: 'Transparent',
    description: 'Clear terms, honest rates, and full disclosure. We build trust through transparency in every transaction. What you see is what you get.',
    image: '/images/values-transparent.jpg',
  },
  {
    title: 'Community-First',
    description: 'Rooted in Philippine values of bayanihan. We grow together with our communities across the islands. Your success is our success.',
    image: '/images/values-community.jpg',
  },
]

// How it Works steps (3 steps with visual type)
const howItWorksSteps = [
  { num: '01', title: 'Fill Application', desc: 'Complete our quick online form in under 5 minutes', visual: 'speckled' as const },
  { num: '02', title: 'Get Approved', desc: 'Receive instant approval decision from our AI system', visual: 'speckled' as const },
  { num: '03', title: 'Receive Funds', desc: 'Money transferred directly to your account within hours', visual: 'gradient' as const },
]

// YouTube embed ID from link: youtu.be/pbXJBmTrE-U
const YOUTUBE_EMBED_ID = 'pbXJBmTrE-U'

export default function HomePage() {
  return (
    <>
      {/* ========== HERO: Gradient background, all content centered, image below buttons with border radius (half overlapping) ========== */}
      <section className="relative pt-6 pb-0 overflow-hidden">
        {/* Gradient background: violet-dominant */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800" />

        {/* Centered content: title, paragraph, buttons */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 py-16 lg:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Agarang Alwan para sa iyong pangarap!
            </h1>
            <p className="text-lg md:text-xl text-white/95 mb-10">
              Get instant access to funds with our quick and secure microfinance solutions. No hassle, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  Get started
                </MagneticButton>
              </Link>
              <Link href="#why-choose-alwan">
                <MagneticButton className="w-full sm:w-auto px-8 py-4 font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors cursor-pointer">
                  Learn more
                </MagneticButton>
              </Link>
            </div>
          </motion.div>

          {/* Image below buttons: half overlapping into next section, with border radius */}
          <div className="relative w-full max-w-6xl mx-auto mt-12 -mb-24 lg:-mb-32 z-20">
            <div className="relative w-full aspect-[27/10] rounded-4xl lg:rounded-6xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-family.png"
                alt="Family looking at smartphone - Alwan microfinance"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1704px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE ALWAN: Small title + main heading with gradient Alwan ========== */}
      <section id="why-choose-alwan" className="py-20 bg-[#FAFAFA] pt-12 lg:pt-20 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm font-medium uppercase tracking-wider mb-3 bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
              Why choose us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose <span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">Alwan</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col max-w-sm mx-auto md:max-w-none"
              >
                <div className="aspect-[4/3] bg-[#FAFAFA] flex items-center justify-center text-slate-500 text-sm">
                  Add image
                </div>
                <div className="p-4 flex-1 text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SEE ALWAN IN ACTION: Light lavender, SEE IT IN ACTION, Discover How Alwan Works ========== */}
      <section className="py-24 bg-[#f5f0ff]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium uppercase tracking-widest mb-4 text-violet-600">
              See it in action
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Discover How Alwan Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Watch how Alwan is transforming communities across the Philippines with accessible financial tools and microloans that uplift families.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden max-w-4xl mx-auto aspect-video shadow-xl border border-slate-200/50"
          >
            <iframe
              title="Alwan in Action - YouTube video"
              src={`https://www.youtube.com/embed/${YOUTUBE_EMBED_ID}?autoplay=0&controls=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ========== HOW IT WORKS: 3 steps with arrows ========== */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How it Works
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4">
            {howItWorksSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center"
              >
                <div className="flex flex-col items-center flex-1">
                  <span className="text-5xl md:text-6xl font-bold text-slate-300 -mb-4 relative z-10">
                    {step.num}
                  </span>
                  <div
                    className={`w-full max-w-[200px] aspect-square rounded-2xl border border-slate-200/80 shadow-sm ${
                      step.visual === 'gradient'
                        ? 'bg-gradient-to-br from-teal-400 to-amber-400'
                        : step.visual === 'speckled'
                          ? 'speckled-bg'
                          : 'bg-amber-100'
                    }`}
                  />
                  <h3 className="text-lg font-bold text-slate-900 mt-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 text-center max-w-[220px]">
                    {step.desc}
                  </p>
                </div>
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center px-2 py-8 self-center">
                    <span className="text-2xl text-slate-300">→</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/register">
              <MagneticButton className="px-6 py-3 bg-gradient-to-r from-teal-500 to-violet-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                Start Your Journey
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== AFFILIATED COMPANIES: Horizontal scrolling logos ========== */}
      <section className="py-16 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-slate-500 font-medium text-sm uppercase tracking-wider"
          >
            Companies affiliated with Alwan
          </motion.p>
        </div>
        <div className="relative w-full">
          <div className="flex logo-scroll-track w-max gap-16 px-8">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-16 shrink-0 items-center">
                {[
                  { name: 'Partner One', id: 1 },
                  { name: 'Partner Two', id: 2 },
                  { name: 'Partner Three', id: 3 },
                  { name: 'Partner Four', id: 4 },
                  { name: 'Partner Five', id: 5 },
                ].map((logo) => (
                  <div
                    key={`${setIndex}-${logo.id}`}
                    className="flex-shrink-0 w-32 h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium shadow-sm"
                    aria-hidden
                  >
                    {logo.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MOBILE CTA: Gradient mesh blend, store buttons with logo colors, phone mockup ========== */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        {/* Gradient mesh: blends into text area, no white blob */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-violet-800 to-purple-600" />
        <div className="absolute inset-0 mobile-cta-mesh" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left: headline, description, store buttons with brand colors */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 max-w-xl text-white pl-0 lg:pl-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Naghahanap ka ba ng best-in-class na lending app? Sagot ka ni Alwan!
            </h2>
            <p className="text-lg text-white/95 mb-8">
              Quick approvals, flexible terms, and easy financial management—all at your fingertips. Download the Alwan app now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-black text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#00D9FF" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z" />
                  <path fill="#00FF88" d="M16.398 10.893l-2.606 2.606-10.937 6.333 8.635-8.635z" />
                  <path fill="#FFD600" d="M16.398 13.107l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.192-1.107z" />
                  <path fill="#FF3D57" d="M3.61 22.186V2.734a1 1 0 01.609-.92l12.791 10.352-2.192 1.107-11.208 9.913z" />
                </svg>
                <span>GET IT ON <span className="block text-xs leading-tight text-slate-400">Google Play</span></span>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1d1d1f] text-white font-medium rounded-xl hover:opacity-90 transition-opacity border border-white/10"
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>Download on the <span className="block text-xs leading-tight">App Store</span></span>
              </Link>
            </div>
          </motion.div>

          {/* Right: phone mockup with app-style content + loop animation */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative shrink-0"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="relative w-56 h-[480px] bg-slate-800 rounded-[2rem] border-4 border-slate-700 overflow-hidden shadow-4xl">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-slate-900 rounded-full z-10" />
              <div className="bg-white h-full pt-12 pb-6 px-3 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-violet-600 font-bold text-sm">Alwan</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                </div>
                <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100 mb-4">
                  <p className="text-xs text-slate-500 mb-1">Highest available</p>
                  <p className="text-2xl font-bold text-violet-800">₱50,000</p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-600">
                    <span>As low as 0.26%/day</span>
                    <span>Term 90 days</span>
                  </div>
                  <div className="mt-3 py-2.5 bg-gradient-to-r from-teal-500 to-violet-600 text-white text-center font-medium rounded-xl">
                    Borrow Now
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 mb-4">
                  <p className="text-xs font-medium text-slate-700 mb-2">Borrowing Process</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Apply</span>
                    <span>Submit</span>
                    <span>Get Funds</span>
                  </div>
                </div>
                <div className="mt-auto flex justify-around py-2 border-t border-slate-100">
                  <span className="text-xs font-medium text-violet-600">Home</span>
                  <span className="text-xs text-slate-400">Bill</span>
                  <span className="text-xs text-slate-400">Me</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
