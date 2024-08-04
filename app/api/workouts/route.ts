import { getSession } from '@/app/functions/get-session'
import { validateExercises } from '@/app/functions/validate-exercises'
import prisma from '../../libs/prismadb'
import { NextResponse } from 'next/server'
import { Exercise, Set } from '@/app/libs/types'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  let { workoutName, location, date, notes, exercises, supersets } =
    await req.json()

  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Not authenicated' }, { status: 401 })

  if (!workoutName)
    return NextResponse.json(
      { error: 'Workout name is required.' },
      { status: 400 }
    )

  if (!exercises)
    return NextResponse.json(
      { error: 'Exercises are required.' },
      { status: 400 }
    )

  if (!date)
    return NextResponse.json({ error: 'Date is required.' }, { status: 400 })

  try {
    exercises = validateExercises(exercises)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user)
    return NextResponse.json({ error: 'Could not find user.' }, { status: 400 })

  const workout = await prisma.workout.create({
    data: {
      workoutName: workoutName.trim(),
      date,
      location: location.trim(),
      notes,
      exercises,
      supersets,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  return NextResponse.json(workout)
}
