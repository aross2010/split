'use client'

import { WorkoutInDb } from '../libs/types'
import Workout from './ui/workout'

type WorkoutsProps = {
  workouts: WorkoutInDb[]
}

export default function WorkoutsList({ workouts }: WorkoutsProps) {
  const renderedWorkouts = workouts.map((workout) => {
    return (
      <li key={workout.id}>
        <Workout workout={workout} />
      </li>
    )
  })

  return (
    <div className="w-full max-w-[500px] pt-20">
      <ul className="flex flex-col gap-6">{renderedWorkouts}</ul>
    </div>
  )
}
