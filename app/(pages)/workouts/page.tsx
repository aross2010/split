import { getFilters } from '@/app/functions/get-filters'
import { getSession } from '@/app/functions/get-session'
import { getWorkouts } from '@/app/functions/get-workouts'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const filters = [
  {
    label: 'Workout',
    value: 'workouts',
  },
  {
    label: 'Location',
    value: 'locations',
  },
  {
    label: 'Exercise',
    value: 'exercises',
  },
] as const

export default async function Workouts() {
  const session = await getSession()

  if (!session) redirect('/')

  const userId = session.user.id
  const workouts = await getWorkouts(userId)
  const filtersData = getFilters(workouts)

  return (
    <section className="flex flex-col items-center w-full max-w-[600px]">
      <h1 className="text-center text-3xl font-medium mb-4">Your Workouts</h1>
      <Link
        href="/workouts/new"
        className="bg-violet-400 text-white px-6 py-2 rounded-md mb-12 hover:brightness-110 transition-all"
      >
        New Workout
      </Link>
      <h3 className="text-xl">Filter by –</h3>
    </section>
  )
}
