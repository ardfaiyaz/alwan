'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const coreValues = [
    {
        title: 'Christian Faith',
        description:
            'We are a Christ-centered organization. We seek to honor God in all we do, trusting in His provision and guidance as we serve our communities.',
        image: '/images/values/community-first.png',
    },
    {
        title: "People's Well-being",
        description:
            'We prioritize the holistic development of our clients and staff. True prosperity includes physical, emotional, and spiritual health.',
        image: '/images/values/accessible.png',
    },
    {
        title: 'Good Governance',
        description:
            'We uphold the highest standards of integrity, transparency, and accountability in all our dealings. Access to finance requires trust.',
        image: '/images/values/transparent.png',
    },
    {
        title: 'Continuous Improvement',
        description:
            'We constantly innovate to serve you better. From digital apps to better loan products, we never stop finding ways to improve.',
        image: '/images/values/accessible.png',
    },
    {
        title: 'Teamwork',
        description:
            'We work together as one family. By supporting each other and our partners, we achieve greater impact for the communities we serve.',
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
                        Our Core Values
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        The Heart of{' '}
                        <span className="bg-gradient-to-r from-[#009245] to-[#4dd88f] bg-clip-text text-transparent">
                            KMBI
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                        Guided by faith and dedicated to service since 1986
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
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
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl bg-slate-100 border border-slate-200">
                                <Image
                                    src={value.image}
                                    alt={value.title}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out z-0 filter grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 z-10" />

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-8 z-20 text-left flex flex-col justify-end h-full">
                                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
