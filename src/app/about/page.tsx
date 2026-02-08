'use client'

/**
 * About page - Mission, core values, and team (3 developers).
 * Section 1: Mission intro; Section 2: Core values cards; Section 3: Team grid.
 */

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
    name: 'John Melthon Donaire',
    role: 'Prompt Engineer/Project Manager',
    image: '/images/devs/melthon.png',
    bio: 'A real nigga knows.',
  },
  {
    name: 'Kean Hero Buta',
    role: 'Backend Engineer',
    image: '/images/devs/hero.png',
    bio: 'Im a cunt, eat me.',
  },
  {
    name: 'Pia Ellein Lucero',
    role: 'UI/UX Designer/Documentation',
    image: '/images/devs/pia.png',
    bio: 'carts carts lang',
  },
]

function TeamMemberImage({ src, name }: { src: string; name: string }) {
  return (
    <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center text-slate-500 text-sm font-medium">
      Add image
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Section 1: Mission/Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-slate-500 font-medium uppercase tracking-wider mb-4">About Alwan</p>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Empowering Filipinos through financial inclusion
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
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

      {/* Section 2: Core Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-8 border border-slate-200"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Team - 3 Developers with image placeholders */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The developers behind Alwan—passionate about building for the Philippines.
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
                <p className="text-slate-600 font-medium mb-4">{dev.role}</p>
                <p className="text-slate-600 text-sm">{dev.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
