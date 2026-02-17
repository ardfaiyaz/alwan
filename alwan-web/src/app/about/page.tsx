'use client'

/**
 * About page - Enhanced with mission, stats, journey timeline, and team.
 */

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import CoreValuesSection from '@/components/sections/CoreValuesSection'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { useRef, useState, useEffect } from 'react'


const journey = [
  {
    year: '1986',
    title: ' The Beginning',
    description: 'KMBI was established as a Christ-centered development organization to help micro-entrepreneurs break the cycle of poverty.',
  },
  {
    year: '2010s',
    title: 'Nationwide Expansion',
    description: 'Grew to serve thousands of communities across the Philippines, providing not just loans but holistic transformation.',
  },
  {
    year: '2026',
    title: 'Digital Transformation',
    description: 'Launching "Alwan" - our digital platform to make financial services faster, easier, and more accessible than ever before.',
  },
  {
    year: 'Future',
    title: 'Vision 2030',
    description: 'Continuing our mission of integral transformation, leveraging technology to reach every underserved Filipino family.',
  },
]

const developers = [
  {
    name: 'Melthon Faiyaz',
    role: 'Full Stack Developer',
    role1: 'Project Lead',
    image: '/team/melthon.jpg'
  },
  {
    name: 'Team Member 2',
    role: 'Frontend Developer',
    role1: 'UI/UX Specialist',
    image: '/team/member2.jpg'
  },
  {
    name: 'Team Member 3',
    role: 'Backend Developer',
    role1: 'Database Architect',
    image: '/team/member3.jpg'
  }
]

// TeamMemberImage Component
function TeamMemberImage({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-emerald-600">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
    </div>
  )
}

// JourneyItem Component
function JourneyItem({ item, idx }: { item: any; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="flex gap-6"
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
          {item.year}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600">{item.description}</p>
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <>
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
