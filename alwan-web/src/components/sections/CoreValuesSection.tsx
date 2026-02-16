'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

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

export default function CoreValuesSection() {
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                        Our Values
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Why{' '}
                        <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                            Choose{' '}
                        </span>
                        Alwan?
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                        Built on values that matter to Filipino communities
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                    {coreValues.map((value, idx) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative z-10 hover:z-50"
                        >
                            {/* Main Card Image Area */}
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100">
                                <Image
                                    src={value.image}
                                    alt={value.title}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out z-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                {/* Initial Title (Visible at bottom) */}
                                <div className="absolute bottom-10 left-0 w-full px-8 z-20 text-center md:text-left">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                        {value.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
