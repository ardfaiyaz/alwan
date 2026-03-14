'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Users, Clock, Award, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import ScrollProgress from '@/components/ui/ScrollProgress'
import LoginModal from '@/components/ui/LoginModal'
import SavingsSection from '@/components/sections/SavingsSection'
import FAQSection from '@/components/sections/FAQSection'
import CoreValuesSection from '@/components/sections/CoreValuesSection'

const words = ['Dream Home', 'New Business', 'Education']

const demoVideos = [
  { id: 'F6b62ngcRzc', title: 'Alwan Introduction' },
  { id: '3JJmMVhuuc0', title: 'Mobile App Features' },
  { id: 'eLu9v3ZCZ5s', title: 'Fast Approval Process' },
  { id: '8mouV1XgCt0', title: 'Digital Financial Freedom' }
]

const howItWorksSteps = [
  {
    num: '01',
    title: 'Register & Orient',
    desc: 'Create an account, watch the digital orientation, and join a center in your community.',
  },
  {
    num: '02',
    title: 'Submit & Verify',
    desc: 'Submit your loan application and undergo our fast CIBI (Credit Investigation) process.',
  },
  {
    num: '03',
    title: 'Receive & Grow',
    desc: 'Get your funds disbursed to your account and start building your business dream.',
  },
]

export default function HomePage() {
  const [currentWord, setCurrentWord] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

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

  return (
    <>
      <ScrollProgress />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Hero Section - Waffle Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(77,216,143,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(0,146,69,0.08),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm">
              <span className="text-sm text-gray-600">🚀 Announcing our latest product launch</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-4">
              From Application To
            </h1>
            <div className="h-20 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  {words[currentWord]}!
                </motion.h2>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Fast, transparent microloans designed for Filipinos. Get approved in minutes, receive funds in hours.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-center mb-20"
          >
            <Link href="/signup">
              <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2">
                Join Waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Phone Mockup with Floating Cards */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Left Floating Cards */}
              <div className="space-y-6 lg:space-y-8">
                {/* Active Members Card */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">+12%</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">3,590+</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                  {/* Mini Chart */}
                  <div className="mt-4 h-16 flex items-end gap-1">
                    {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Payment Card */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-xl text-white"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm opacity-80">GCASH</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-mono mb-6 tracking-wider">
                    •••• •••• •••• 9999
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-xs font-bold">
                      N
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
                      A
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Center Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative"
              >
                <div className="relative inline-block mx-auto">
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

              {/* Right Floating Cards */}
              <div className="space-y-6 lg:space-y-8">
                {/* Approval Time Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">5 mins</div>
                      <div className="text-xs text-gray-600">Approval Time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                    </div>
                    <span className="text-xs text-gray-600">Fast</span>
                  </div>
                </motion.div>

                {/* Success Rate Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
                  <div className="text-sm text-gray-600 mb-4">Success Rate</div>
                  {/* Bar Chart */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-600">Jan</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-purple-500 to-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-600">Feb</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-11/12 bg-gradient-to-r from-purple-500 to-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-600">Mar</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-purple-500 to-purple-600" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Minimal */}
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

          <div className="grid md:grid-cols-3 gap-12">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold mb-6 shadow-lg">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
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
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
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

      {/* Final CTA */}
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
