/**
 * Services loading - Hero, calculator widget, 4 service blocks, CTA skeleton.
 */

import { Skeleton } from '@/components/Skeleton'

export default function ServicesLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-4 w-28 mx-auto" />
            <Skeleton className="h-14 w-80 mx-auto" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </section>

      {/* Calculator section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <Skeleton className="h-9 w-48 mx-auto" />
            <Skeleton className="h-4 w-56 mx-auto" />
          </div>
          <Skeleton className="max-w-2xl mx-auto h-80 rounded-2xl" />
        </div>
      </section>

      {/* 4 Service sections - alternating layout */}
      <section className="py-24 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20`}
              >
                <div className="flex-1 w-full space-y-4">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
                <Skeleton className="flex-1 w-full max-w-md aspect-square rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Skeleton className="h-12 w-48 mx-auto rounded-xl" />
        </div>
      </section>
    </div>
  )
}
