'use client'

import { motion } from 'framer-motion'
import { PiggyBank, TrendingUp, Shield, Sparkles, Target, Calendar } from 'lucide-react'
import Image from 'next/image'

const savingsFeatures = [
  {
    icon: PiggyBank,
    title: 'Capital Build-Up (CBU)',
    description: 'Automatically save a portion of your loan for future security. Build your financial cushion effortlessly.',
    color: 'from-emerald-500 to-teal-600',
    stat: '₱500',
    statLabel: 'Min. Monthly'
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Savings',
    description: 'Watch your savings grow with competitive interest rates. Your money works harder for you.',
    color: 'from-blue-500 to-cyan-600',
    stat: '3.5%',
    statLabel: 'Annual Interest'
  },
  {
    icon: Shield,
    title: 'Secure & Protected',
    description: 'Your savings are safe and insured. Access your funds anytime through our mobile app.',
    color: 'from-purple-500 to-pink-600',
    stat: '100%',
    statLabel: 'Secured'
  }
]

const savingsBenefits = [
  {
    icon: Target,
    title: 'Set Savings Goals',
    description: 'Create custom savings goals for your dreams - education, business expansion, or emergencies.'
  },
  {
    icon: Calendar,
    title: 'Flexible Terms',
    description: 'Choose your savings schedule that fits your income flow. Weekly, bi-weekly, or monthly.'
  },
  {
    icon: Sparkles,
    title: 'Bonus Rewards',
    description: 'Earn bonus interest for consistent savings. The more you save, the more you earn.'
  }
]

export default function SavingsSection() {
  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6"
          >
            <PiggyBank className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Smart Savings</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Save While You{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Borrow
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Build your financial future with our integrated savings program. Every loan helps you save automatically.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {savingsFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="relative bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Stat */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}>
                      {feature.stat}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      {feature.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Showcase - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left: Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Placeholder for savings app screenshot */}
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-6">
                    <PiggyBank className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Savings Dashboard</h3>
                  <p className="text-slate-600">Track your progress in real-time</p>
                  
                  {/* Mock savings stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm mx-auto">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <p className="text-sm text-slate-500 mb-1">Total Saved</p>
                      <p className="text-2xl font-bold text-emerald-600">₱12,450</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <p className="text-sm text-slate-500 mb-1">This Month</p>
                      <p className="text-2xl font-bold text-blue-600">₱1,500</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500 rounded-full blur-2xl opacity-20" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-full blur-2xl opacity-20" />
            </div>
          </motion.div>

          {/* Right: Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-8">
              More Ways to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Save Smart
              </span>
            </h3>
            
            {savingsBenefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {benefit.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="flex-1 text-left">
              <h4 className="text-2xl font-bold text-slate-900 mb-2">
                Start Saving Today
              </h4>
              <p className="text-slate-600">
                Open your account and begin building your financial security
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap">
              Learn More About Savings
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
