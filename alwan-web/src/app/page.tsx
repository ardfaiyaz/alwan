'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MagneticButton } from '@/components/MagneticButton'
import MobileCTA from '@/components/MobileCTA'
import { ChevronDown, Sparkles } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { LeftOverlayCard } from '@/components/LeftOverlayCard'
import { RightOverlayCard } from '@/components/RightOverlayCard'

const coreValues = [
  {
    title: 'Accessible',
    description:
      'We believe every Filipino deserves access to financial services. No complex requirements, no hidden fees—just straightforward solutions that work for you.',
    image: '/images/values-accessible.jpg',
  },
  {
    title: 'Transparent',
    description:
      'Clear terms, honest rates, and full disclosure. We build trust through transparency in every transaction. What you see is what you get.',
    image: '/images/values-transparent.jpg',
  },
  {
    title: 'Community-First',
    description:
      'Rooted in Philippine values of bayanihan. We grow together with our communities across the islands. Your success is our success.',
    image: '/images/values-community.jpg',
  },
]

const howItWorksSteps = [
  {
    num: '01',
    title: 'Fill Application',
    desc: 'Complete our quick online form in under 5 minutes',
    color: 'from-[#009245] to-[#007a3d]',
  },
  {
    num: '02',
    title: 'Get Approved',
    desc: 'Receive instant approval decision from our AI system',
    color: 'from-[#00a84f] to-[#009245]',
  },
  {
    num: '03',
    title: 'Receive Funds',
    desc: 'Money transferred directly to your account within hours',
    color: 'from-[#4dd88f] to-[#009245]',
  },
]

const YOUTUBE_EMBED_ID = 'pbXJBmTrE-U'
const words = ['Dream Home', 'New Business', 'Education']

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const [currentWord, setCurrentWord] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(heroScrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(heroScrollYProgress, [0, 0.6], [1, 0.6])

  return (
    <>
      <style>{`
        /* ── Hero buttons with glass sliding effect ── */
        .hero-btn-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.9rem 2.2rem;
          font-size: 1rem;
          font-weight: 700;
          color: black;
          border-radius: 2rem;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: #ffffff;
          border: 2px solid rgba(255,255,255,0.95);
          box-shadow:
            0 4px 16px rgba(0,0,0,0.15),
            0 2px 4px rgba(0,0,0,0.1);
        }
        .hero-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          transition: left 0.5s ease;
        }
        .hero-btn-primary:hover::before {
          left: 100%;
        }
        .hero-btn-primary:hover {
          box-shadow:
            0 8px 24px rgba(0,0,0,0.2),
            0 4px 8px rgba(0,0,0,0.15);
          background: #f9fafb;
          border-color: rgba(255,255,255,1);
        }
        .hero-btn-primary span { position: relative; z-index: 1; }

        .hero-btn-ghost {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.9rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255,255,255,0.95);
          border-radius: 2rem;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255,255,255,0.08);
          border: 2px solid rgba(255,255,255,0.25);
          box-shadow: 0 2px 14px rgba(0,0,0,0.22);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .hero-btn-ghost::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .hero-btn-ghost:hover::before {
          left: 100%;
        }
        .hero-btn-ghost::after {
          content: '';
          position: absolute;
          top: 3px; left: 22%; right: 22%;
          height: 32%;
          border-radius: 0.5rem;
          background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%);
          filter: blur(2px);
          pointer-events: none;
        }
        .hero-btn-ghost:hover {
          color: #fff;
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.4);
          box-shadow: 0 6px 24px rgba(255,255,255,0.15);
        }
        .hero-btn-ghost span { position: relative; z-index: 1; }
        
        /* Smooth animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Full-bleed background */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06]">
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

        {/* ── Content — full bleed, only edge padding ── */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full h-full"
        >
          <div className="w-full h-full flex flex-col lg:flex-row gap-0 lg:gap-8">

            {/* LEFT: copy - with left padding, vertically centered */}
            <div className="flex flex-col justify-center items-center lg:items-start space-y-5 sm:space-y-6 lg:space-y-8
                            py-12 sm:py-16 lg:py-0 text-center lg:text-left"
              style={{ flexBasis: '60%' }}>



              {/* Heading — maximized */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="font-extrabold text-white tracking-tight leading-[0.96] lg:pl-36 xl:pl-40
                           text-[clamp(2.5rem,9vw,5.5rem)] sm:text-[clamp(2.8rem,8vw,6rem)] lg:text-[clamp(3rem,5.5vw,5.5rem)] xl:text-[clamp(3.5rem,5vw,6.5rem)]"
              >
                Agarang Alwan
                <br />
                para sa iyong
                <br />
                <span className="relative inline-block">
                  {words.map((word, idx) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: idx === currentWord ? 1 : 0, y: idx === currentWord ? 0 : 22 }}
                      transition={{ duration: 0.42, ease: 'easeOut' }}
                      className="absolute left-0 bottom-0 whitespace-nowrap text-transparent bg-clip-text"
                      style={{ backgroundImage: 'linear-gradient(135deg, #4dd88f 0%, #ffffff 60%)', pointerEvents: 'none' }}
                    >
                      {word}!
                    </motion.span>
                  ))}
                  <span className="invisible">New Business</span>
                </span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.22 }}
                className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/70 leading-relaxed px-4 lg:px-0 lg:pl-36 xl:pl-40"
              >
                Fast, transparent microloans designed for Filipinos. Get approved in minutes, receive funds in hours.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center lg:justify-start lg:pl-36 xl:pl-40"
              >
                <Link href="/register">
                  <button className="hero-btn-primary">
                    <span>Get Started</span>
                  </button>
                </Link>
                <Link href="#how-it-works">
                  <button className="hero-btn-ghost">
                    <span className="flex items-center gap-2">
                      Learn More
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.55 }}
                className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start lg:pl-36 xl:pl-40"
              >
                <div className="flex -space-x-2">
                  {['NI', 'GG', 'AA', '+'].map((label, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white/30 bg-gradient-to-br from-[#4dd88f] to-[#009245] flex items-center justify-center text-[9px] sm:text-[10px] text-white font-bold cursor-pointer"
                      style={{ zIndex: 4 - i }}
                    >
                      {label}
                    </motion.div>
                  ))}
                </div>
                <p className="text-white/60 text-xs sm:text-sm">
                  <span className="text-white font-semibold">3,590+</span> members already funded
                </p>
              </motion.div>

              {/* Phone — mobile only, shows below trust strip */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="lg:hidden relative w-full flex justify-center pt-2"
              >
                <div className="relative w-full max-w-[240px] sm:max-w-[280px] mx-auto">
                  <div className="relative w-full">
                    <div
                      className="absolute inset-x-6 top-6 -z-10 h-3/4 blur-2xl opacity-35 rounded-full"
                      style={{ background: 'linear-gradient(180deg, #009245, #005a2b)' }}
                    />
                    {/* Phone image - optimized size for mobile */}
                    <Image
                      src="/images/mockups/phone.png"
                      alt="Alwan App"
                      width={240}
                      height={490}
                      className="w-full h-auto relative z-10"
                      style={{ filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))' }}
                      priority
                    />
                    {/* Show overlay cards on mobile, smaller scale */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: 1.0 }}
                      className="absolute z-20"
                      style={{ top: '15%', left: '-12%', transform: 'scale(0.3)' }}
                    >
                      <LeftOverlayCard />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: 1.2 }}
                      className="absolute z-20"
                      style={{ top: '45%', right: '-12%', transform: 'scale(0.3)' }}
                    >
                      <RightOverlayCard />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Phone — desktop only, aligned left, pinned to bottom */}
            <div className="relative hidden lg:flex items-end justify-start h-full"
              style={{ flexBasis: '40%' }}>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative"
                style={{ width: '550px', marginBottom: '-30vh' }}
              >
                <div
                  className="absolute inset-x-24 top-24 -z-10 h-3/4 blur-3xl opacity-40 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #009245, #005a2b)' }}
                />
                {/* Phone image - with backdrop shadow */}
                <Image
                  src="/images/mockups/phone.png"
                  alt="Alwan App"
                  width={650}
                  height={1250}
                  className="w-full h-auto relative z-10"
                  style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.7))' }}
                  priority
                />
                <motion.div
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.0 }}
                  className="absolute z-20"
                  style={{ top: '18%', left: '-18%', transform: 'scale(4.0)' }}
                >
                  <LeftOverlayCard />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.2 }}
                  className="absolute z-20"
                  style={{ top: '42%', right: '-18%', transform: 'scale(4.0)' }}
                >
                  <RightOverlayCard />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-7 h-7 text-white/45" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ WHY CHOOSE ALWAN ═══════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Why Choose Alwan?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Built on values that matter to Filipino communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-teal-400"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={value.image}
                    alt={value.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70" />
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white group-hover:text-teal-300 transition-colors">{value.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">{value.description}</p>
                </div>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-emerald-400/10 rounded-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ VIDEO ═══════════════════ */}
      <section ref={videoSectionRef} className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              See Alwan in Action
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              Watch how we're transforming financial access for Filipinos
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl"
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${YOUTUBE_EMBED_ID}`}
              title="Alwan Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      {/* ═══════════════════ HOW IT WORKS (Redesigned) ═══════════════════ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">Get funded in three simple steps</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[2rem] left-0 w-full h-[2px] bg-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {howItWorksSteps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Number Circle */}
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full border-4 border-slate-50 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-[#009245] to-[#005a2b] bg-clip-text text-transparent">
                      {step.num}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 group-hover:text-[#009245] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16 sm:mt-24"
          >
            <Link href="/register">
              <MagneticButton className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200/50">
                Start Application
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-slate-600 mb-8">Join thousands of Filipinos who trust Alwan for their financial needs</p>
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MagneticButton className="px-8 py-4 bg-gradient-to-r from-[#009245] via-[#00a84f] to-[#009245] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-[#009245]/50 transition-all duration-300 cursor-pointer relative overflow-hidden group">
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#007a3d] to-[#009245] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </MagneticButton>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* AFFILIATED COMPANIES */}
      <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-slate-500 font-medium text-xs sm:text-sm uppercase tracking-wider"
          >
            Companies affiliated with Alwan
          </motion.p>
        </div>
        <div className="relative w-full">
          <div className="flex logo-scroll-track w-max gap-12 sm:gap-16 px-8">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-12 sm:gap-16 shrink-0 items-center">
                {[
                  { name: 'Partner One', id: 1 },
                  { name: 'Partner Two', id: 2 },
                  { name: 'Partner Three', id: 3 },
                  { name: 'Partner Four', id: 4 },
                  { name: 'Partner Five', id: 5 },
                ].map((logo) => (
                  <motion.div
                    key={`${setIndex}-${logo.id}`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex-shrink-0 w-28 h-14 sm:w-32 sm:h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 cursor-pointer"
                    aria-hidden
                  >
                    {logo.name}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  )
}