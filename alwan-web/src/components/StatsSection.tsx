'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const stats = [
    { label: 'Active Users', value: 500000, suffix: '+' },
    { label: 'Loans Disbursed', value: 1000000000, prefix: '₱', suffix: '+' },
    { label: 'App Store Rating', value: 4.8, suffix: '/5' },
    { label: 'Years of Service', value: 5, suffix: '+' },
]

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
    const [count, setCount] = useState(from)
    const nodeRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const node = nodeRef.current
        if (!node) return

        let startTime: number | null = null
        let animationFrame: number

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

            // Easing function for smooth deceleration
            const value = Math.floor(progress * (to - from) + from)
            setCount(value)

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step)
            }
        }

        animationFrame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(animationFrame)
    }, [from, to, duration])

    return <span ref={nodeRef}>{count.toLocaleString()}</span>
}

export default function StatsSection() {
    return (
        <section className="py-12 sm:py-16 bg-[#009245] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="px-4"
                        >
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 font-sans tracking-tight">
                                {stat.prefix}
                                <Counter from={0} to={stat.value} />
                                {stat.suffix}
                            </div>
                            <div className="text-white/80 text-sm sm:text-base font-medium uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
