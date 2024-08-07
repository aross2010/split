'use client'

import { formatExercises } from '@/app/functions/format-exercises'
import { WorkoutInDb } from '@/app/libs/types'
import { Fragment } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { FaXmark } from 'react-icons/fa6'
import Link from 'next/link'

type WorkoutProps = {
  workout: WorkoutInDb
}

export default function Workout({ workout }: WorkoutProps) {
  const { workoutName, location, notes, supersets, exercises, date } = workout

  const formattedExercises = formatExercises(exercises, supersets)

  const totalSets = exercises.reduce((acc, ex) => {
    return acc + ex.sets.length
  }, 0)

  return (
    <div className="w-full rounded-xl bg-gray-700">
      <div className="bg-violet-400 px-4 py-2 rounded-t-xl flex items-center justify-between">
        <h2 className="font-medium text-lg">{workoutName}</h2>
        <h2 className="font-medium">
          {' '}
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            weekday: 'short',
          })}
        </h2>
      </div>
      <div className="p-4">
        <div className="flex justify-between">
          <h3>{totalSets} sets</h3>
          {location && (
            <h3 className="flex gap-2 items-center mb-6">
              <span className="font-medium">
                <FaLocationDot className="text-violet-400" />
              </span>{' '}
              {location}
            </h3>
          )}
        </div>

        <ul className="flex flex-col gap-6 mb-6">
          {formattedExercises.map((exercise, i) => {
            return (
              <li
                key={i}
                className="flex flex-col gap-4"
              >
                <h4 className="font-medium text-lg">
                  {exercise.name}{' '}
                  {exercise.supersets.get(exercise.id) && (
                    <Fragment>
                      <p className="font-medium -mt-1 text-sm text-gray-400">
                        Superset with:{' '}
                        {exercise.supersets
                          .get(exercise.id)
                          ?.map((exerciseName, i) => {
                            return <span key={i}>{exerciseName}</span>
                          })}
                      </p>
                    </Fragment>
                  )}
                </h4>

                <ul className="text-gray-300 flex flex-col gap-2">
                  {exercise.sets.map((set, i) => {
                    return Object.entries(set).map(([weight, { sets }], i) => {
                      return (
                        <li key={i}>
                          <ul className="flex justify-between items-center flex-wrap">
                            <div className="flex items-center gap-2">
                              {sets.map((set, i) => {
                                return (
                                  <Fragment key={i}>
                                    <li
                                      className={`flex items-center gap-1 py-0.5 px-2 ${
                                        set.inDropset
                                          ? 'bg-gray-600 outline outline-gray-800'
                                          : 'bg-gray-600'
                                      } rounded-md select-none`}
                                    >
                                      <span>{set.times}</span>
                                      <span className="text-gray-400 text-xs">
                                        <FaXmark />
                                      </span>
                                      <span>
                                        {set.reps}

                                        {set.partialReps !== 0 && (
                                          <span className="ml-1 text-gray-400">
                                            {'{'}
                                            {set.partialReps}
                                            {'}'}
                                          </span>
                                        )}
                                      </span>
                                      {set.rpe && (
                                        <span className="ml-1 text-gray-400">
                                          [{set.rpe}]
                                        </span>
                                      )}
                                    </li>
                                  </Fragment>
                                )
                              })}
                            </div>
                            {parseInt(weight) !== 0 && (
                              <span className="bg-gray-600 rounded-md  text-sm p-1">
                                {weight} lbs.
                              </span>
                            )}
                          </ul>
                        </li>
                      )
                    })
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
        {notes && (
          <Fragment>
            <h3 className="mb-1">Notes</h3>
            <div className=" bg-gray-600 rounded-md py-6 px-3 mb-4">
              <p className="text-gray-200">{notes}</p>
            </div>
          </Fragment>
        )}
        <Link
          href={`/workouts/edit/${workout.id}`}
          className="text-gray-400 underline underline-offset-2 text-sm hover:brightness-125 transition-all"
        >
          Edit
        </Link>
      </div>
    </div>
  )
}
