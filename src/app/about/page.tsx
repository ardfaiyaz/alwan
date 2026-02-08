'use client'

/**
 * About page - Mission, core values, and team (3 developers).
 * Section 1: Mission intro; Section 2: Core values cards; Section 3: Team grid.
 */

import Image from 'next/image'
import { motion } from 'framer-motion'

const coreValues = [
  {
    title: 'Accessible',
    description: 'Every Filipino deserves access to financial services. We remove barriers and simplify the process.',
  },
  {
    title: 'Transparent',
    description: 'Clear terms, honest rates, and full disclosure. Trust is built through transparency.',
  },
  {
    title: 'Community-First',
    description: 'Rooted in bayanihan. We grow together with our communities across the Philippines.',
  },
]

const developers = [
  {
    name: 'Donaire, John Melthon ',
    role: 'Front-end Developer',
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

export default function AboutPage() {
  return (
    <>
      {/* Section 1: Mission/Intro - gentle bg */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-violet-600/80 font-medium uppercase tracking-wider mb-4 text-sm">About Alwan</p>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Empowering Filipinos through financial inclusion
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Alwan was born from a simple belief: every Filipino deserves access to fair, transparent
              financial services. We&apos;re a Philippine-based microfinance platform designed to serve
              sari-sari store owners, market vendors, and aspiring entrepreneurs across the islands.
            </p>
            <p className="text-xl text-slate-600 leading-relaxed mt-6">
              Our name means &quot;shelter&quot; in Arabic—a place of safety and growth. We aim to be
              that shelter for your financial journey, helping you build, save, and thrive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Core Values - gentle */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-violet-600/80 mb-2">What we believe</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#faf9fc] rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Team - gentle */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text text-transparent">
							The team
						</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Meet the{' '}
              <span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
								Developers
							</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The passionate developers behind Alwan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {developers.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <TeamMemberImage src={dev.image} name={dev.name} />
                <h3 className="text-xl font-bold text-slate-900 mt-6 mb-1">{dev.name}</h3>
                <p className="text-slate-500 font-medium text-sm mb-1">{dev.role}</p>
                <p className="text-slate-500 font-medium text-sm mb-4">{dev.role1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
