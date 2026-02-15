'use client'

import { motion } from 'framer-motion'

const reviews = [
    {
        name: 'Maria Santos',
        role: 'Small Business Owner',
        text: "Alwan helped me stock up my sari-sari store when I ran out of capital. Fast approval and easy to pay!",
        rating: 5
    },
    {
        name: 'Juan Dela Cruz',
        role: 'Freelancer',
        text: "The best lending app in the Philippines. Very transparent with fees and the interest rate is fair.",
        rating: 5
    },
    {
        name: 'Elena Reyes',
        role: 'Teacher',
        text: "Emergency funds when I needed them most. The app is so easy to use, even for non-techie people like me.",
        rating: 5
    },
    {
        name: 'Rico Magsaysay',
        role: 'Driver',
        text: "Tried other apps but Alwan is the only one that truly cares. Customer support is very helpful.",
        rating: 4
    },
    {
        name: 'Sofia Garcia',
        role: 'Student',
        text: "Helped cover my tuition fees for this semester. Very grateful for the quick disbursement.",
        rating: 5
    },
]

export default function Testimonials() {
    return (
        <section className="py-20 sm:py-28 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4"
                >
                    Trusted by Filipinos
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg sm:text-xl text-slate-600"
                >
                    Real stories from our growing community
                </motion.p>
            </div>

            <div className="relative w-full overflow-hidden mask-fade-sides">
                {/* Infinite Scroll Container */}
                <div className="flex w-max gap-6 animate-infinite-scroll pl-6">
                    {[...reviews, ...reviews].map((review, idx) => (
                        <div
                            key={idx}
                            className="w-[300px] sm:w-[400px] flex-shrink-0 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-1 mb-4 text-emerald-500">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-slate-600 mb-6 leading-relaxed font-sans">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                                    <p className="text-xs text-slate-500">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .mask-fade-sides {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    )
}
