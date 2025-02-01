'use client'
import { useState, useEffect } from 'react'
import AgoraRTC, {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useRTCClient,
  ICameraVideoTrack,
} from 'agora-rtc-react'
import { Mic, MicOff, VideoOff, Video, MonitorUp, Monitor } from 'lucide-react'

interface AgoraInterVideoCallProps {
  channelName: string
  appId: string
  token?: string
  meetingTitle?: string
}

const AgoraInterVidCall = ({
  channelName,
  appId,
  token,
  meetingTitle,
}: AgoraInterVideoCallProps) => {
  const [isBrowser, setIsBrowser] = useState(false)
  const [calling, setCalling] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenTrack, setScreenTrack] = useState<any>(null)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const isConnected = useIsConnected()
  const client = useRTCClient()

  useJoin(
    { appid: appId, channel: channelName, token: token ? token : null },
    isBrowser && calling
  )

  const [micOn, setMic] = useState(true)
  const [cameraOn, setCamera] = useState(true)
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
  const { localCameraTrack } = useLocalCameraTrack(cameraOn)
  usePublish(
    [
      micOn ? localMicrophoneTrack : null,
      cameraOn ? localCameraTrack : null,
      screenTrack,
    ].filter(Boolean)
  )

  const remoteUsers = useRemoteUsers()

  const handleEndCall = async () => {
    setCalling(false)
    if (localMicrophoneTrack) {
      await localMicrophoneTrack.stop()
      await localMicrophoneTrack.close()
    }
    if (localCameraTrack) {
      await localCameraTrack.stop()
      await localCameraTrack.close()
    }
    if (screenTrack) {
      await screenTrack.stop()
      await screenTrack.close()
    }
    await client.leave()
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Stop camera track before screen sharing
        if (localCameraTrack) {
          await localCameraTrack.stop()
          await localCameraTrack.close()
          setCamera(false)
        }

        const screenVideoTrack = await AgoraRTC.createScreenVideoTrack(
          { encoderConfig: '1080p_1' },
          'auto'
        )

        // Handle both single track and array returns
        const track = Array.isArray(screenVideoTrack)
          ? screenVideoTrack[0]
          : screenVideoTrack

        track.on('track-ended', () => {
          setIsScreenSharing(false)
          track.stop()
          track.close()
          setScreenTrack(null)
        })

        setScreenTrack(track)
        setIsScreenSharing(true)
      } else {
        if (screenTrack) {
          screenTrack.stop()
          screenTrack.close()
          setScreenTrack(null)
        }
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error('Screen share error:', error)
      setIsScreenSharing(false)
      setScreenTrack(null)
    }
  }

  if (!isBrowser) {
    return (
      <div className='w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden'>
        <div className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'>
          <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
            Loading video components...
          </samp>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-screen rounded-lg overflow-hidden'>
      {isConnected ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
            <div className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'>
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                // cover='teacher.jpg'
              >
                <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
                  You
                </samp>
              </LocalUser>
            </div>
            {screenTrack && (
              <div className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'>
                <LocalUser
                  videoTrack={screenTrack}
                  audioTrack={null}
                  cameraOn={false}
                  micOn={false}
                >
                  <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
                    Your Screen
                  </samp>
                </LocalUser>
              </div>
            )}
            {remoteUsers.map((user) => (
              <div
                key={user.uid}
                className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'
              >
                <RemoteUser
                  // cover='/boy_smiles.png'
                  user={user}
                >
                  <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
                    {user.uid}
                  </samp>
                </RemoteUser>
              </div>
            ))}
          </div>
          <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 bg-black/50 rounded-full px-6 py-3'>
            <div className='flex items-center gap-4 mr-4'>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  micOn
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-500'
                }`}
                onClick={() => setMic((prev) => !prev)}
              >
                {micOn ? (
                  <Mic className='text-white' />
                ) : (
                  <MicOff className='text-white' />
                )}
              </button>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  cameraOn
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-500'
                }`}
                onClick={() => setCamera((prev) => !prev)}
              >
                {cameraOn ? (
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
            </div>
            <button
              className='w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 bg-red-600 hover:bg-red-500'
              onClick={handleEndCall}
            >
              <span className='text-white text-xl'>📞</span>
            </button>
          </div>
        </>
      ) : (
        <div className='relative aspect-video bg-gray-800 rounded-lg overflow-hidden'>
          <samp className='absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full'>
            Waiting for connection...
          </samp>
        </div>
      )}
    </div>
  )
}

export default AgoraInterVidCall
