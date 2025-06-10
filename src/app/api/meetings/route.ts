import { NextResponse } from 'next/server'

const DAILY_API_KEY = process.env.DAILY_API_KEY
const DAILY_API_URL = 'https://api.daily.co/v1'

export async function GET() {
  try {
    const response = await fetch(`${DAILY_API_URL}/meetings`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch meetings from Daily.co')
    }

    const data = await response.json()
    // Ensure we're returning the data in the expected format
    return NextResponse.json({ meetings: data.data || [] })
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetings', meetings: [] },
      { status: 500 }
    )
  }
}
