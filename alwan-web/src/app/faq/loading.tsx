/**
 * FAQ loading - Hero, filter pills, bento grid, mobile CTA skeleton.
 */

import { Skeleton } from '@/components/Skeleton'

export default function FAQLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/80 to-indigo-700/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Skeleton className="h-4 w-24 mx-auto bg-white/30" />
          <Skeleton className="h-14 w-full max-w-md mx-auto bg-white/30" />
          <Skeleton className="h-5 w-full max-w-xl mx-auto bg-white/30" />
        </div>
      </section>

      {/* Filter pills */}
      <section className="py-8 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-20 sm:w-24 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      {/* Bento grid - 4 cards, first and last span 2 cols on md */}
      <section className="py-12 lg:py-16 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Mobile CTA skeleton */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-violet-900/80 to-purple-600/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex-1 max-w-xl space-y-4">
            <Skeleton className="h-10 w-full bg-white/20" />
            <Skeleton className="h-4 w-3/4 bg-white/20" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36 rounded-lg bg-white/20" />
              <Skeleton className="h-12 w-32 rounded-lg bg-white/20" />
            </div>
          </div>
          <Skeleton className="w-48 h-[360px] rounded-3xl bg-white/20 shrink-0" />
        </div>
      </section>
    </div>
  )
}
