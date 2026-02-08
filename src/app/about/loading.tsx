/**
 * About loading - Hero (mission), core values grid, team grid skeleton.
 */

import { Skeleton } from '@/components/Skeleton'

export default function AboutLoading() {
  return (
    <div className="min-h-screen">
      {/* Section 1: Mission intro */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-14 w-full max-w-2xl" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-6 w-full mt-6" />
          </div>
        </div>
      </section>

      {/* Section 2: Core values - 3 cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-10 w-56 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="aspect-square max-w-xs mx-auto rounded-2xl" />
                <Skeleton className="h-6 w-28 mx-auto mt-4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6 mx-auto mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Team - 3 developers */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <Skeleton className="aspect-square w-full max-w-[240px] rounded-2xl" />
                <Skeleton className="h-5 w-40 mt-4" />
                <Skeleton className="h-4 w-28 mt-2" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
