'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/10 p-8 backdrop-blur-lg border border-white/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Oops!</h1>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-300 mb-6">
            We've been notified and are working on a fix. Please try again.
          </p>
          {error.digest && (
            <p className="text-sm text-gray-400 mb-6">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full bg-white text-gray-900 hover:bg-gray-100"
          >
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
