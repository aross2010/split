import { getSession } from '@/app/functions/get-session'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { WorkoutInDb } from '@/app/libs/types'

export async function PUT(request: Request) {
  const data = await request.json()

  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'You must be logged in.' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  const { newExerciseName, oldExerciseName } = data

  if (!newExerciseName || !oldExerciseName) {
    return NextResponse.json({ error: 'Missing Fields.' }, { status: 400 })
  }

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId,
      },
    })

    const updatedWorkouts = await Promise.all(
      workouts.map(async (workout: WorkoutInDb) => {
        const hasOldExercise = workout.exercises.some((exercise) => {
          return exercise.name === oldExerciseName
        })

        if (hasOldExercise) {
          return prisma.workout.update({
            where: {
              id: workout.id,
            },
            data: {
              exercises: workout.exercises.map((exercise) => {
                if (exercise.name === oldExerciseName) {
                  return {
                    ...exercise,
                    name: newExerciseName,
                  }
                }
                return exercise
              }),
              supersets: workout.supersets.map((superset) => {
                return superset.map((exercise) => {
                  if (exercise.name == oldExerciseName) {
                    return {
                      ...exercise,
                      name: newExerciseName,
                    }
                  }
                  return exercise
                })
              }),
            },
          })
        }

        return workout
      })
    )

    return NextResponse.json(newExerciseName)
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
