'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import DailyPrebuilt from '@/components/DailyPrebuilt'
import { useSession } from 'next-auth/react'

export default function JoinRoomPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomName = searchParams.get('room')
  let userName = searchParams.get('userName') || 'Guest'
  const [token, setToken] = useState<string>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState('')
  const DAILY_DOMAIN = process.env.NEXT_PUBLIC_DAILY_DOMAIN
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (!DAILY_DOMAIN) {
    throw new Error('NEXT_PUBLIC_DAILY_DOMAIN environment variable is not set')
  }

  if (session?.user.name) {
    userName = session?.user?.name
  }

  useEffect(() => {
    setShareUrl(
      `${window.location.origin}/learn/join?room=${roomName}`
      // `${window.location.origin}/learn/join?room=${roomName}&userName=${userName}`
    )
  }, [roomName, userName])

  useEffect(() => {
    const joinRoom = async () => {
      if (!roomName) {
        setError('Room name is required')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/daily?roomName=${roomName}`)
        if (!response.ok) {
          throw new Error('Failed to join room')
        }
        const data = await response.json()
        setToken(data.token)
        setIsLoading(false)
      } catch (err) {
        console.error('Error joining room:', err)
        setError(err instanceof Error ? err.message : 'Failed to join room')
        setIsLoading(false)
      }
    }

    joinRoom()
  }, [roomName])

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const handleLeave = () => {
    router.push('/learn/leave')
  }

  if (error || !roomName) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-2 text-red-600'>Error</h2>
          <p className='text-gray-600'>{error || 'Room name is required'}</p>
          <button
            onClick={() => router.push('/learn')}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

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

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg p-4 mb-4'>
          <h1 className='text-xl font-semibold'>Room: {roomName}</h1>
          <p className='text-sm text-gray-600'>
            Share this link to invite others, Click to copy:{' '}
            <button
              onClick={copyToClipboard}
              className='font-mono bg-gray-100 px-2 py-1 rounded cursor-pointer'
            >
              {shareUrl}
              <span className='ml-2'>{isCopied ? ' Copied!' : ' Copy'}</span>
            </button>
          </p>
        </div>

        <Suspense fallback={<div>Loading video call...</div>}>
          {token && (
            <DailyPrebuilt
              roomUrl={`https://${DAILY_DOMAIN}/${roomName}`}
              roomName={roomName}
              token={token}
              userName={userName}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}
