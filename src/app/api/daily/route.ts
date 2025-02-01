import { NextResponse } from 'next/server'

const API_KEY = process.env.DAILY_API_KEY

async function createMeeting(roomName?: string) {
  try {
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          enable_hand_raising: true,
          enable_network_ui: true,
          enable_prejoin_ui: true,
          enable_emoji_reactions: true,
          enable_video_processing_ui: true,
          exp: Math.round(Date.now() / 1000) + 60 * 30, // 30 minutes from now
        },
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating meeting:', error)
    throw error
  }
}

async function createToken(roomName: string) {
  try {
    const response = await fetch('https://api.daily.co/v1/meeting-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          is_owner: true,
          exp: Math.round(Date.now() / 1000) + 60 * 30, // 30 minutes from now
        },
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating token:', error)
    throw error
  }
}

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Daily API key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const roomName = body.roomName

    // Create a new meeting room
    const meeting = await createMeeting(roomName)

    // Create a token for this room
    const token = await createToken(meeting.name)

    return NextResponse.json({
      roomName: meeting.name,
      roomUrl: meeting.url,
      token: token.token,
    })
  } catch (error) {
    console.error('Error in /api/daily:', error)
    return NextResponse.json(
      { error: 'Failed to create meeting and token' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const roomName = searchParams.get('roomName')

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Daily API key not configured' },
      { status: 500 }
    )
  }

  if (!roomName) {
    return NextResponse.json(
      { error: 'Room name is required' },
      { status: 400 }
    )
  }

  try {
    const token = await createToken(roomName)
    return NextResponse.json({ token: token.token })
  } catch (error) {
    console.error('Error in /api/daily:', error)
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    )
  }
}
