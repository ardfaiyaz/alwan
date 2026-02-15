'use client'

/**
 * About page - Enhanced with mission, stats, journey timeline, and team.
 */

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import CoreValuesSection from '@/components/CoreValuesSection'
import ScrollProgress from '@/components/ScrollProgress'
import { useRef, useState, useEffect } from 'react'

const journey = [
  {
    year: '2025',
    title: 'The Concept',
    description: 'Three NU Dasmariñas students conceptualized Alwan as a capstone project to address financial inclusion in the Philippines.',
  },
  {
    year: '2026',
    title: 'Development Phase',
    description: 'Building the platform with modern web technologies, designing user-friendly interfaces, and developing core features.',
  },
  {
    year: '2026',
    title: 'Testing & Refinement',
    description: 'Currently refining features, conducting user testing, and preparing for our official launch to serve Filipino communities.',
  },
  {
    year: 'Future',
    title: 'Launch & Beyond',
    description: 'Planning to launch our platform and empower Filipino entrepreneurs with accessible microfinance solutions.',
  },
]

const developers = [
  {
    name: 'Donaire, John Melthon ',
    role: 'Lead Developer',
    role1: 'Project Manager',
    image: '/images/devs/melthon.png',
  },
  {
    name: 'Buta, Kean Hero ',
    role: 'Backend Engineer',
    role1: 'Database Manager',
    image: '/images/devs/hero.png',
  },
  {
    name: 'Lucero, Pia Elleine',
    role: 'UI/UX Designer',
    role1: 'Documentation',
    image: '/images/devs/pia.png',
  },
]

function TeamMemberImage({ src, name }: { src: string; name: string }) {
  return (
    <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center text-slate-500 text-sm font-medium">
      <Image
        src={src}
        alt={name}
        width={400}
        height={400}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function JourneyItem({ item, idx }: { item: any; idx: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Responsive check for parallax
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Disable y parallax on mobile
  const yRange = isMobile ? [0, 0] : [100, -100]
  const y = useTransform(scrollYProgress, [0, 1], yRange)
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`relative flex flex-col md:flex-row gap-8 items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} pl-8 md:pl-0`}
    >
      {/* Mobile Timeline Dot and Connector */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center md:hidden">
        {/* The dot */}
        <div className="w-4 h-4 rounded-full bg-[#009245] ring-2 ring-emerald-100 z-10 mt-1.5" />
        {/* The line (except for last item, but simplistic approach first) */}
        <div className="w-px flex-1 bg-emerald-100 -mt-2" />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: idx % 2 === 0 ? y : useTransform(y, value => -value) }}
        className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-left md:text-inherit`}
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 text-[#009245] font-bold text-sm mb-3">
          {item.year}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
        <p className="text-slate-600 leading-relaxed">{item.description}</p>
      </motion.div>

      {/* Desktop Timeline dot */}
      <div className="hidden md:flex w-4 h-4 rounded-full bg-gradient-to-br from-[#009245] to-[#4dd88f] ring-4 ring-white shadow-lg z-10" />

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroBackgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroContentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <>
      {/* Section 1: Hero - Centered like FAQ */}
      {/* Section 1: Hero - Centered like FAQ */}
      <ScrollProgress />
      <section className="relative py-20 lg:py-28 overflow-hidden" ref={heroRef}>
        {/* Full-bleed background with gradient and grain */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06]"
          style={{ y: heroBackgroundY }}
        >
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full w-1/2 opacity-30"
            style={{
              background: 'radial-gradient(ellipse 60% 70% at 70% 40%, rgba(0,146,69,0.5) 0%, transparent 70%)',
              y: useTransform(scrollYProgress, [0, 1], [0, -100])
            }}
          />
          <motion.div
            className="absolute left-0 bottom-0 h-2/3 w-1/2 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(0,0,0,0.8) 0%, transparent 70%)',
              y: useTransform(scrollYProgress, [0, 1], [0, 100])
            }}
          />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ y: heroContentY }}
          >
            <p className="text-white/80 font-medium uppercase tracking-widest mb-4 text-sm">About Alwan</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Empowering Filipinos through financial inclusion
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Mission & Vision */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group"
            >
              <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Financial freedom for every Filipino
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                We&apos;re breaking down barriers to financial access by providing fast, transparent microloans
                to underserved communities across the Philippines.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                Our name means &quot;shelter&quot; in Arabic—a place of safety and growth. We aim to be
                that shelter for your financial journey, helping you build, save, and thrive.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group"
            >
              <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                Our Vision
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                A Philippines where everyone can prosper
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                We envision a future where financial services are accessible to all Filipinos,
                regardless of location, income, or background.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                Through technology and community-first values, we&apos;re building a more inclusive
                financial ecosystem that empowers dreams and fuels growth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Core Values */}
      <CoreValuesSection />

      {/* Section 5: Journey Timeline */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
              Our Journey
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                How{' '}
              </span>
              We Got Here
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From a capstone project to empowering thousands of Filipinos
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200 transform -translate-x-1/2" />

            <div className="space-y-12 md:space-y-16">
              {journey.map((item, idx) => (
                <JourneyItem key={item.title} item={item} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: The Team */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
              The team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Meet the{' '}
              <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The passionate developers behind Alwan, building financial inclusion one line of code at a time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {developers.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6 overflow-hidden rounded-xl">
                  <TeamMemberImage src={dev.image} name={dev.name} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{dev.name}</h3>
                <p className="text-[#009245] font-semibold text-sm mb-1">{dev.role}</p>
                <p className="text-slate-500 font-medium text-sm">{dev.role1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
