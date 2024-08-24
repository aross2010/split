import WorkoutsList from '@/app/components/workouts-list'
import { getFilters } from '@/app/functions/get-filters'
import { getSession } from '@/app/functions/get-session'
import { getWorkouts } from '@/app/functions/get-workouts'
import { FiltersData } from '@/app/libs/types'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workouts',
  description:
    'Sort and filter through your workout history, or create a new workout.',
}

export default async function Workouts() {
  const session = await getSession()

  if (!session) redirect('/')

  const userId = session.user.id
  const workouts = await getWorkouts(userId)
  const filtersData = getFilters(workouts) as FiltersData

  return (
    <section className="flex flex-col items-center w-full max-w-[600px]">
      <h1 className="text-center text-3xl font-medium mb-4">Your Workouts</h1>
      <h3 className="mb-6 text-lg text-center">
        Filter through your workouts, or{' '}
        <Link
          href="/workouts/new"
          className="font-medium hover:text-violet-500 transition-all underline underline-offset-2"
        >
          create a new one
        </Link>
        .
      </h3>
      <WorkoutsList
        workouts={workouts}
        filtersData={filtersData}
      />
    </section>
  )
}
