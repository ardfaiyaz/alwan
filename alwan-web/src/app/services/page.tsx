'use client'

/**
 * Services page - Four sections: hero, loan calculator widget, service cards (Micro Loans, Savings, Bill Payments, Insurance), and CTA.
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MagneticButton } from '@/components/ui/MagneticButton'
import MobileCTA from '@/components/sections/MobileCTA'


const services = [
  {
    title: 'Kabalikat Loan Program',
    description: 'The Kabalikat Loan Program helps existing micro businesses in its expansion and development by providing loans and empowering women micro entrepreneurs with below Php50,000 additional capital requirement.'
  },
  {
    title: 'Maunlad Loan Program',
    description: 'The Maunlad Loan aims to further assist graduated program members from its Kabalikat Loan Program and as well as new member from the micro enterprise segment by providing additional working capital to expand and further develop their existing businesses.'
  },
  {
    title: 'Masagana Loan Program',
    description: 'The Masagana Loan of KMBI exists to aid and develop the agricultural sector of the country by providing loans that will serve as working capital for farming or within the agricultural allied sector.'
  },
  {
    title: 'K-Flex Loan Program',
    description: 'The K-Flex Loan is a seasonal loan program that addresses the needs of the clients for additional capitalization for their existing business or new business opportunities, and thus ensuring capital accessibility.'
  },
  {
    title: 'K-Agapay Loan Program',
    description: 'The K-Agapay Loan is an add-on loan extended to qualified clients intended to fulfill the liquidity requirements of their business in case of unexpected and urgent events.'
  },
  {
    title: 'K-Silong Loan Program',
    description: 'The K-Silong Loan is an add-on loan program that provides clients access to affordable financing solutions to enhance their business facilities.'
  },
  {
    title: 'Micro-Insurance',
    description: 'Micro-insurance is an add-on service given to the program members of the organization. Along with the Group Loan and Capital Build-Up, all clients aged 18 to 63 years of old are required to enrol in this program to be protected in cases of death in the family. Offered under this service are death insurance and burial benefits.'
  },
  {
    title: 'Capital Build Up (CBU)',
    description: 'Capital Build-Up is an opportunity for program members to begin accumulating their own financial resources and lessen their vulnerability to crisis and dependence on outside credit sources. It is also a reserve fund that a member may use as additional capital for the existing business, or capital for a new business when she retires from the program.'
  },
  {
    title: 'Entrepreneurship Development',
    description: 'We provide more than just loans. Our Entrepreneurship Development Services (EDS) equip members with business management skills, financial literacy training, and leadership workshops to ensure their ventures thrive sustainably.'
  },
  {
    title: 'Wellness & Community',
    description: 'KMBI cares for the total well-being of its members. We offer Wellness Caravans, health education, and disaster preparedness training (DPRM) to build resilient families and communities.'
  },
]

import FeatureShowcase from '@/components/sections/FeatureShowcase'

export default function ServicesPage() {
  return (
    <>
      {/* Hero with Gradient and Grain */}
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
              Our Financial Solutions
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Services Built for <span className="text-[#4dd88f]">Growth</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Empowering Filipino entrepreneurs and families with accessible loans, insurance, and savings programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <FeatureShowcase />

      {/* Services List - Alternating Layout */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {service.title}
                </h2>
                <div className="w-20 h-1.5 bg-[#009245] rounded-full mx-auto lg:mx-0 opacity-80" />
                <p className="text-lg text-slate-600 leading-relaxed">
                  {service.description}
                </p>
                <Link href="/register">
                  <span className="inline-flex items-center gap-2 text-[#009245] font-semibold hover:gap-3 transition-all cursor-pointer mt-4">
                    Learn more <span className="text-xl">→</span>
                  </span>
                </Link>
              </div>

              {/* Image Placeholder */}
              <div className="flex-1 w-full">
                <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ${i % 2 === 0 ? 'rotate-2 hover:rotate-0' : '-rotate-2 hover:rotate-0'} transition-transform duration-500`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
                  {/* Placeholder for specific service image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 font-medium">
                    <span className="bg-white/80 backdrop-blur px-6 py-3 rounded-xl shadow-sm border border-slate-200">
                      {service.title} Image
                    </span>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
          <span className="text-[40rem] font-serif font-bold text-slate-900">“</span>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif italic text-slate-800 leading-tight mb-8">
              "It’s not how much money you make, but how much money you keep."
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-16 h-1 bg-[#009245] rounded-full mb-6" />
              <p className="text-lg font-bold text-slate-900 uppercase tracking-wide">Robert Kiyosaki</p>
              <p className="text-slate-500 text-sm">Japanese-American Businessman</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MobileCTA Component */}
      <MobileCTA />
    </>
  )
}
