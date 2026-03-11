export function ApprovalsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Statistics Dashboard Skeleton */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-4">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg border p-4 h-20"></div>
          <div className="bg-white rounded-lg border p-4 h-20"></div>
        </div>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="w-32 h-10 bg-gray-200 rounded"></div>
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="w-24 h-10 bg-gray-200 rounded"></div>
            <div className="w-24 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded w-24 flex-shrink-0"></div>
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border-2 p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-20 h-10 bg-gray-200 rounded"></div>
                <div className="w-20 h-10 bg-gray-200 rounded"></div>
                <div className="w-20 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
