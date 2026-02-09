'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { MagneticButton } from '@/components/MagneticButton'
import MobileCTA from '@/components/MobileCTA'
import { ChevronDown } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

// Core value cards data for "Why Choose Alwan"
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

// How it Works steps
const howItWorksSteps = [
  {
    num: '01',
    title: 'Fill Application',
    desc: 'Complete our quick online form in under 5 minutes',
    color: 'from-violet-500 to-purple-600',
  },
  {
    num: '02',
    title: 'Get Approved',
    desc: 'Receive instant approval decision from our AI system',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    num: '03',
    title: 'Receive Funds',
    desc: 'Money transferred directly to your account within hours',
    color: 'from-emerald-500 to-green-600',
  },
]

const YOUTUBE_EMBED_ID = 'pbXJBmTrE-U'

const EnhancedAbstractPatterns = () => {
  return (
    <>
      {/* Enhanced SVG Patterns with Creative Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="line2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="line3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="radial1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="radial2">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Curved flowing lines */}
        <path d="M 0 200 Q 300 100, 600 200 T 1200 200" stroke="url(#line1)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M 0 400 Q 300 300, 600 400 T 1200 400" stroke="url(#line2)" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M 0 600 Q 300 500, 600 600 T 1200 600" stroke="url(#line3)" strokeWidth="2" fill="none" opacity="0.4" />
        
        {/* Diagonal sweeping lines */}
        <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="url(#line1)" strokeWidth="1" opacity="0.4" />
        <line x1="0%" y1="100%" x2="100%" y2="0%" stroke="url(#line2)" strokeWidth="1" opacity="0.4" />
        <line x1="0%" y1="30%" x2="100%" y2="70%" stroke="url(#line3)" strokeWidth="0.8" opacity="0.3" />
        <line x1="0%" y1="70%" x2="100%" y2="30%" stroke="url(#line1)" strokeWidth="0.8" opacity="0.3" />
        
        {/* Grid with gradient */}
        <line x1="20%" y1="0%" x2="20%" y2="100%" stroke="url(#line1)" strokeWidth="0.5" opacity="0.3" />
        <line x1="40%" y1="0%" x2="40%" y2="100%" stroke="url(#line2)" strokeWidth="0.5" opacity="0.3" />
        <line x1="60%" y1="0%" x2="60%" y2="100%" stroke="url(#line3)" strokeWidth="0.5" opacity="0.3" />
        <line x1="80%" y1="0%" x2="80%" y2="100%" stroke="url(#line1)" strokeWidth="0.5" opacity="0.3" />
        
        <line x1="0%" y1="20%" x2="100%" y2="20%" stroke="url(#line2)" strokeWidth="0.5" opacity="0.3" />
        <line x1="0%" y1="40%" x2="100%" y2="40%" stroke="url(#line3)" strokeWidth="0.5" opacity="0.3" />
        <line x1="0%" y1="60%" x2="100%" y2="60%" stroke="url(#line1)" strokeWidth="0.5" opacity="0.3" />
        <line x1="0%" y1="80%" x2="100%" y2="80%" stroke="url(#line2)" strokeWidth="0.5" opacity="0.3" />
        
        {/* Circles with radial gradients */}
        <circle cx="20%" cy="20%" r="80" fill="url(#radial1)" opacity="0.3" />
        <circle cx="80%" cy="30%" r="100" fill="url(#radial2)" opacity="0.25" />
        <circle cx="50%" cy="50%" r="120" fill="url(#radial1)" opacity="0.2" />
        <circle cx="30%" cy="80%" r="90" fill="url(#radial2)" opacity="0.25" />
        <circle cx="70%" cy="70%" r="110" fill="url(#radial1)" opacity="0.2" />
        
        {/* Intersection dots */}
        <circle cx="20%" cy="20%" r="5" fill="#ffffff" opacity="0.5" />
        <circle cx="40%" cy="40%" r="4" fill="#14b8a6" opacity="0.6" />
        <circle cx="60%" cy="60%" r="6" fill="#8b5cf6" opacity="0.5" />
        <circle cx="80%" cy="80%" r="5" fill="#ffffff" opacity="0.4" />
        <circle cx="20%" cy="80%" r="4" fill="#14b8a6" opacity="0.5" />
        <circle cx="80%" cy="20%" r="5" fill="#8b5cf6" opacity="0.6" />
        
        {/* Connecting arcs */}
        <path d="M 100 100 Q 300 50, 500 100" stroke="url(#line1)" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 700 200 Q 900 150, 1100 200" stroke="url(#line2)" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 200 600 Q 400 550, 600 600" stroke="url(#line3)" strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
      
      {/* Enhanced Moving Particles */}
      {/* Large orbital particles */}
      <motion.div
        animate={{
          y: [0, -180, 0],
          x: [0, 80, 0],
          opacity: [0.3, 0.9, 0.3],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-24 left-32 w-8 h-8 rounded-full blur-md"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(139,92,246,0.4) 100%)' }}
      />
      <motion.div
        animate={{
          y: [0, 160, 0],
          x: [0, -90, 0],
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute top-40 right-24 w-7 h-7 rounded-full blur-md"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.9) 0%, rgba(255,255,255,0.3) 100%)' }}
      />
      <motion.div
        animate={{
          y: [0, -140, 0],
          x: [0, 60, 0],
          opacity: [0.35, 0.85, 0.35],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-32 left-1/4 w-6 h-6 rounded-full blur-md"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(20,184,166,0.3) 100%)' }}
      />
      
      {/* Medium flowing particles */}
      <motion.div
        animate={{
          y: [0, -100, 0],
          x: [0, 50, 0],
          opacity: [0.5, 1, 0.5],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/5 w-5 h-5 bg-gradient-to-br from-teal-300 to-violet-300 rounded-full blur-sm"
      />
      <motion.div
        animate={{
          y: [0, 120, 0],
          x: [0, -55, 0],
          opacity: [0.5, 1, 0.5],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.8,
        }}
        className="absolute top-1/2 right-1/4 w-4 h-4 bg-gradient-to-br from-violet-400 to-teal-400 rounded-full blur-sm"
      />
      
      {/* Small sparkle particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, Math.random() * 150 - 75, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#14b8a6' : '#8b5cf6',
            boxShadow: '0 0 10px currentColor',
          }}
        />
      ))}
      
      {/* Rotating ring particles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 right-1/3 w-32 h-32"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-white blur-sm"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translateX(60px)`,
              opacity: 0.4,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </>
  )
}

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollY, scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -50])

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-stretch overflow-hidden bg-gradient-to-br from-violet-600 via-teal-500 to-purple-600">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <EnhancedAbstractPatterns />
          
          {/* Enhanced Animated Glows */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.35, 0.2],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-10 right-20 w-[500px] h-[500px] bg-gradient-to-br from-white/30 to-violet-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.25, 0.4, 0.25],
              x: [0, -60, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
            className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/30 to-transparent rounded-full blur-3xl"
          />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex-1 flex flex-col">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-end flex-1">
            {/* Left: Text & Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center text-center lg:text-left text-white pt-12 lg:pt-0 pb-24 lg:pb-29"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Agarang Alwan para sa iyong pangarap!
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8">
                Fast, transparent microloans for every Filipino. Simple application, instant approval, funds within hours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/register">
                  <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-xl">
                    Get Started
                  </MagneticButton>
                </Link>
                <Link href="#how-it-works" className="flex justify-center">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                    Learn More
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 text-sm">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold">₱500M+</div>
                  <div className="text-white/70 text-xs sm:text-sm">Disbursed</div>
                </div>
                <div className="w-px h-10 sm:h-12 bg-white/20" />
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold">50K+</div>
                  <div className="text-white/70 text-xs sm:text-sm">Clients</div>
                </div>
                <div className="w-px h-10 sm:h-12 bg-white/20" />
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold">98%</div>
                  <div className="text-white/70 text-xs sm:text-sm">Satisfaction</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Half Phone Mockup - MUCH BIGGER & RESPONSIVE */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex items-end justify-center lg:justify-end h-full"
            >
              <div className="relative w-[280px] sm:w-[340px] md:w-[380px] lg:w-[480px] xl:w-[520px]" style={{ height: '620px'}}>
                {/* Phone mockup - only showing top 50% */}
                <div className="absolute bottom-0 left-0 right-0 w-full h-full overflow-hidden">
                  {/* DRAMATIC VISIBLE SHADOW */}
                  
                  {/* Phone frame */}
                  <div className="relative w-full h-[760px] sm:h-[840px] lg:h-[960px] bg-slate-900 rounded-t-[2.5rem] sm:rounded-t-[2.7rem] border-x-[8px] sm:border-x-12 border-t-[8px] sm:border-t-12 ">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-58 h-6 sm:h-11 bg-slate-900 rounded-b-2xl sm:rounded-b-3xl z-20 border-x-2 border-b-2 border-slate-600" />
                    
                    {/* Screen content */}
                    <div className="relative w-full h-full bg-gradient-to-br from-violet-600 via-teal-500 to-purple-600 overflow-hidden rounded-t-[2rem] sm:rounded-t-[2.2rem]">
                      {/* Status bar - ONLY BATTERY ICON */}
                      <div className="absolute top-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-b from-black/40 to-transparent z-10 flex items-center justify-between px-6 sm:px-8 ">
                        <span className="text-white text-[10px] sm:text-xs font-semibold">9:41</span>
                        <div className="flex gap-1.5 sm:gap-2 items-center">
                          {/* iPhone Battery Icon */}
                          <div className="relative w-6 sm:w-7 h-3 sm:h-3.5 border-2 border-white rounded-sm flex items-center p-[0.050rem]">
                            <div className="w-full h-full bg-white rounded-sm" />
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-2 bg-white rounded-r-sm" />
                          </div>
                        </div>
                      </div>

                      {/* App content - Animated */}
                      <div className="pt-14 sm:pt-16 px-4 sm:px-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Alwan</h2>
                          <p className="text-white/90 text-xs sm:text-sm mb-6 sm:mb-8">Your financial partner</p>
                        </motion.div>

                        {/* Main card with animated elements */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                          className="bg-white/15 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl"
                        >
                          <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                              <p className="text-white/70 text-[10px] sm:text-sm mb-1">Available Credit</p>
                              <motion.h3
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="text-white text-2xl sm:text-4xl font-bold"
                              >
                                ₱50,000
                              </motion.h3>
                            </div>
                            <motion.div
                              animate={{
                                rotate: [0, 360],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-teal-400 to-violet-400 flex items-center justify-center border-2 sm:border-4 border-white/20"
                            >
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/30" />
                            </motion.div>
                          </div>

                          {/* Progress bar */}
                          <div className="mb-4 sm:mb-6">
                            <div className="flex justify-between text-[9px] sm:text-xs text-white/70 mb-1.5 sm:mb-2">
                              <span>Credit Used</span>
                              <span>65%</span>
                            </div>
                            <div className="w-full h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '65%' }}
                                transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-teal-400 to-violet-400 rounded-full relative"
                              >
                                <motion.div
                                  animate={{
                                    x: [0, 100, 0],
                                    opacity: [0, 1, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                />
                              </motion.div>
                            </div>
                          </div>

                          {/* Action button */}
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 sm:py-4 bg-white text-violet-600 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all"
                          >
                            Request Loan
                          </motion.button>
                        </motion.div>

                        {/* Recent transactions */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.6 }}
                          className="mt-4 sm:mt-6 space-y-2 sm:space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-white/70 text-xs sm:text-sm font-semibold">Recent Activity</p>
                            <div className="flex gap-0.5 sm:gap-1">
                              <motion.div
                                animate={{ scaleY: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                className="w-0.5 sm:w-1 h-2 sm:h-3 bg-white/50 rounded-full"
                              />
                              <motion.div
                                animate={{ scaleY: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                className="w-0.5 sm:w-1 h-2 sm:h-3 bg-white/50 rounded-full"
                              />
                              <motion.div
                                animate={{ scaleY: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                className="w-0.5 sm:w-1 h-2 sm:h-3 bg-white/50 rounded-full"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-emerald-500" />
                                <div>
                                  <p className="text-white text-xs sm:text-sm font-semibold">Loan Approved</p>
                                  <p className="text-white/60 text-[9px] sm:text-xs">2 hours ago</p>
                                </div>
                              </div>
                              <p className="text-green-400 font-bold text-xs sm:text-base">+₱50,000</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Glow effect */}
                <motion.div
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -inset-6 bg-gradient-to-br from-violet-500 via-teal-500 to-purple-500 rounded-t-[3rem] blur-2xl -z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE ALWAN */}
      <section
        id="why-choose-alwan"
        className="py-16 sm:py-20 bg-[#FAFAFA] pt-12 lg:pt-18 scroll-mt-22"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-xs sm:text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text text-transparent">
              Why choose us
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
                Alwan
              </span>
              ?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col max-w-sm mx-auto w-full"
              >
                <div className="aspect-[4/3] bg-[#FAFAFA] flex items-center justify-center text-slate-500 text-xs sm:text-sm">
                  Add image
                </div>
                <div className="p-4 flex-1 text-center">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEE ALWAN IN ACTION */}
      <section className="py-16 sm:py-24 bg-[#f5f0ff] relative overflow-hidden">
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0 bg-gradient-to-r from-violet-700 via-teal-500 to-purple-600 opacity-10"
        />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <p className="text-xs sm:text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text text-transparent">
              See it in action
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              Discover How Alwan Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-md">
              Watch how Alwan is transforming communities across the Philippines with accessible financial tools and microloans that uplift families.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl sm:rounded-2xl overflow-hidden max-w-4xl mx-auto aspect-video shadow-xl border border-slate-200/50"
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

      {/* HOW IT WORKS - NEXT LEVEL CREATIVE (NO PHONE MOCKUP) */}
      <section 
        id="how-it-works"
        className="relative py-20 sm:py-32 bg-gradient-to-br from-violet-600 via-teal-500 to-purple-600 overflow-hidden"
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-10 w-[600px] h-[600px] bg-violet-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.3, 0.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-400 rounded-full blur-3xl"
          />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-white/90">
              Three Simple Steps
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              From application to funds in your account — it's that simple
            </p>
          </motion.div>

          {/* Animated Timeline Flow */}
          <div className="relative">
            {/* Connecting animated line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="w-full h-full bg-gradient-to-b from-violet-400 via-teal-400 to-emerald-400 origin-top"
              >
                <motion.div
                  animate={{ y: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-20 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
                />
              </motion.div>
            </div>

            {/* Steps */}
            <div className="space-y-12 sm:space-y-20">
              {howItWorksSteps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${
                    idx % 2 === 0 ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Number & Info */}
                  <div className={`${idx % 2 === 0 ? 'md:text-right md:order-1' : 'md:order-2'}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-block"
                    >
                      <div className={`inline-flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-white/20 shadow-2xl ${
                        idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                      }`}>
                        <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{step.num}</span>
                        </div>
                        <div className={idx % 2 === 0 ? 'md:text-right' : ''}>
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{step.title}</h3>
                          <p className="text-sm sm:text-base text-white/80">{step.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating Animated Card */}
                  <div className={`${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.2 + 0.3 }}
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: idx % 2 === 0 ? -5 : 5,
                        rotateX: 5,
                      }}
                      className="relative p-6 sm:p-8 bg-white/15 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/30 shadow-2xl"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Animated background glow */}
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 rounded-2xl sm:rounded-3xl blur-xl`}
                      />

                      {/* Card Content */}
                      <div className="relative space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${step.color} text-white text-xs sm:text-sm font-bold`}>
                            Step {step.num}
                          </div>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${step.color} opacity-50`}
                          />
                        </div>
                        
                        <div className="h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: '0%' }}
                            whileInView={{ width: `${(idx + 1) * 33.33}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: idx * 0.2 + 0.5 }}
                            className={`h-full bg-gradient-to-r ${step.color} rounded-full relative`}
                          >
                            <motion.div
                              animate={{ x: ['0%', '100%'] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            />
                          </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: idx * 0.2 + 0.6 + i * 0.1 }}
                              className="h-2 sm:h-3 bg-white/30 rounded-full"
                            />
                          ))}
                        </div>

                        {/* Floating particles inside card */}
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -15, 0],
                              x: [0, Math.random() * 10 - 5, 0],
                              opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                              duration: 2 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.3,
                            }}
                            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
                            style={{
                              top: `${20 + i * 30}%`,
                              right: `${10 + i * 20}%`,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Center pulse indicator (desktop only) */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.2 }}
                      className="relative"
                    >
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${step.color} border-4 border-white shadow-xl`} />
                      <motion.div
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                        className={`absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${step.color}`}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16 sm:mt-24"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-violet-600 font-bold text-base sm:text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all"
              >
                Start Your Application Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-12">
        <Link href="/register">
          <MagneticButton className="px-6 py-3 bg-gradient-to-r from-teal-500 to-violet-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Start Your Journey
          </MagneticButton>
        </Link>
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
                  <div
                    key={`${setIndex}-${logo.id}`}
                    className="flex-shrink-0 w-28 h-14 sm:w-32 sm:h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium shadow-sm"
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

      {/* MOBILE CTA */}
      <MobileCTA />
    </>
  )
}