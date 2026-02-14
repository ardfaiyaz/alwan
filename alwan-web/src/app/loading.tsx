/**
 * Root loading UI - Skeleton matching homepage layout: hero, why choose, video, how it works, logos, mobile CTA.
 */

import { Skeleton } from '@/components/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative pt-6 pb-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-teal-500/80" />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 py-16 lg:py-20 text-center">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            <Skeleton className="h-12 sm:h-14 lg:h-16 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-6 w-3/4 max-w-xl mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-36 rounded-xl" />
              <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
          </div>
          <div className="w-full max-w-6xl mx-auto mt-12 -mb-24 lg:-mb-32">
            <Skeleton className="w-full aspect-[27/10] rounded-3xl lg:rounded-5xl" />
          </div>
        </div>
      </section>

      {/* Why Choose - 3 cards */}
      <section className="py-20 bg-[#FAFAFA] pt-12 lg:pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10 space-y-4">
            <Skeleton className="h-4 w-28 mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm max-w-sm mx-auto md:max-w-none">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-24 mx-auto" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="py-24 bg-[#f5f0ff]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12 space-y-4">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-11 w-80 mx-auto" />
            <Skeleton className="h-4 w-full max-w-xl mx-auto" />
          </div>
          <Skeleton className="max-w-4xl mx-auto aspect-video rounded-2xl" />
        </div>
      </section>

      {/* How it Works - 3 circle cards */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="w-full max-w-[200px] aspect-square rounded-2xl mt-2" />
                  <Skeleton className="h-5 w-32 mt-4" />
                  <Skeleton className="h-3 w-40 mt-2" />
                </div>
                {i < 3 && <Skeleton className="hidden md:block h-6 w-6 mx-2" />}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Skeleton className="h-11 w-40 mx-auto rounded-lg" />
          </div>
        </div>
      </section>

      {/* Logos strip */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
        <div className="flex overflow-hidden gap-12 px-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 shrink-0 rounded" />
          ))}
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
          <Skeleton className="w-48 h-[420px] rounded-3xl bg-white/20 shrink-0" />
        </div>
      </section>
    </div>
  )
}
