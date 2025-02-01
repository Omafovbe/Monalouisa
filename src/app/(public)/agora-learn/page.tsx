'use client'
import { useEffect, useState } from 'react'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'
import dynamic from 'next/dynamic'

// Dynamically import the video call component with SSR disabled
const AgoraInterVidCall = dynamic(
  () => import('@/components/AgoraInterVidCall'),
  {
    ssr: false,
    loading: () => (
      <div className='room'>
        <div className='user'>
          <samp className='user-name'>Loading video call components...</samp>
        </div>
      </div>
    ),
  }
)

const VideoCall = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className='room'>
        <div className='user'>
          <samp className='user-name'>Initializing video call...</samp>
        </div>
      </div>
    )
  }

  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

  const connectionData = {
    appId: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    channel: 'test',
    token: null,
  }

  return (
    <div>
      <AgoraRTCProvider client={client}>
        <AgoraInterVidCall
          channelName={connectionData.channel}
          meetingTitle={connectionData.channel || 'Test Meeting'}
          appId={connectionData.appId}
          token={''}
        />
      </AgoraRTCProvider>
    </div>
  )
}

export default VideoCall
