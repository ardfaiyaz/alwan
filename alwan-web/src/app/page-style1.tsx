'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Check, Play, Zap, Shield, TrendingUp } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import ScrollProgress from '@/components/ui/ScrollProgress'
import LoginModal from '@/components/ui/LoginModal'
import SavingsSection from '@/components/sections/SavingsSection'
import FAQSection from '@/components/sections/FAQSection'
import CoreValuesSection from '@/components/sections/CoreValuesSection'

const words = ['Dream Home', 'New Business', 'Education']

const howItWorksSteps = [
  {
    num: '01',
    title: 'Register & Orient',
    desc: 'Create an account, watch the digital orientation, and join a center in your community.',
    icon: '📝',
  },
  {
    num: '02',
    title: 'Submit & Verify',
    desc: 'Submit your loan application and undergo our fast CIBI (Credit Investigation) process.',
    icon: '✓',
  },
  {
    num: '03',
    title: 'Receive & Grow',
    desc: 'Get your funds disbursed to your account and start building your business dream.',
    icon: '🚀',
  },
]

const demoVideos = [
  { id: 'F6b62ngcRzc', title: 'Alwan Introduction' },
  { id: '3JJmMVhuuc0', title: 'Mobile App Features' },
  { id: 'eLu9v3ZCZ5s', title: 'Fast Approval Process' },
  { id: '8mouV1XgCt0', title: 'Digital Financial Freedom' }
]

const features = [
  {
    icon: Zap,
    title: 'Fast Approval',
    description: 'Get approved in minutes, not days'
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Bank-level security for your data'
  },
  {
    icon: TrendingUp,
    title: 'Build Credit',
    description: 'Grow your financial future'
  }
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [currentWord, setCurrentWord] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('login') === 'true') {
      setIsLoginModalOpen(true)
      window.history.replaceState({}, '', '/')
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const nextVideo = () => setCurrentVideoIndex((prev) => (prev + 1) % demoVideos.length)
  const prevVideo = () => setCurrentVideoIndex((prev) => (prev - 1 + demoVideos.length) % demoVideos.length)

  return (
    <>
      <ScrollProgress />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Hero Section - Apple Style */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-white to-white" />
        
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-900">Best Capstone Website Designed in NU Dasmarinas</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-6"
          >
            Agarang Alwan
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              para sa iyong
            </span>
          </motion.h1>

          {/* Rotating Words */}
          <div className="h-24 sm:h-28 md:h-32 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentWord}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600"
              >
                {words[currentWord]}!
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Fast, transparent microloans designed for Filipinos.
            <br className="hidden sm:block" />
            Get approved in minutes, receive funds in hours.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <button className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-full font-semibold text-lg transition-all duration-300 border-2 border-gray-200 hover:border-emerald-500 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>3,590+ members funded</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>BSP Compliant</span>
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 relative"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent blur-3xl" />
              <Image
                src="/images/mockups/phone.png"
                alt="Alwan App"
                width={400}
                height={800}
                className="relative z-10 mx-auto drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - Minimal Cards */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why choose Alwan
            </h2>
            <p className="text-xl text-gray-600">Simple, fast, and secure microfinance</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Clean Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">Get funded in three simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-4xl mb-6 shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center font-bold text-emerald-600 text-sm">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/signup">
              <button className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
                Start Your Journey
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Video Section - Minimal */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              See Alwan in action
            </h2>
            <p className="text-xl text-gray-600">Watch how we're transforming financial access</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVideoIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${demoVideos[currentVideoIndex].id}`}
                    title={demoVideos[currentVideoIndex].title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Video Navigation */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {demoVideos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentVideoIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentVideoIndex ? 'w-8 bg-emerald-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Savings Section */}
      <SavingsSection />

      {/* Core Values */}
      <CoreValuesSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA - Apple Style */}
      <section className="py-32 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Ready to get started?
            </h2>
            <p className="text-2xl text-gray-600 mb-12">
              Join thousands of Filipinos building their financial future
            </p>
            <Link href="/signup">
              <button className="group px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3">
                Get Started Today
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
