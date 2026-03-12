export function ApprovalsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded w-32 sm:w-40 lg:w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-48 sm:w-56 lg:w-64"></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-20 sm:w-24 h-10 bg-gray-200 rounded"></div>
          <div className="w-16 sm:w-20 h-10 bg-gray-200 rounded"></div>
          <div className="w-16 sm:w-20 h-10 bg-gray-200 rounded"></div>
          <div className="w-20 sm:w-24 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Search and Sort Skeleton */}
      <div className="bg-white rounded-lg border p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-200 rounded"></div>
            <div className="w-12 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="relative">
        <div className="inline-flex w-full bg-white border border-gray-200 p-1 rounded-lg gap-1">
          {['Pending', 'Review', 'Approved', 'Rejected', 'All'].map((tab, i) => (
            <div 
              key={i} 
              className="flex-1 h-10 bg-gray-200 rounded"
            ></div>
          ))}
        </div>
      </div>

      {/* Application Cards Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border-2 border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left side: Checkbox and Content */}
              <div className="flex gap-3 flex-1">
                <div className="w-5 h-5 bg-gray-200 rounded mt-1 flex-shrink-0"></div>
                
                <div className="flex-1 space-y-3">
                  {/* Name and Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side: Action Buttons */}
              <div className="flex lg:flex-col gap-2 flex-wrap lg:flex-nowrap lg:w-auto">
                <div className="flex-1 lg:flex-none lg:w-28 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 lg:flex-none lg:w-28 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 lg:flex-none lg:w-28 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 lg:flex-none lg:w-28 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
          <span className="text-sm">Loading applications...</span>
        </div>
      </div>
    </div>
  )
}
