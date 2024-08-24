import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../libs/prismadb'
import { getSession } from '@/app/functions/get-session'
import { validateExercises } from '@/app/functions/validate-exercises'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id)
    return NextResponse.json(
      { error: 'Workout ID is required.' },
      { status: 400 }
    )

  let res
  try {
    res = await prisma.workout.findUnique({
      where: {
        id: id,
      },
    })

    if (!res)
      return NextResponse.json({ error: 'Workout not found.' }, { status: 404 })
  } catch (e) {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }

  return NextResponse.json(res)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let { workoutName, location, date, notes, exercises, supersets } =
    await req.json()
  const { id } = params

  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Not authenicated' }, { status: 401 })

  if (!id)
    return NextResponse.json(
      { error: 'Workout ID is required.' },
      { status: 400 }
    )

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

  const updatedWorkout = await prisma.workout.update({
    where: {
      id,
      userId: user.id,
    },
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

  return NextResponse.json(updatedWorkout)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Not authenicated' }, { status: 401 })

  if (session.user.email === 'demo@gmail.com')
    return NextResponse.json(
      { error: 'Demo user cannot delete workouts.' },
      { status: 403 }
    )

  if (!id)
    return NextResponse.json(
      { error: 'Workout ID is required.' },
      { status: 400 }
    )

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user)
    return NextResponse.json({ error: 'Could not find user.' }, { status: 400 })

  const deletedWorkout = await prisma.workout.delete({
    where: {
      id,
      userId: user.id,
    },
  })

  return NextResponse.json(deletedWorkout)
}
