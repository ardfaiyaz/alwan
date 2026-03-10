import { Skeleton } from '@/components/ui/Skeleton'

export default function TermsAndConditionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button Skeleton */}
        <Skeleton className="h-6 w-20 mb-8 bg-gray-200" />

        {/* Title Skeleton */}
        <Skeleton className="h-10 w-80 mb-4 bg-gray-200" />
        <Skeleton className="h-4 w-40 mb-8 bg-gray-200" />

        {/* Content Skeletons */}
        <div className="space-y-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-7 w-72 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-2/3 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
