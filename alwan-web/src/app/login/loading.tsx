/**
 * Login loading - Split layout: left panel (brand), right form card skeleton.
 */

import { Skeleton } from '@/components/Skeleton'

export default function LoginLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel - brand */}
      <div className="hidden lg:flex lg:w-[38%] xl:w-[36%] bg-[#009245] p-12">
        <Skeleton className="w-full h-full bg-white/10 rounded-3xl" />
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Skeleton className="w-full max-w-md h-[500px] rounded-3xl" />
      </div>
    </div>
  )
}
