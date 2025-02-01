'use client'
import { useEffect, useRef, useState } from 'react'
import DailyIframe from '@daily-co/daily-js'
import { useRouter } from 'next/navigation'

interface DailyPrebuiltProps {
  roomUrl: string
  roomName: string
  token?: string
  userName?: string
}

// Keep track of active Daily instance globally
let activeDaily: any = null

export default function DailyPrebuilt({
  roomUrl,
  roomName,
  token,
  userName = 'Student',
}: DailyPrebuiltProps) {
  const iframeRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)

  const cleanup = async () => {
    try {
      // First, try to clean up any existing iframes in the DOM
      const existingIframes = document.querySelectorAll(
        'iframe[data-daily-iframe]'
      )
      existingIframes.forEach((iframe) => iframe.remove())

      if (activeDaily) {
        console.log('Cleaning up Daily instance')
        if (activeDaily.meetingState() === 'joined-meeting') {
          await activeDaily.leave()
        }
        await activeDaily.destroy()
        activeDaily = null
      }
      setIsInitialized(false)
    } catch (err) {
      console.error('Error during cleanup:', err)
    }
  }

  useEffect(() => {
    const initDaily = async () => {
      // If already initialized or missing requirements, don't proceed
      if (isInitialized || !roomUrl || !iframeRef.current) {
        return
      }

      try {
        // Clean up any existing instance first
        await cleanup()

        // Check for any existing Daily iframes before creating new one
        const existingIframes = document.querySelectorAll(
          'iframe[data-daily-iframe]'
        )
        if (existingIframes.length > 0) {
          console.log('Found existing Daily iframes, cleaning up...')
          existingIframes.forEach((iframe) => iframe.remove())
          // Wait a bit for cleanup to complete
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        console.log('Creating new Daily instance')
        activeDaily = DailyIframe.createFrame(iframeRef.current, {
          showLeaveButton: true,
          showFullscreenButton: true,
          userName: userName,
          theme: {
            colors: {
              accent: '#ffcb05', // Primary yellow
              accentText: '#1a1a1a', // Dark gray for contrast on yellow
              background: '#ffffff', // Clean white background
              backgroundAccent: '#fff3d6', // Light yellow for accented backgrounds
              baseText: '#2d2d2d', // Soft black for better readability
            },
          },
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '12px',
          },
        })

        // Set up event handlers
        activeDaily.on('loading', () => {
          console.log('Daily: Loading')
          setIsLoading(true)
        })

        activeDaily.on('loaded', () => {
          console.log('Daily: Loaded')
          setIsLoading(false)
          setIsInitialized(true)
        })

        activeDaily.on('left-meeting', async () => {
          console.log('Daily: Left meeting')
          await cleanup()
          router.push(`/learn/leave?room=${roomName}&userName=${userName}`)
        })

        activeDaily.on('error', async (event: any) => {
          console.error('Daily error event:', event)
          if (event?.errorMsg?.includes('Duplicate DailyIframe')) {
            console.log('Handling duplicate iframe error...')
            await cleanup()
            setError(null)
            setIsLoading(true)
            setIsInitialized(false)
            // Try to reinitialize after a short delay
            setTimeout(() => {
              setError(null)
              setIsInitialized(false)
            }, 1000)
            return
          }
          setError(event?.errorMsg || 'An error occurred with the video call')
          await cleanup()
        })

        // Join the room
        console.log('Joining room with token:', token ? 'Yes' : 'No')
        await activeDaily.join({
          url: roomUrl,
          ...(token && { token }),
          userName: userName,
        })

        console.log('Successfully joined room')
      } catch (err: any) {
        console.error('Error in Daily initialization:', err)
        if (err?.message?.includes('Duplicate DailyIframe')) {
          console.log('Handling duplicate iframe error in catch block...')
          await cleanup()
          setError(null)
          setIsLoading(true)
          setIsInitialized(false)
          // Try to reinitialize after a short delay
          setTimeout(() => {
            setError(null)
            setIsInitialized(false)
          }, 1000)
          return
        }
        setError(
          err instanceof Error ? err.message : 'Failed to initialize video call'
        )
        setIsLoading(false)
        await cleanup()
      }
    }

    initDaily()

    // Cleanup on unmount
    return () => {
      cleanup()
    }
  }, [roomUrl, roomName, token, userName, router, isInitialized])

  const handleRetry = async () => {
    await cleanup()
    setError(null)
    setIsLoading(true)
    setIsInitialized(false)
  }

  if (error) {
    return (
      <div className='w-full h-[600px] flex items-center justify-center bg-red-50 rounded-lg'>
        <div className='text-center p-8'>
          <h3 className='text-xl font-semibold text-red-600 mb-2'>
            Video Call Error
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <div className='space-y-4'>
            <button
              onClick={handleRetry}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4'
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/learn2')}
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300'
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-[600px] relative'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10'>
          <div className='text-center'>
            <h2 className='text-xl font-semibold mb-2'>
              Loading video call...
            </h2>
            <p className='text-gray-600'>Please wait</p>
          </div>
        </div>
      )}
      <div
        ref={iframeRef}
        className='w-full h-full rounded-lg overflow-hidden shadow-lg'
      />
    </div>
  )
}
