import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const id = parseInt(context.params.id)

    const application = await db.teacherApplication.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}
