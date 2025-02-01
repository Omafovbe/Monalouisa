'use client'
import { useRouter } from 'next/navigation'

export default function LeavePage() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center mb-6'>
          You've left the room
        </h1>

        <div className='space-y-4'>
          <button
            onClick={() => router.push('/learn')}
            className='w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Create New Room
          </button>

          <button
            onClick={() => router.back()}
            className='w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
          >
            Rejoin Previous Room
          </button>
        </div>

        <p className='mt-6 text-sm text-gray-600 text-center'>
          Choose to create a new room or rejoin your previous session
        </p>
      </div>
    </div>
  )
}
