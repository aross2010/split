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
    res = []
  }

  prisma.$disconnect()

  return NextResponse.json(res)
}
