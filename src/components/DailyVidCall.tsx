// components/SimpleVideoCall.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import {
  DailyProvider,
  useDaily,
  useLocalParticipant,
  useParticipantIds,
  DailyVideo,
  useDailyEvent,
  useNetwork,
} from '@daily-co/daily-react'
import {
  Mic,
  MicOff,
  VideoOff,
  Video,
  MonitorUp,
  Monitor,
  Hand,
  SignalHigh,
  MessageCircle,
  LogOut,
  Send,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChatMessage {
  sender: string
  message: string
  timestamp: number
}

interface DailyVidCallProps {
  roomUrl: string
  token: string
}

// Inner component that uses Daily hooks
function CallContent() {
  const router = useRouter()
  const daily = useDaily()
  const localParticipant = useLocalParticipant()
  const participantIds = useParticipantIds()
  const network = useNetwork()

  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Handle join state
  useDailyEvent('joined-meeting', () => {
    setHasJoined(true)
  })

  useDailyEvent('left-meeting', () => {
    setHasJoined(false)
  })

  // Handle chat messages
  useDailyEvent('app-message', (evt) => {
    if (!evt?.data) return
    console.log(evt.data)
    const message = evt.data
    setMessages((prev) => [
      ...prev,
      {
        sender: message.sender?.name || 'Anonymous',
        message: message.message || '',
        timestamp: Date.now(),
      },
    ])
  })

  // Handle participant updates (for hand raise)
  useDailyEvent('participant-updated', (evt) => {
    if (!evt?.participant) return

    const userData = evt.participant.userData as { handRaised?: boolean }
    console.log(userData)
    if (userData?.handRaised) {
      daily?.sendAppMessage(
        {
          type: 'hand-raised',
          name: evt.participant.user_name || 'Someone',
        },
        '*'
      )
    }
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Join the call when component mounts
  useEffect(() => {
    if (daily && !hasJoined) {
      daily.join().catch((error) => {
        console.error('Error joining meeting:', error)
      })
    }
    // Cleanup when component unmounts
    return () => {
      if (daily && hasJoined) {
        daily.leave()
      }
    }
  }, [daily, hasJoined])

  const toggleMic = async () => {
    if (localParticipant) {
      await daily?.setLocalAudio(!isMicOn)
      setIsMicOn(!isMicOn)
    }
  }

  const toggleCamera = async () => {
    if (localParticipant) {
      await daily?.setLocalVideo(!isCameraOn)
      setIsCameraOn(!isCameraOn)
    }
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        await daily?.startScreenShare()
        setIsScreenSharing(true)
      } catch (e) {
        console.error('Error sharing screen:', e)
      }
    } else {
      try {
        await daily?.stopScreenShare()
        setIsScreenSharing(false)
      } catch (e) {
        console.error('Error stopping screen share:', e)
      }
    }
  }

  const toggleHandRaise = async () => {
    try {
      await daily?.setUserData({ handRaised: !isHandRaised })
      setIsHandRaised(!isHandRaised)
    } catch (e) {
      console.error('Error toggling hand:', e)
    }
  }

  const leaveCall = () => {
    if (daily && hasJoined) {
      daily.leave().then(() => {
        router.push('/learn2/leave')
      })
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const messageData = {
      message: newMessage,
      sender: {
        name: localParticipant?.user_name || 'You',
      },
      timestamp: Date.now(),
    }

    try {
      daily?.sendAppMessage(messageData, '*')

      setMessages((prev) => [
        ...prev,
        {
          sender: 'You',
          message: newMessage,
          timestamp: Date.now(),
        },
      ])

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!hasJoined) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-2'>Joining call...</h2>
          <p className='text-gray-600'>Please wait while we connect you</p>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-screen rounded-lg overflow-hidden'>
      {/* Network Quality Indicator */}
      <div className='fixed top-4 right-4 z-50 bg-black/50 rounded-full px-3 py-1 flex items-center gap-2'>
        <SignalHigh
          className={`w-4 h-4 ${
            network.quality > 80
              ? 'text-green-500'
              : network.quality > 50
              ? 'text-yellow-500'
              : 'text-red-500'
          }`}
        />
        <span className='text-white text-sm'>{network.quality}%</span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        {/* Local participant */}
        {localParticipant && (
          <div className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'>
            <DailyVideo
              sessionId={localParticipant.session_id}
              mirror
              type='video'
            />
            <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
              You {isHandRaised && '✋'}
            </samp>
          </div>
        )}

        {/* Screen share */}
        {isScreenSharing && (
          <div className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'>
            <DailyVideo
              sessionId={localParticipant?.session_id || ''}
              type='screenVideo'
            />
            <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
              Your Screen
            </samp>
          </div>
        )}

        {/* Remote participants */}
        {participantIds
          .filter((id) => id !== localParticipant?.session_id)
          .map((id) => (
            <div
              key={id}
              className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'
            >
              <DailyVideo sessionId={id} type='video' />
              <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
                Participant {id}{' '}
                {(
                  daily?.participants()?.[id]?.userData as {
                    handRaised?: boolean
                  }
                )?.handRaised && '✋'}
              </samp>
            </div>
          ))}
      </div>

      {/* Controls */}
      <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 bg-black/50 rounded-full px-6 py-3'>
        <div className='flex items-center gap-4 mr-4'>
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isMicOn
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-500'
            }`}
            onClick={toggleMic}
          >
            {isMicOn ? (
              <Mic className='text-white' />
            ) : (
              <MicOff className='text-white' />
            )}
          </button>
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isCameraOn
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-500'
            }`}
            onClick={toggleCamera}
          >
            {isCameraOn ? (
              <Video className='text-white' />
            ) : (
              <VideoOff className='text-white' />
            )}
          </button>
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isScreenSharing
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={toggleScreenShare}
          >
            {isScreenSharing ? (
              <Monitor className='text-white' />
            ) : (
              <MonitorUp className='text-white' />
            )}
          </button>
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isHandRaised
                ? 'bg-yellow-600 hover:bg-yellow-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={toggleHandRaise}
          >
            <Hand className='text-white' />
          </button>
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
              showChat
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setShowChat(!showChat)}
          >
            <MessageCircle className='text-white' />
          </button>
        </div>
        <button
          className='w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 bg-red-600 hover:bg-red-500'
          onClick={leaveCall}
        >
          <LogOut className='text-white' />
        </button>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className='fixed right-4 bottom-24 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col'>
          <div className='p-4 border-b'>
            <h3 className='font-semibold'>Chat</h3>
          </div>

          <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((msg, idx) => (
              <div
                key={msg.timestamp + idx}
                className={`flex flex-col ${
                  msg.sender === 'You' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.sender === 'You'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className='text-xs font-semibold mb-1'>{msg.sender}</p>
                  <p className='text-sm'>{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className='p-4 border-t'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder='Type a message...'
                className='flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                onClick={sendMessage}
                className='p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
              >
                <Send className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main component wrapper
export default function DailyVidCall({ roomUrl, token }: DailyVidCallProps) {
  return (
    <DailyProvider url={roomUrl} token={token}>
      <CallContent />
    </DailyProvider>
  )
}
