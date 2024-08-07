import WorkoutForm from '@/app/components/workout-form'
import { getFilters } from '@/app/functions/get-filters'
import { getSession } from '@/app/functions/get-session'
import { getWorkouts } from '@/app/functions/get-workouts'
import { FiltersData } from '@/app/libs/types'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function NewWorkout() {
  const session = await getSession()

  if (!session) redirect('/')

  const workouts = await getWorkouts(session.user.id)
  const uniqueHistory = getFilters(workouts) as FiltersData

  return (
    <section className="flex flex-col items-center w-full max-w-[450px]">
      <h1 className="text-center text-3xl font-medium mb-12">New Workout</h1>
      <WorkoutForm uniqueHistory={uniqueHistory} />
    </section>
  )
}
