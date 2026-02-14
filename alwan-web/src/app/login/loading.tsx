/**
 * Login loading - Split layout: left panel (brand), right form card skeleton.
 */

import { Skeleton } from '@/components/Skeleton'

export default function LoginLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel - brand */}
      <div className="hidden lg:flex lg:w-[38%] xl:w-[36%] bg-slate-700 items-center justify-center px-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-32 mx-auto rounded-lg bg-white/20" />
          <Skeleton className="h-5 w-48 mx-auto bg-white/20" />
        </div>
      </div>

      {/* Right: form card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-16 bg-slate-50">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex justify-end">
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
          <p className="text-center text-sm text-slate-500">
            <Skeleton className="h-4 w-56 mx-auto inline-block" />
          </p>
        </div>
      </div>
    </div>
  )
}
