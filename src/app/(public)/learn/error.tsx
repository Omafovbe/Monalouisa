'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Learn2 Error:', error)
  }, [error])

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Something went wrong!
          </h2>

          <div className='mb-6'>
            <p className='text-gray-600 mb-2'>
              {error.message || 'An unexpected error occurred'}
            </p>
            {error.digest && (
              <p className='text-sm text-gray-500'>Error ID: {error.digest}</p>
            )}
          </div>

          <div className='space-y-4'>
            <button
              onClick={() => reset()}
              className='w-full py-3 px-4 bg-gold text-white rounded-lg hover:bg-goldyellow-700 transition-colors'
            >
              Try again
            </button>

            <button
              onClick={() => router.push('/learn2')}
              className='w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
            >
              Return to Home
            </button>
          </div>

          <p className='mt-6 text-sm text-gray-500'>
            If the problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  )
}
