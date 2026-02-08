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
import { useRef, useEffect, useState } from 'react'

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

// Component for animated abstract patterns
const AbstractPatterns = () => {
	return (
		<>
			{/* SVG Animated lines and dots */}
			<svg
				className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
				viewBox="0 0 1200 800"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<linearGradient id="gradientLine1" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
						<stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
					</linearGradient>
					<linearGradient id="gradientLine2" x1="100%" y1="0%" x2="0%" y2="0%">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
						<stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
					</linearGradient>
				</defs>

				{/* Horizontal and vertical lines */}
				<line x1="10%" y1="20%" x2="90%" y2="20%" stroke="url(#gradientLine1)" strokeWidth="1" />
				<line x1="10%" y1="50%" x2="90%" y2="50%" stroke="url(#gradientLine2)" strokeWidth="1" />
				<line x1="20%" y1="5%" x2="20%" y2="95%" stroke="url(#gradientLine1)" strokeWidth="1" />
				<line x1="80%" y1="5%" x2="80%" y2="95%" stroke="url(#gradientLine2)" strokeWidth="1" />

				{/* Circles at intersections */}
				<circle cx="20%" cy="20%" r="3" fill="#ffffff" opacity="0.3" />
				<circle cx="80%" cy="20%" r="3" fill="#ffffff" opacity="0.2" />
				<circle cx="20%" cy="50%" r="3" fill="#ffffff" opacity="0.25" />
				<circle cx="80%" cy="50%" r="3" fill="#ffffff" opacity="0.15" />
			</svg>

			{/* Animated floating particles */}
			<motion.div
				animate={{
					y: [0, -100, 0],
					opacity: [0.2, 0.6, 0.2],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className="absolute top-20 left-32 w-3 h-3 bg-white rounded-full blur-sm"
			/>
			<motion.div
				animate={{
					y: [0, 80, 0],
					opacity: [0.3, 0.7, 0.3],
				}}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 0.3,
				}}
				className="absolute top-40 right-40 w-3 h-3 bg-white rounded-full blur-sm"
			/>
			<motion.div
				animate={{
					y: [0, -60, 0],
					opacity: [0.25, 0.65, 0.25],
				}}
				transition={{
					duration: 4.5,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 0.6,
				}}
				className="absolute bottom-20 left-3/4 w-3 h-3 bg-white rounded-full blur-sm"
			/>
		</>
	)
}

export default function HomePage() {
	const [scrollProgress, setScrollProgress] = useState(0)
	const sectionRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleScroll = () => {
			if (!sectionRef.current) return

			const scrollY = window.scrollY
			const windowHeight = window.innerHeight
			const sectionTop = sectionRef.current.getBoundingClientRect().top + scrollY
			const sectionHeight = sectionRef.current.offsetHeight

			// Calculate how far into the section we are
			const sectionStart = sectionTop - windowHeight / 2
			const sectionEnd = sectionTop + sectionHeight - windowHeight / 2

			// Get progress from 0 to 1
			const progress = Math.max(0, Math.min(1, (scrollY - sectionStart) / (sectionEnd - sectionStart)))

			setScrollProgress(progress)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])
	return (
		<>
			{/* ========== HERO: Split layout - Left: Text & Buttons, Right: Phone Mockup ========== */}
			<section className="relative min-h-screen flex flex-col items-stretch overflow-hidden bg-gradient-to-r from-teal-500 to-violet-600">
				{/* Abstract animated patterns background */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<AbstractPatterns />

					{/* Multiple animated background glows */}
					<motion.div
						animate={{
							scale: [1, 1.3, 1],
							opacity: [0.2, 0.3, 0.2],
						}}
						transition={{
							duration: 7,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
						className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
					/>
					<motion.div
						animate={{
							scale: [1.2, 1, 1.2],
							opacity: [0.2, 0.3, 0.2],
						}}
						transition={{
							duration: 8,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 1,
						}}
						className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
					/>
				</div>

				{/* Content wrapper */}
				<div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex-1 flex flex-col">
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center flex-1 lg:items-stretch">
						{/* LEFT SIDE - Text, Title, Buttons */}
						<motion.div
							initial={{ opacity: 0, x: -40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="flex flex-col justify-center text-center lg:text-left text-white pt-12 lg:pt-0"
						>
							<h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight mb-6">
								Agarang Alwan para sa iyong pangarap!
							</h1>
							<p className="text-lg md:text-lg text-white/95 mb-8">
								Get instant access to funds with our quick and secure microfinance
								solutions. No hassle, no hidden fees.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
								<Link href="/register">
									<MagneticButton className="px-8 py-4 bg-white text-teal-600 font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-lg">
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
										className="px-6 py-4 font-medium rounded-xl border-2 border-white text-white hover:bg-white/10 transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
									>
										<span className="text-white">Learn more</span>
										<ChevronDown className="w-5 h-5 text-white" />
									</MagneticButton>
								</Link>
							</div>
						</motion.div>

						{/* RIGHT SIDE - Phone Mockup */}
						<motion.div
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative flex items-end justify-center"
						>
							{/* Phone mockup container */}
							<div className="relative w-48 sm:w-52 md:w-60 lg:w-80">
								{/* Phone frame */}
								<div className="relative bg-transparent rounded-[2.5rem] overflow-hidden border-[12px] border-slate-900 ring-4 ring-slate-800/50 aspect-[9/16] phone-shadow">
									{/* Phone content */}
									<div className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex flex-col pt-6 px-4">
										{/* Header with avatar */}
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
											className="flex items-center justify-between mb-4"
										>
											<div>
												<h2 className="text-white font-bold text-lg">Welcome Back!</h2>
												<p className="text-white/60 text-xs">Manage your finances with Alwan</p>
											</div>
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">👤</div>
										</motion.div>

										{/* Available Credit Section */}
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4 }}
											className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 mb-4 border border-slate-700"
										>
											<p className="text-white/70 text-xs mb-2">Available Credit</p>
											<h3 className="text-white font-bold text-2xl mb-3">₱5,000</h3>
											<div className="flex items-center justify-between mb-3">
												<span className="text-white/60 text-xs">Good Credit</span>
												<span className="text-teal-400 text-xs font-semibold">₱5,000 of ₱10,000</span>
											</div>
											<div className="w-full bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
												<div className="h-full w-1/2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />
											</div>
											<button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-bold text-xs hover:shadow-lg transition-shadow">Increase Credit Limit</button>
										</motion.div>

										{/* Amount Due */}
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
											className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-4 mb-4"
										>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-white/80 text-xs mb-1">Amount Due</p>
													<h3 className="text-white font-bold text-xl">₱ 6,000</h3>
												</div>
												<div className="text-right">
													<p className="text-white/80 text-xs mb-1">Next Payment</p>
													<p className="text-white font-bold text-xs">Apr 04, 2026</p>
												</div>
											</div>
										</motion.div>

										{/* Bills List */}
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.6 }}
											className="space-y-2 flex-1 mb-4"
										>
											<div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
												<span className="text-white/70">Internet Bill</span>
												<span className="text-white font-semibold">₱999</span>
											</div>
											<div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
												<span className="text-white/70">Phone Bill</span>
												<span className="text-white font-semibold">₱499</span>
											</div>
											<div className="flex items-center justify-between text-xs">
												<span className="text-white/70">Water Bill</span>
												<span className="text-white font-semibold">₱350</span>
											</div>
										</motion.div>

										{/* Quick Action Button */}
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-bold text-sm hover:shadow-lg transition-shadow"
										>
											Pay Now
										</motion.button>
									</div>
								</div>
							</div>
						</motion.div>
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

			{/* ========== HOW IT WORKS: Scroll-linked 3 steps with phone mockup ========== */}
			<section ref={sectionRef} className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
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

					{/* Grid: Left side (steps hidden on mobile) + Right side (phone) */}
					<div className="grid lg:grid-cols-3 gap-8 items-start">
						{/* LEFT SIDE: Step indicators (hidden on mobile) */}
						<div className="hidden lg:flex lg:col-span-1 flex-col justify-start gap-6 pt-4">
							{howItWorksSteps.map((step, idx) => {
								const stepProgress = scrollProgress >= idx && scrollProgress < idx + 1 ? Math.min(1, (scrollProgress - idx)) : scrollProgress >= idx + 1 ? 1 : 0
								return (
									<motion.div
										key={step.num}
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: idx * 0.1 }}
										className="flex gap-4 items-start"
									>
										<div className="relative flex flex-col items-center pt-2 flex-shrink-0">
											{/* Step circle */}
											<motion.div
												animate={{
													backgroundColor: stepProgress >= 0.5 ? '#14b8a6' : '#e2e8f0',
													scale: stepProgress >= 0.5 ? 1.15 : 1,
												}}
												transition={{ type: 'spring', stiffness: 300, damping: 30 }}
												className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 border-slate-300 flex-shrink-0"
											>
												<motion.span
													animate={{ color: stepProgress >= 0.5 ? '#ffffff' : '#64748b' }}
													transition={{ type: 'spring', stiffness: 300, damping: 30 }}
												>
													{step.num}
												</motion.span>
											</motion.div>

											{/* Connector line */}
											{idx < howItWorksSteps.length - 1 && (
												<motion.div
													animate={{ backgroundColor: stepProgress >= 1 ? '#14b8a6' : '#e2e8f0' }}
													transition={{ type: 'spring', stiffness: 300, damping: 30 }}
													className="w-1.5 h-20 rounded-full mt-2"
												/>
											)}
										</div>

										{/* Step text */}
										<div className="flex-1">
											<motion.h3
												animate={{ color: stepProgress >= 0.5 ? '#0f172a' : '#94a3b8' }}
												transition={{ type: 'spring', stiffness: 300, damping: 30 }}
												className="text-lg font-bold"
											>
												{step.title}
											</motion.h3>
											<p className="text-sm text-slate-500 mt-1">{step.desc}</p>
										</div>
									</motion.div>
								)
							})}
						</div>

						{/* RIGHT SIDE: Phone mockup (full width on mobile, hidden indicators) */}
						<div className="lg:col-span-2 col-span-full flex justify-center">
							<div className="relative w-full max-w-xs">
								{/* Phone frame */}
								<div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden border-[12px] border-slate-900 ring-4 ring-slate-800/50 aspect-[9/16] phone-shadow">
									{/* Phone content - Changes based on scroll */}
									<div className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex flex-col pt-8 px-4">
										{/* Step 1: Fill Application */}
										<motion.div
											initial={{ opacity: 0 }}
											animate={{
												opacity: scrollProgress < 1 ? 1 : 0,
											}}
											transition={{ duration: 0.4 }}
											className="flex flex-col h-full justify-center items-center text-center"
										>
											<div className="text-5xl mb-4">📝</div>
											<h3 className="text-white font-bold text-lg mb-2">Fill Application</h3>
											<p className="text-white/60 text-sm">Complete our quick online form in under 5 minutes</p>
											<div className="mt-6 w-full space-y-2">
												<div className="h-2 bg-slate-700 rounded-full" />
												<div className="h-2 bg-slate-700 rounded-full w-3/4" />
												<div className="h-2 bg-slate-700 rounded-full w-1/2" />
											</div>
										</motion.div>

										{/* Step 2: Get Approved */}
										<motion.div
											initial={{ opacity: 0 }}
											animate={{
												opacity: scrollProgress >= 1 && scrollProgress < 2 ? 1 : 0,
											}}
											transition={{ duration: 0.4 }}
											className="flex flex-col h-full justify-center items-center text-center absolute inset-0 px-4 pt-8"
										>
											<div className="text-5xl mb-4">✓</div>
											<h3 className="text-white font-bold text-lg mb-2">Get Approved</h3>
											<p className="text-white/60 text-sm">Receive instant approval decision from our AI system</p>
											<div className="mt-6 w-full space-y-3">
												<motion.div
													animate={{ scaleX: [0, 1] }}
													transition={{ duration: 1.5, delay: 0.2 }}
													className="h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold"
													style={{ transformOrigin: 'left' }}
												>
													APPROVED ✓
												</motion.div>
											</div>
										</motion.div>

										{/* Step 3: Receive Funds */}
										<motion.div
											initial={{ opacity: 0 }}
											animate={{
												opacity: scrollProgress >= 2 ? 1 : 0,
											}}
											transition={{ duration: 0.4 }}
											className="flex flex-col h-full justify-center items-center text-center absolute inset-0 px-4 pt-8"
										>
											<div className="text-5xl mb-4">💰</div>
											<h3 className="text-white font-bold text-lg mb-2">Receive Funds</h3>
											<p className="text-white/60 text-sm">Money transferred directly to your account within hours</p>
											<div className="mt-6 text-center">
												<p className="text-teal-400 text-2xl font-bold">₱50,000</p>
												<p className="text-white/60 text-xs mt-2">Transferred successfully</p>
											</div>
										</motion.div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* CTA Button */}
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
