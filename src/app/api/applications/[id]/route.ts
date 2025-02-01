import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json()
    const id = parseInt(params.id)

    const application = await db.teacherApplication.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(application)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}
