'use client'

import { Skeleton } from '@/components/Skeleton'

export default function ServicesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Hero Skeleton */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Skeleton width="120px" height="20px" className="mx-auto mb-4" />
        <Skeleton width="80%" height="60px" className="mx-auto mb-6" />
        <Skeleton width="60%" height="24px" className="mx-auto" />
      </div>

      {/* Services List Skeleton */}
      <div className="space-y-24 mt-24">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
            <div className="flex-1 space-y-4">
              <Skeleton width="40%" height="40px" />
              <Skeleton width="100%" height="20px" />
              <Skeleton width="90%" height="20px" />
              <Skeleton width="80%" height="20px" />
            </div>
            <div className="flex-1 w-full max-w-md aspect-square">
              <Skeleton width="100%" height="100%" borderRadius="1.5rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
