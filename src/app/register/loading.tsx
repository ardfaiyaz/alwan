/**
 * Register loading - One section: left (title, steps, buttons), right (mockup) skeleton.
 */

import { Skeleton } from '@/components/Skeleton'

export default function RegisterLoading() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center py-12 lg:py-16 px-4 sm:px-6 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left: title, steps, CTAs */}
        <div className="flex-1 w-full max-w-lg space-y-6">
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-5 w-full" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>

        {/* Right: mobile mockup */}
        <Skeleton className="w-52 h-[420px] rounded-[1.75rem] shrink-0" />
      </div>
    </section>
  )
}
