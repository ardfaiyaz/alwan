'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Something went wrong</h1>
        <button
          onClick={reset}
          className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
