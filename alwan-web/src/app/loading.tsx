/**
 * Root loading UI - Skeleton matching homepage layout: hero, why choose, video, how it works, logos, mobile CTA.
 */

import { Skeleton } from '@/components/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen space-y-8 pb-20">
      {/* Hero Block */}
      <section className="h-[85vh] w-full bg-[#F0FDF4] animate-pulse" />

      {/* Content Blocks - simple sections */}
      <div className="max-w-7xl mx-auto px-4 w-full space-y-16">
        <Skeleton className="h-96 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
