'use client'

import { WorkoutInDb } from '@/app/libs/types'
import { FaLocationDot } from 'react-icons/fa6'

type WorkoutProps = {
  workout: WorkoutInDb
}

export default function Workout({ workout }: WorkoutProps) {
  const { workoutName, location, notes, supersets, exercises, date } = workout

  return (
    <div className="w-full rounded-md bg-gray-700 min-h-[500px]">
      <div className="bg-violet-400 px-4 py-2 rounded-t-md flex items-center justify-between">
        <h2 className="font-medium text-lg">{workoutName}</h2>
        <h2 className="font-medium">
          {' '}
          {new Date(workout.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            weekday: 'short',
          })}
        </h2>
      </div>
      <div className="p-4">
        {location && (
          <h3 className="flex gap-2 items-center mb-6">
            <span className="font-medium">
              <FaLocationDot className="text-violet-400" />
            </span>{' '}
            {location}
          </h3>
        )}

        <ul>
          {exercises.map((exercise, i) => {
            return (
              <li
                key={i}
                className="flex flex-col gap-2"
              >
                <h4 className="font-medium text-lg">{exercise.name}</h4>
                <ul>
                  {exercise.sets.map((set) => {
                    return (
                      <li
                        key={set.id}
                        className="flex items-center"
                      >
                        <span>
                          {set.reps} x {set.weight} lbs
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
