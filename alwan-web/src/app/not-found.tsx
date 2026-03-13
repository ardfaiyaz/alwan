import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Large 404 Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[20rem] sm:text-[25rem] md:text-[30rem] lg:text-[35rem] font-bold text-gray-100 select-none leading-none">
            404
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Divider Line */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#009245] to-transparent mb-8"></div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4dd88f] to-[#009245] hover:from-[#009245] hover:to-[#056633] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:border-[#009245] text-gray-700 hover:text-[#009245] font-semibold rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Here are some useful links:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link href="/about" className="text-[#009245] hover:text-[#056633] hover:underline transition-colors duration-200">
                About Us
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/faq" className="text-[#009245] hover:text-[#056633] hover:underline transition-colors duration-200">
                FAQ
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/signup" className="text-[#009245] hover:text-[#056633] hover:underline transition-colors duration-200">
                Sign Up
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/legal/terms-and-conditions" className="text-[#009245] hover:text-[#056633] hover:underline transition-colors duration-200">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
