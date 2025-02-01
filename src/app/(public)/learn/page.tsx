'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Learn2Page() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createNewRoom = async () => {
    try {
      setIsCreating(true)
      setError(null)

      const response = await fetch('/api/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: `class-${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create room')
      }

      const data = await response.json()
      router.push(`/learn/join?room=${data.roomName}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room')
      setIsCreating(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center mb-6'>
          Welcome to Video Chat
        </h1>

        <div className='space-y-4'>
          {error && (
            <div className='text-red-600 text-center p-2 bg-red-50 rounded'>
              {error}
            </div>
          )}

          <button
            onClick={createNewRoom}
            disabled={isCreating}
            className='w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400'
          >
            {isCreating ? 'Creating Room...' : 'Create New Room'}
          </button>
        </div>

        <p className='mt-6 text-sm text-gray-600 text-center'>
          Click to create a new video chat room
        </p>
      </div>
    </div>
  )
}
