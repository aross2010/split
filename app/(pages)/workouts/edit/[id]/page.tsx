import Workout from '@/app/components/ui/workout'
import WorkoutForm from '@/app/components/workout-form'
import { getSession } from '@/app/functions/get-session'
import { getWorkout } from '@/app/functions/get-workout'
import { WorkoutInDb } from '@/app/libs/types'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function EditWorkout({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session) redirect('/')

  const { id } = params
  const workout = (await getWorkout(id)) as WorkoutInDb

  if (workout.userId !== session.user.id) redirect('/')

  return (
    <section className="flex flex-col items-center w-full max-w-[450px]">
      <h1 className="text-center text-3xl font-medium mb-12">Edit Workout</h1>
      <WorkoutForm workout={workout} />
    </section>
  )
}
