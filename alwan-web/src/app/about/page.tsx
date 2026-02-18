'use client'

/**
 * About page - Enhanced with mission, stats, journey timeline, and team.
 */

import Image from 'next/image'
import { motion } from 'framer-motion'
import CoreValuesSection from '@/components/sections/CoreValuesSection'


const journey = [
  {
    year: '2025',
    title: 'Planning Phase',
    description: 'Conceptualized Alwan as our capstone project. Researched KMBI\'s needs, defined requirements, and designed the system architecture for both web and mobile platforms.',
  },
  {
    year: '2026',
    title: 'Data Gathering',
    description: 'Conducted extensive field research, interviewed KMBI staff and members, analyzed existing processes, and collected real-world data to build a solution that truly serves the community.',
  },
  {
    year: '2026',
    title: 'Development',
    description: 'Built the Alwan platform from the ground up. Developed the web admin portal and mobile app, integrated with Supabase, and implemented features for loans, savings, and member management.',
  },
  {
    year: 'Future',
    title: 'Deployment',
    description: 'Preparing for full deployment of both mobile and web platforms. Our goal is to make microfinance accessible, efficient, and empowering for every Filipino family KMBI serves.',
  },
]

const developers = [
  {
    name: 'Kean Hero Buta',
    role: 'Database Manager',
    role1: 'Mobile Engineer',
    image: '/images/devs/hero.png'
  },
  {
    name: 'John Melthon Donaire',
    role: 'Project Manager',
    role1: 'Website Engineer',
    image: '/images/devs/melthon.png'
  },
  {
    name: 'Pia Elleine Lucero',
    role: 'UI/UX Designer',
    role1: 'Documentation',
    image: '/images/devs/pia.png'
  }
]

// TeamMemberImage Component
function TeamMemberImage({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  )
}

// JourneyItem Component
function JourneyItem({ item, idx }: { item: any; idx: number }) {
  const isLeft = idx % 2 === 0
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 md:gap-8`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} text-center`}>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{item.title}</h3>
        <p className="text-slate-600 leading-relaxed text-base md:text-lg">{item.description}</p>
      </div>
      
      {/* Year Circle */}
      <div className="flex-shrink-0 relative">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#009245] to-[#4dd88f] flex items-center justify-center shadow-xl relative z-10">
          <span className="text-white font-bold text-xl md:text-2xl">{item.year}</span>
        </div>
        {/* Connecting line for desktop */}
        {idx < 3 && (
          <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-[#4dd88f] to-emerald-200" />
        )}
      </div>
      
      {/* Empty space for balance on alternating side */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section with Gradient and Grain */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#4dd88f] via-[#056633] to-[#000D06]">
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#4dd88f] font-semibold uppercase tracking-wider mb-4 text-sm">
              About Us
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-[#4dd88f]">Faith, Finance, Future</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Since 1986, KMBI has been transforming lives through microfinance. Now with Alwan, we're bringing that mission into the digital age.
            </p>
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
            Integral Transformation
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            To advocate and work for the integral transformation of the lives of low-income people and their communities by providing responsive, sustainable microfinance and non-financial services.
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            We believe in addressing not just economic needs, but the physical, emotional, and spiritual well-being of every individual we serve.
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
            Living in Abundance
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            To see people in communities live in abundance with strengthened faith in God and in right relationship with their fellowmen and the rest of creation.
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            We envision a Philippines where every family has the opportunity to thrive, grounded in faith and supported by a caring community.
          </p>
        </motion.div>
      </div>
    </div>
  </section>

  {/* Section 3: Core Values */ }
  <CoreValuesSection />

  {/* Section 5: Journey Timeline */ }
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
          The journey of building Alwan - from concept to reality
        </p>
      </motion.div>

      <div className="relative max-w-6xl mx-auto">
        <div className="space-y-16 md:space-y-24">
          {journey.map((item, idx) => (
            <JourneyItem key={item.title} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* Section 6: The Team */ }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
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
