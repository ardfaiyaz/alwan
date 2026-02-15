'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MagneticButton } from '@/components/MagneticButton'
import MobileCTA from '@/components/MobileCTA'
import { ChevronDown, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { LeftOverlayCard } from '@/components/LeftOverlayCard'
import { RightOverlayCard } from '@/components/RightOverlayCard'
import FeatureShowcase from '@/components/FeatureShowcase'
import FAQSection from '@/components/FAQSection'
import CoreValuesSection from '@/components/CoreValuesSection'
import ScrollProgress from '@/components/ScrollProgress'

const coreValues = [
  {
    title: 'Accessible',
    description:
      'We believe every Filipino deserves access to financial services. No complex requirements, no hidden fees—just straightforward solutions that work for you.',
    image: '/images/values/accessible.png',
  },
  {
    title: 'Transparent',
    description:
      'Clear terms, honest rates, and full disclosure. We build trust through transparency in every transaction. What you see is what you get.',
    image: '/images/values/transparent.png',
  },
  {
    title: 'Community-First',
    description:
      'Rooted in Philippine values of bayanihan. We grow together with our communities across the islands. Your success is our success.',
    image: '/images/values/community-first.png',
  },
]

const howItWorksSteps = [
  {
    num: 'Step 1',
    title: 'Fill Application',
    desc: 'Complete our quick online form in under 5 minutes',
    color: 'from-[#009245] to-[#007a3d]',
  },
  {
    num: 'Step 2',
    title: 'Get Approved',
    desc: 'Receive instant approval decision from our AI system',
    color: 'from-[#00a84f] to-[#009245]',
  },
  {
    num: 'Step 3',
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const demoVideos = [
    { id: 'F6b62ngcRzc', title: 'Alwan Introduction' },
    { id: '3JJmMVhuuc0', title: 'Mobile App Features' },
    { id: 'eLu9v3ZCZ5s', title: 'Fast Approval Process' },
    { id: '8mouV1XgCt0', title: 'Digital Financial Freedom' }
  ]

  const nextVideo = () => setCurrentVideoIndex((prev) => (prev + 1) % demoVideos.length)
  const prevVideo = () => setCurrentVideoIndex((prev) => (prev - 1 + demoVideos.length) % demoVideos.length)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Mobile Video Autoscroll
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        const videoInterval = setInterval(() => {
          setCurrentVideoIndex((prev) => (prev + 1) % demoVideos.length)
        }, 5000)
        return () => clearInterval(videoInterval)
      }
    }
    const cleanup = handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (cleanup) cleanup()
    }
  }, [demoVideos.length])

  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroY = useTransform(heroScrollYProgress, [0, 1], ['0%', '20%'])
  const leftCardY = useTransform(heroScrollYProgress, [0, 1], ['0%', '-40%'])
  const rightCardY = useTransform(heroScrollYProgress, [0, 1], ['0%', '-60%'])
  const textY = useTransform(heroScrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(heroScrollYProgress, [0, 0.5], [1, 0])

  return (
    <>
      <ScrollProgress />
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

        /* ── Glass CTA Button (adapted from Header Login) ── */
        .cta-btn-glass {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          /* padding handled by utility classes */
          font-weight: 600;
          color: #0f172a; /* slate-900 */
          border-radius: 999px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.8);
          border: 1.5px solid rgba(226, 232, 240, 0.8); /* slate-200 */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .cta-btn-glass::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: none;
        }
        .cta-btn-glass:hover::after {
          left: 150%;
          transition: left 0.7s ease-in-out;
        }
        .cta-btn-glass:hover {
          background: #ffffff;
          border-color: #cbd5e1; /* slate-300 */
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }

        /* ── How It Works Glass Button ── */
        .how-btn-glass {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #009245;
          color: white;
          font-weight: 700;
          border-radius: 999px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(0, 146, 69, 0.4);
        }
        .how-btn-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-25deg);
          transition: none;
        }
        .how-btn-glass:hover::before {
          left: 150%;
          transition: left 0.7s ease-in-out;
        }
        .how-btn-glass:hover {
          background: #007a3d;
          box-shadow: 0 8px 24px rgba(0, 122, 61, 0.5);
          transform: translateY(-2px);
        }

        /* ── Ghost Button for Light Backgrounds ── */
        .btn-ghost-dark {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.9rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b; /* slate-800 */
          border-radius: 999px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          border: 2px solid #e2e8f0; /* slate-200 */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .btn-ghost-dark::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,146,69,0.1), transparent);
          transition: left 0.5s ease;
        }
        .btn-ghost-dark:hover::before {
          left: 100%;
        }
        .btn-ghost-dark:hover {
          color: #009245;
          background: #f8fafc;
          border-color: #009245;
          box-shadow: 0 4px 14px rgba(0, 146, 69, 0.1);
        }
        .btn-ghost-dark span { position: relative; z-index: 1; }

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
          style={{ y: heroY, opacity }}
          className="relative z-10 w-full h-full"
        >
          <div className="w-full h-full flex flex-col lg:flex-row gap-0 lg:gap-8">

            {/* LEFT: copy - with left padding, vertically centered */}
            <motion.div
              style={{ y: textY, flexBasis: '60%' }}
              className="flex flex-col justify-center items-center lg:items-start space-y-5 sm:space-y-6 lg:space-y-8
                            py-12 sm:py-16 lg:py-0 text-center lg:text-left"
            >

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mt-8 lg:mt-0 lg:pl-36 xl:pl-40"
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white/90"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Best Capstone Website Designed in NU Dasmarinas
                </span>
              </motion.div>

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
            </motion.div>

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
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 1.0 }}
                  className="absolute z-20"
                  style={{ top: '18%', left: '-18%', scale: 1.1, y: leftCardY }}
                >
                  <LeftOverlayCard />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 1.2 }}
                  className="absolute z-20"
                  style={{ top: '42%', right: '-18%', scale: 1.1, y: rightCardY }}
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
      </section >

      {/* ═══════════════════ FEATURE SHOWCASE ═══════════════════ */}
      < FeatureShowcase />

      {/* ═══════════════════ WHY CHOOSE ALWAN ═══════════════════ */}
      < CoreValuesSection />



      {/* ═══════════════════ VIDEO (Carousel Style) ═══════════════════ */}
      < section ref={videoSectionRef} className="py-0" >
        <div className="mx-4 sm:mx-6 lg:mx-8 relative rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100">
          {/* Internal Dark Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06] pointer-events-none" />

          {/* Grainy Noise Overlay */}
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-emerald-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[80%] h-[80%] bg-[#009245]/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#4dd88f] to-white bg-clip-text text-transparent">
                Watch Demo
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                See Alwan in Action
              </h2>
              <p className="text-lg sm:text-xl text-slate-300/80">
                Watch how we&apos;re transforming financial access for Filipinos
              </p>
            </motion.div>

            <div className="relative group/carousel max-w-5xl mx-auto">
              {/* Navigation Arrows (Outside) */}
              <button
                onClick={prevVideo}
                className="absolute -left-12 lg:-left-20 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-emerald-400 transition-all duration-300 hover:scale-125"
              >
                <ChevronLeft className="w-10 h-10 lg:w-12 lg:h-12" />
              </button>
              <button
                onClick={nextVideo}
                className="absolute -right-12 lg:-right-20 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-emerald-400 transition-all duration-300 hover:scale-125"
              >
                <ChevronRight className="w-10 h-10 lg:w-12 lg:h-12" />
              </button>

              <div className="relative">
                {/* Video Glow Effect */}
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[2rem] opacity-30 blur-2xl" />

                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentVideoIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="w-full h-full"
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${demoVideos[currentVideoIndex].id}`}
                        title={demoVideos[currentVideoIndex].title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center items-center gap-3 mt-8">
                  {demoVideos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentVideoIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentVideoIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ═══════════════════ HOW IT WORKS (Horizontal) ═══════════════════ */}
      < section id="how-it-works" className="py-24 sm:py-32 bg-white relative overflow-hidden" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
              Simple Process
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How It{' '}
              <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">Get funded in three simple steps</p>
          </motion.div>

          <div className="relative">
            {/* Horizontal Line Connector (Desktop) */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 hidden lg:block -translate-y-24 px-40">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              />
            </div>

            {/* Vertical Line Connector (Mobile) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-100 lg:hidden -translate-x-1/2 py-20">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
                className="w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
              {howItWorksSteps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative group flex flex-col items-center text-center"
                >
                  {/* Step Label Badge */}
                  <div className="relative z-10 px-5 py-2 mb-8 bg-emerald-50 backdrop-blur-md rounded-full border border-emerald-100 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-300 transition-all duration-300">
                    <span className="text-sm font-bold bg-gradient-to-br from-[#009245] to-[#005a2b] bg-clip-text text-transparent uppercase tracking-wider">
                      {step.num}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="bg-white lg:bg-slate-50/50 group-hover:bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-300 shadow-lg shadow-slate-300/90 group-hover:shadow-2xl group-hover:border-emerald-200 w-full">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Desktop Arrows/Dots between steps removed (Replaced by animated line) */}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <Link href="/register">
              <button className="btn-ghost-dark px-10 py-5 text-lg min-w-[280px]">
                <span>Start Your Application</span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section >


      {/* ═══════════════════ FAQ ═══════════════════ */}
      < FAQSection />

      {/* CTA (White Theme) */}
      < section className="py-24 sm:py-32 bg-white" >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Filipinos building a better financial future with Alwan. Get approved in minutes, not days.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/register">
                <MagneticButton className="px-12 py-5 bg-[#009245] text-white font-bold rounded-2xl hover:bg-[#007a3d] transition-all duration-300 shadow-xl shadow-emerald-200/50 text-lg min-w-[240px]">
                  Create Free Account
                </MagneticButton>
              </Link>
              <Link href="/login">
                <button className="px-8 py-5 text-slate-600 font-semibold hover:text-slate-900 transition-colors">
                  Already have an account? Log In
                </button>
              </Link>
            </div>

            {/* Subtle trust signal */}
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium pt-8">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Over 3,500+ active members this month
            </div>
          </motion.div>
        </div>
      </section >


      <MobileCTA />
    </>
  )
}