/**
 * FAQ loading - Hero, filter pills, bento grid, mobile CTA skeleton.
 */

import { Skeleton } from '@/components/ui/Skeleton'

export default function FAQLoading() {
  return (
    <div className="min-h-screen space-y-8 pb-20">
      {/* Hero Block */}
      <section className="h-[50vh] w-full bg-[#F0FDF4] animate-pulse" />

      {/* Grid Blocks */}
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
