/**
 * About loading - Hero (mission), core values grid, team grid skeleton.
 */

import { Skeleton } from '@/components/ui/Skeleton'

export default function AboutLoading() {
  return (
    <div className="min-h-screen space-y-8 pb-20">
      {/* Hero Block */}
      <section className="h-[60vh] w-full bg-[#F0FDF4] animate-pulse" />

      {/* Content Blocks */}
      <div className="max-w-7xl mx-auto px-4 w-full space-y-12">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
