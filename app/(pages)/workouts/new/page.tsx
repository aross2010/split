import WorkoutForm from '@/app/components/workout-form'
import { getSession } from '@/app/functions/get-session'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function NewWorkout() {
  const session = await getSession()

  if (!session) redirect('/')

  return (
    <section className="flex flex-col items-center w-full max-w-[600px]">
      <h1 className="text-center text-3xl font-medium mb-4">New Workout</h1>
      <WorkoutForm />
    </section>
  )
}
