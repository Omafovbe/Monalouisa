'use client'
import { useState, useEffect } from 'react'
import DailyPrebuilt from './DailyPrebuilt'

interface JoinRoomProps {
  roomName?: string
}

export default function JoinRoom({ roomName }: JoinRoomProps) {
  const [token, setToken] = useState<string>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const DAILY_DOMAIN = process.env.NEXT_PUBLIC_DAILY_DOMAIN

  if (!DAILY_DOMAIN) {
    throw new Error('NEXT_PUBLIC_DAILY_DOMAIN environment variable is not set')
  }

  useEffect(() => {
    const joinRoom = async () => {
      if (!roomName) {
        setError('Room name is required')
        setIsLoading(false)
        return
      }

      try {
        // Get room token from your API
        const response = await fetch(`/api/daily?roomName=${roomName}`)
        if (!response.ok) {
          throw new Error('Failed to join room')
        }
        const data = await response.json()
        setToken(data.token)
      } catch (err) {
        console.error('Error joining room:', err)
        setError(err instanceof Error ? err.message : 'Failed to join room')
      } finally {
        setIsLoading(false)
      }
    }

    joinRoom()
  }, [roomName])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-2'>Joining room...</h2>
          <p className='text-gray-600'>Please wait while we connect you</p>
        </div>
      </div>
    )
  }

  if (error || !roomName) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-2 text-red-600'>Error</h2>
          <p className='text-gray-600'>{error || 'Room name is required'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg p-4 mb-4'>
          <h1 className='text-xl font-semibold'>Room: {roomName}</h1>
          <p className='text-sm text-gray-600'>
            Share this link to invite others:{' '}
            <span className='font-mono bg-gray-100 px-2 py-1 rounded'>
              {`${window.location.origin}/learn2?room=${roomName}`}
            </span>
          </p>
        </div>

        <DailyPrebuilt
          roomUrl={`https://${DAILY_DOMAIN}/${roomName}`}
          token={token}
          roomName={roomName}
        />
      </div>
    </div>
  )
}
