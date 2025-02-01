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

interface DailyError {
  errorMsg?: string
  message?: string
}

// Update the activeDaily type
let activeDaily: DailyIframe | null = null

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
      const existingIframes = document.querySelectorAll(
        'iframe[data-daily-iframe]'
      )
      existingIframes.forEach((iframe) => iframe.remove())

      if (activeDaily) {
        if (activeDaily.meetingState() === 'joined-meeting') {
          await activeDaily.leave()
        }
        await activeDaily.destroy()
        activeDaily = null
      }
      setIsInitialized(false)
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    } catch (err) {
      setError('Error during cleanup')
    }
  }

  useEffect(() => {
    const initDaily = async () => {
      if (isInitialized || !roomUrl || !iframeRef.current) {
        return
      }

      try {
        await cleanup()

        const existingIframes = document.querySelectorAll(
          'iframe[data-daily-iframe]'
        )
        if (existingIframes.length > 0) {
          existingIframes.forEach((iframe) => iframe.remove())
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        activeDaily = DailyIframe.createFrame(iframeRef.current, {
          showLeaveButton: true,
          showFullscreenButton: true,
          userName: userName,
          theme: {
            colors: {
              accent: '#ffcb05',
              accentText: '#1a1a1a',
              background: '#ffffff',
              backgroundAccent: '#fff3d6',
              baseText: '#2d2d2d',
            },
          },
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '12px',
          },
        })

        activeDaily.on('loading', () => {
          setIsLoading(true)
        })

        activeDaily.on('loaded', () => {
          setIsLoading(false)
          setIsInitialized(true)
        })

        activeDaily.on('left-meeting', async () => {
          await cleanup()
          router.push(`/learn/leave?room=${roomName}&userName=${userName}`)
        })

        activeDaily.on('error', async (event: DailyError) => {
          if (event?.errorMsg?.includes('Duplicate DailyIframe')) {
            await cleanup()
            setError(null)
            setIsLoading(true)
            setIsInitialized(false)
            setTimeout(() => {
              setError(null)
              setIsInitialized(false)
            }, 1000)
            return
          }
          setError(event?.errorMsg || 'An error occurred with the video call')
          await cleanup()
        })

        await activeDaily.join({
          url: roomUrl,
          ...(token && { token }),
          userName: userName,
        })
      } catch (err: unknown) {
        const error = err as DailyError
        if (error?.message?.includes('Duplicate DailyIframe')) {
          await cleanup()
          setError(null)
          setIsLoading(true)
          setIsInitialized(false)
          setTimeout(() => {
            setError(null)
            setIsInitialized(false)
          }, 1000)
          return
        }
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to initialize video call'
        )
        setIsLoading(false)
        await cleanup()
      }
    }

    initDaily()

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
