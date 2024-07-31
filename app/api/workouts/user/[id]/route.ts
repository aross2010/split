// Where all workouts for a user is found, or where a workout can be created for a user

import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../libs/prismadb'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  let res = []
  try {
    res = await prisma.workout.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        date: 'desc',
      },
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }

  prisma.$disconnect()

  return NextResponse.json(res)
}
