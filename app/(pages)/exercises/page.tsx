import ExerciseStats from '@/app/components/exercises-stats'
import { getExerciseNames } from '@/app/functions/get-filters'
import { getSession } from '@/app/functions/get-session'
import { getWorkouts } from '@/app/functions/get-workouts'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
  title: 'Exercises',
  description: 'View your stats and progress for all exercises.',
}

export default async function Exercises() {
  const session = await getSession()

  if (!session) redirect('/')

  const workouts = await getWorkouts(session.user.id)
  const exerciseNames = getExerciseNames(workouts.reverse()) as string[]

  return (
    <section className="flex flex-col items-center w-full max-w-[950px]">
      <h1 className="text-center text-3xl font-medium mb-4">Your Exercises</h1>
      <h3 className="text-gray-200 text-lg text-center">
        Search for an exercise to view your progress
      </h3>
      <ExerciseStats
        exerciseNames={exerciseNames}
        workouts={workouts}
      />
    </section>
  )
}
