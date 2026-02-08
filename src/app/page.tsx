'use client'

/**
 * Homepage - Alwan Microfinance
 * Sections: Hero, Why Choose Alwan, See Alwan in Action (video), How it Works, Mobile CTA
 */

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/MagneticButton'
import MobileCTA from '@/components/MobileCTA'
import { ChevronDown } from 'lucide-react'

// Core value cards data for "Why Choose Alwan"
const coreValues = [
	{
		title: 'Accessible',
		description:
			'We believe every Filipino deserves access to financial services. No complex requirements, no hidden fees—just straightforward solutions that work for you.',
		image: '/images/values-accessible.jpg',
	},
	{
		title: 'Transparent',
		description:
			'Clear terms, honest rates, and full disclosure. We build trust through transparency in every transaction. What you see is what you get.',
		image: '/images/values-transparent.jpg',
	},
	{
		title: 'Community-First',
		description:
			'Rooted in Philippine values of bayanihan. We grow together with our communities across the islands. Your success is our success.',
		image: '/images/values-community.jpg',
	},
]

// How it Works steps (3 steps with visual type)
const howItWorksSteps = [
	{
		num: '01',
		title: 'Fill Application',
		desc: 'Complete our quick online form in under 5 minutes',
		visual: 'speckled' as const,
	},
	{
		num: '02',
		title: 'Get Approved',
		desc: 'Receive instant approval decision from our AI system',
		visual: 'speckled' as const,
	},
	{
		num: '03',
		title: 'Receive Funds',
		desc: 'Money transferred directly to your account within hours',
		visual: 'gradient' as const,
	},
]

// YouTube embed ID from link: youtu.be/pbXJBmTrE-U
const YOUTUBE_EMBED_ID = 'pbXJBmTrE-U'

export default function HomePage() {
	return (
		<>
			{/* ========== HERO: Gradient background, all content centered, image below buttons with border radius (half overlapping) ========== */}
			<section className="relative pt-6 pb-0 overflow-hidden">
				{/* Gradient background: violet-dominant */}
				<div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-teal-500" />

				{/* Centered content: title, paragraph, buttons */}
				<div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 py-16 lg:py-20 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="max-w-3xl mx-auto"
					>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
							Agarang Alwan para sa iyong pangarap!
						</h1>
						<p className="text-lg md:text-xl text-white/95 mb-10">
							Get instant access to funds with our quick and secure microfinance
							solutions. No hassle, no hidden fees.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link href="/register">
								<MagneticButton className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-80 transition-colors cursor-pointer shadow-lg">
									Get started
								</MagneticButton>
							</Link>
							<Link href="#why-choose-alwan">
                  <MagneticButton
                      onClick={() => {
                          document
                              .getElementById('why-choose-alwan')
                              ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full sm:w-auto px-4 py-4 font-medium rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                  >
                      <span className="text-white">Learn more</span>
                      <ChevronDown className="w-5 h-5 text-white" />
                  </MagneticButton>
              </Link>
						</div>
					</motion.div>

					{/* Image below buttons: half overlapping into next section, with border radius */}
					<div className="relative w-full max-w-6xl mx-auto mt-12 -mb-24 lg:-mb-32 z-20">
						<div className="relative w-full aspect-[27/10] rounded-4xl lg:rounded-6xl overflow-hidden shadow-2xl">
							<Image
								src="/images/hero-family.png"
								alt="Family looking at smartphone - Alwan microfinance"
								fill
								className="object-cover object-center"
								sizes="(max-width: 1704px) 100vw, 896px"
								priority
							/>
						</div>
					</div>
				</div>
			</section>

			{/* ========== WHY CHOOSE ALWAN: Small title + main heading with gradient Alwan ========== */}
			<section
				id="why-choose-alwan"
				className="py-20 bg-[#FAFAFA] pt-12 lg:pt-18 scroll-mt-22"
			>
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-10"
					>
						<p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text text-transparent">
							Why choose us
						</p>
						<h2 className="text-3xl md:text-4xl font-bold text-slate-900">
							Why Choose{' '}
							<span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
								Alwan
							</span>
							?
						</h2>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-5">
						{coreValues.map((value, i) => (
							<motion.div
								key={value.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col max-w-sm mx-auto md:max-w-none"
							>
								<div className="aspect-[4/3] bg-[#FAFAFA] flex items-center justify-center text-slate-500 text-sm">
									Add image
								</div>
								<div className="p-4 flex-1 text-center">
									<h3 className="text-lg font-bold text-slate-900 mb-2">
										{value.title}
									</h3>
									<p className="text-slate-600 text-sm leading-relaxed">
										{value.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ========== SEE ALWAN IN ACTION: Light lavender, SEE IT IN ACTION, Discover How Alwan Works ========== */}
			<section className="py-24 bg-[#f5f0ff]">
				<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<p className="text-sm font-medium uppercase tracking-wider mb-4 bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text text-transparent">
							See it in action
						</p>
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
							Discover How Alwan Works
						</h2>
						<p className="text-slate-600 max-w-2xl mx-auto text-md">
							Watch how Alwan is transforming communities across the Philippines
							with accessible financial tools and microloans that uplift families.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="rounded-2xl overflow-hidden max-w-4xl mx-auto aspect-video shadow-xl border border-slate-200/50"
					>
						<iframe
							title="Alwan in Action - YouTube video"
							src={`https://www.youtube.com/embed/${YOUTUBE_EMBED_ID}?autoplay=0&controls=1`}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="w-full h-full"
						/>
					</motion.div>
				</div>
			</section>

			{/* ========== HOW IT WORKS: 3 steps with arrows ========== */}
			<section className="py-24 bg-white">
				<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
							How it Works
						</h2>
					</motion.div>

					<div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4">
						{howItWorksSteps.map((step, i) => (
							<motion.div
								key={step.num}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="flex items-center"
							>
								<div className="flex flex-col items-center flex-1">
									<span className="text-5xl md:text-6xl font-bold text-slate-300 -mb-4 relative z-10">
										{step.num}
									</span>
									<div
										className={`w-full max-w-[200px] aspect-square rounded-2xl border border-slate-200/80 shadow-sm ${
											step.visual === 'gradient'
												? 'bg-gradient-to-br from-teal-400 to-amber-400'
												: step.visual === 'speckled'
												? 'speckled-bg'
												: 'bg-amber-100'
										}`}
									/>
									<h3 className="text-lg font-bold text-slate-900 mt-4 text-center">
										{step.title}
									</h3>
									<p className="text-sm text-slate-500 mt-2 text-center max-w-[220px]">
										{step.desc}
									</p>
								</div>
								{i < howItWorksSteps.length - 1 && (
									<div className="hidden md:flex items-center justify-center px-2 py-8 self-center">
										<span className="text-2xl text-slate-300">→</span>
									</div>
								)}
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className="text-center mt-12"
					>
						<Link href="/register">
							<MagneticButton className="px-6 py-3 bg-gradient-to-r from-teal-500 to-violet-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
								Start Your Journey
							</MagneticButton>
						</Link>
					</motion.div>
				</div>
			</section>

			{/* ========== AFFILIATED COMPANIES: Horizontal scrolling logos ========== */}
			<section className="py-16 bg-slate-50 border-y border-slate-100 overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className="text-center text-slate-500 font-medium text-sm uppercase tracking-wider"
					>
						Companies affiliated with Alwan
					</motion.p>
				</div>
				<div className="relative w-full">
					<div className="flex logo-scroll-track w-max gap-16 px-8">
						{[...Array(2)].map((_, setIndex) => (
							<div key={setIndex} className="flex gap-16 shrink-0 items-center">
								{[
									{ name: 'Partner One', id: 1 },
									{ name: 'Partner Two', id: 2 },
									{ name: 'Partner Three', id: 3 },
									{ name: 'Partner Four', id: 4 },
									{ name: 'Partner Five', id: 5 },
								].map((logo) => (
									<div
										key={`${setIndex}-${logo.id}`}
										className="flex-shrink-0 w-32 h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium shadow-sm"
										aria-hidden
									>
										{logo.name}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ========== MOBILE CTA: White rounded section + store buttons (image-style) + phone mockup ========== */}
			<MobileCTA />
		</>
	)
}
