/**
 * Register loading - One section: left (title, steps, buttons), right (mockup) skeleton.
 */

import { Skeleton } from '@/components/ui/Skeleton'

export default function RegisterLoading() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-[#F0FDF4]">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 h-[600px]">
        <Skeleton className="w-full h-full rounded-3xl" />
        <Skeleton className="w-full h-full rounded-3xl hidden lg:block" />
      </div>
    </section>
  )
}
