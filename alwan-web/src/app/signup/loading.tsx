import { Skeleton } from '@/components/ui/Skeleton'

export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Decorative Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-200/40 to-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-teal-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-bl from-emerald-300/20 to-green-400/10 rounded-full blur-3xl" />
      </div>

      {/* Back Button Skeleton */}
      <div className="fixed top-6 right-6 z-20">
        <Skeleton className="h-10 w-40 rounded-full bg-gray-200" />
      </div>

      {/* Main Container */}
      <div className="min-h-screen flex flex-col">
        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-20">
          <div className="w-full max-w-[1600px] mx-auto">
            <div className="grid lg:grid-cols-[45%_55%] gap-20 lg:gap-32 items-center">
              {/* Left Side - Carousel Skeleton */}
              <div className="hidden lg:flex flex-col items-center justify-center relative py-12">
                <div className="relative w-full h-[600px] flex items-center justify-center">
                  {/* Main Title Skeleton */}
                  <div className="text-center px-8 space-y-4">
                    <Skeleton className="h-16 w-96 mx-auto bg-gray-200 rounded-xl" />
                    <Skeleton className="h-6 w-80 mx-auto bg-gray-200 rounded-lg" />
                  </div>
                </div>

                {/* Legal Links Skeleton */}
                <div className="flex items-center justify-center gap-8 mt-16">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full bg-gray-200" />
                      <Skeleton className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Form Skeleton */}
              <div className="w-full max-w-2xl mx-auto lg:mx-0">
                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 lg:p-12 space-y-6">
                  {/* Logo Skeleton */}
                  <div className="flex justify-center mb-6">
                    <Skeleton className="h-10 w-32 bg-gray-200 rounded" />
                  </div>

                  {/* Header Skeleton */}
                  <div className="text-center mb-8 space-y-3">
                    <Skeleton className="h-8 w-64 mx-auto bg-gray-200 rounded-lg" />
                    <Skeleton className="h-5 w-80 mx-auto bg-gray-200 rounded" />
                  </div>

                  {/* Form Fields Skeleton */}
                  <div className="space-y-5">
                    <div>
                      <Skeleton className="h-4 w-32 mb-2 bg-gray-200 rounded" />
                      <Skeleton className="h-12 w-full bg-gray-200 rounded-xl" />
                    </div>
                    <Skeleton className="h-20 w-full bg-gray-200 rounded-xl" />
                  </div>

                  {/* Button Skeleton */}
                  <Skeleton className="h-14 w-full bg-gray-200 rounded-full" />

                  {/* Divider */}
                  <div className="relative flex items-center gap-4 py-2">
                    <Skeleton className="flex-grow h-px bg-gray-200" />
                    <Skeleton className="h-4 w-8 bg-gray-200 rounded" />
                    <Skeleton className="flex-grow h-px bg-gray-200" />
                  </div>

                  {/* Secondary Button Skeleton */}
                  <Skeleton className="h-12 w-full bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Contact Skeleton */}
        <div className="relative z-10 pb-10">
          <div className="max-w-2xl mx-auto px-6">
            <Skeleton className="h-16 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
