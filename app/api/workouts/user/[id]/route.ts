import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../libs/prismadb'
import { skip } from 'node:test'

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
      skip: 0,
      take: 20,
    })
  } catch (e) {
    res = []
  }

  prisma.$disconnect()

  return NextResponse.json(res)
}
