/**
 * Services loading - Hero, calculator widget, 4 service blocks, CTA skeleton.
 */

import { Skeleton } from '@/components/Skeleton'

export default function ServicesLoading() {
  return (
    <div className="min-h-screen space-y-16 pb-20">
      {/* Hero Block */}
      <section className="h-[60vh] w-full bg-[#F0FDF4] animate-pulse" />

      {/* Calculator Block */}
      <div className="max-w-4xl mx-auto px-4 w-full">
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>

      {/* Service Blocks */}
      <div className="max-w-7xl mx-auto px-4 w-full space-y-12">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-80 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
