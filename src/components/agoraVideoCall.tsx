'use client'

import { useEffect, useState } from 'react'
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng'

import { Button } from './ui/button'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  Circle,
  ChevronLeft,
  Layout,
} from 'lucide-react'

interface AgoraVideoCallProps {
  channelName: string
  appId: string // Your Agora App ID
  token?: string // Optional token for authentication
  meetingTitle?: string // Added for meeting title
}

const AgoraVideoCall = ({
  channelName,
  appId,
  token,
  meetingTitle,
}: AgoraVideoCallProps) => {
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null)
  const [client, setClient] = useState<IAgoraRTCClient | null>(null)
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const [isVerticalLayout, setIsVerticalLayout] = useState(false)

  useEffect(() => {
    let mounted = true

    const setupAgora = async () => {
      // Initialize Agora client
      const agoraClient = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
      })

      if (mounted) {
        setClient(agoraClient)
      }

      // Event handlers
      const handleUserPublished = async (
        user: IAgoraRTCRemoteUser,
        mediaType: 'audio' | 'video'
      ) => {
        try {
          await agoraClient.subscribe(user, mediaType)
          console.log('Subscribed to', mediaType, 'from user', user.uid)

          if (mediaType === 'video') {
            if (mounted) {
              setUsers((prevUsers) => {
                const exists = prevUsers.find((u) => u.uid === user.uid)
                if (exists) {
                  return prevUsers.map((u) =>
                    u.uid === user.uid
                      ? { ...u, videoTrack: user.videoTrack }
                      : u
                  )
                }
                return [...prevUsers, user]
              })
            }
            // Play video after a short delay to ensure DOM is ready
            setTimeout(() => {
              const playerContainer = document.getElementById(
                `remote-video-${user.uid}`
              )
              if (playerContainer && user.videoTrack) {
                user.videoTrack.play(`remote-video-${user.uid}`)
              }
            }, 100)
          }

          if (mediaType === 'audio' && user.audioTrack) {
            user.audioTrack.play()
          }
        } catch (error) {
          console.error('Error subscribing to user:', error)
        }
      }

      const handleUserUnpublished = (
        user: IAgoraRTCRemoteUser,
        mediaType: 'audio' | 'video'
      ) => {
        if (mediaType === 'video' && user.videoTrack) {
          user.videoTrack.stop()
        }
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.stop()
        }
      }

      const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
        if (mounted) {
          setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid))
        }
      }

      agoraClient.on('user-published', handleUserPublished)
      agoraClient.on('user-unpublished', handleUserUnpublished)
      agoraClient.on('user-left', handleUserLeft)

      try {
        // Join the channel
        const uid = await agoraClient.join(appId, channelName, token || null)
        console.log('Joined channel with UID:', uid)

        // Create and publish local tracks
        const [audioTrack, videoTrack] = await Promise.all([
          AgoraRTC.createMicrophoneAudioTrack(),
          AgoraRTC.createCameraVideoTrack(),
        ])

        if (mounted) {
          setLocalAudioTrack(audioTrack)
          setLocalVideoTrack(videoTrack)
        }

        await agoraClient.publish([audioTrack, videoTrack])
        console.log('Published local tracks')

        // Play local video
        videoTrack.play('local-video')
      } catch (error) {
        console.error('Error setting up Agora:', error)
      }
    }

    setupAgora()

    return () => {
      mounted = false
      if (localAudioTrack) {
        localAudioTrack.stop()
        localAudioTrack.close()
      }
      if (localVideoTrack) {
        localVideoTrack.stop()
        localVideoTrack.close()
      }
      if (client) {
        client.removeAllListeners()
        client.leave()
      }
    }
  }, [appId, channelName, token])

  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        await localVideoTrack.setEnabled(false)
      } else {
        await localVideoTrack.setEnabled(true)
      }
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        await localAudioTrack.setEnabled(false)
      } else {
        await localAudioTrack.setEnabled(true)
      }
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  const handleLeaveChannel = async () => {
    try {
      // Stop and close audio track
      if (localAudioTrack) {
        localAudioTrack.stop()
        localAudioTrack.close()
      }

      // Stop and close video track
      if (localVideoTrack) {
        localVideoTrack.stop()
        localVideoTrack.close()
      }

      // Leave the channel
      if (client) {
        await client.leave()
      }

      // Reset states
      setLocalAudioTrack(null)
      setLocalVideoTrack(null)
      setUsers([])

      // Navigate away or close window
      if (typeof window !== 'undefined') {
        // If in an iframe or popup
        if (window.opener || window.parent !== window) {
          window.close()
        } else {
          // If in main window, you might want to navigate to a different page
          window.location.href = '/' // or any other destination
        }
      }
    } catch (error) {
      console.error('Error leaving channel:', error)
    }
  }

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      {/* Header */}
      <div className='p-4 flex items-center justify-between bg-white shadow-sm'>
        <div className='flex items-center gap-2'>
          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <ChevronLeft className='h-5 w-5' />
          </button>
          <h1 className='font-medium'>{meetingTitle || channelName}</h1>
        </div>
        <div className='flex items-center gap-2'>
          {users.length > 0 && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsVerticalLayout(!isVerticalLayout)}
              className='mr-2'
            >
              <Layout className='h-5 w-5' />
            </Button>
          )}
          <span className='text-red-500 flex items-center gap-1'>
            <Circle className='h-3 w-3 fill-current' /> Recording
          </span>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 p-4 flex ${
          users.length > 0 && isVerticalLayout
            ? 'flex-row gap-4'
            : 'flex-col gap-4'
        }`}
      >
        {/* Active speaker (larger view) */}
        <div
          className={`${
            users.length > 0 && isVerticalLayout ? 'flex-1' : 'flex-1'
          } bg-gray-800 rounded-xl overflow-hidden relative`}
        >
          <div
            id={activeSpeaker ? `remote-video-${activeSpeaker}` : 'local-video'}
            className='w-full h-full object-cover'
          />
          <div className='absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full'>
            {activeSpeaker ? `User ${activeSpeaker}` : 'You'}
          </div>
        </div>

        {/* Participants strip */}
        {users.length > 0 && (
          <div
            className={`
            flex gap-2
            ${
              isVerticalLayout
                ? 'w-32 flex-col overflow-y-auto'
                : 'h-24 w-full flex-row overflow-x-auto'
            }
          `}
          >
            <div
              className={`
                bg-gray-800 rounded-lg overflow-hidden relative
                ${isVerticalLayout ? 'w-full h-24' : 'w-32 h-full'}
                flex-shrink-0
              `}
            >
              <div id='local-video' className='w-full h-full object-cover' />
              <div className='absolute bottom-2 left-2 text-white text-sm'>
                You
              </div>
            </div>
            {users.map((user) => (
              <div
                key={user.uid}
                className={`
                  bg-gray-800 rounded-lg overflow-hidden cursor-pointer relative
                  ${isVerticalLayout ? 'w-full h-24' : 'w-32 h-full'}
                  flex-shrink-0
                `}
                onClick={() => setActiveSpeaker(user.uid.toString())}
              >
                <div
                  id={`remote-video-${user.uid}`}
                  className='w-full h-full object-cover'
                />
                <div className='absolute bottom-2 left-2 text-white text-sm'>
                  User {user.uid}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className='p-4 bg-white border-t flex items-center justify-between'>
        <div className='flex gap-2'>
          <Button
            variant={isAudioEnabled ? 'default' : 'destructive'}
            size='icon'
            onClick={toggleAudio}
          >
            {isAudioEnabled ? (
              <Mic className='h-5 w-5' />
            ) : (
              <MicOff className='h-5 w-5' />
            )}
          </Button>
          <Button
            variant={isVideoEnabled ? 'default' : 'destructive'}
            size='icon'
            onClick={toggleVideo}
          >
            {isVideoEnabled ? (
              <Video className='h-5 w-5' />
            ) : (
              <VideoOff className='h-5 w-5' />
            )}
          </Button>
          <Button variant='ghost' size='icon'>
            <Hand className='h-5 w-5' />
          </Button>
        </div>
        <Button variant='destructive' onClick={handleLeaveChannel}>
          Leave Meeting
        </Button>
      </div>
    </div>
  )
}

export default AgoraVideoCall
