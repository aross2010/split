'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import TextInput from './ui/text-input'
import ExerciseForm from './exercise-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Exercise, WorkoutData } from '../libs/types'
import Modal from './ui/modal'
import { workerData } from 'worker_threads'

const inputs = [
  {
    label: 'Workout Name',
    type: 'text',
    name: 'workoutName',
  },
  {
    label: 'Date',
    type: 'date',
    name: 'date',
  },
  {
    label: 'Location',
    type: 'text',
    name: 'location',
  },
]

const BASE_EXERCISE = {
  name: '',
  sets: [
    {
      sets: null,
      reps: null,
      weight: null,
      rpe: null,
    },
  ],
  dropsets: [],
  inSuperSet: false,
}

export default function WorkoutForm() {
  const [data, setData] = useState<WorkoutData>({
    name: '',
    location: '',
    notes: '',
    supersets: [],
  })
  const [date, setDate] = useState<Date | null>(new Date())
  const [exercises, setExercises] = useState<Exercise[]>([{ ...BASE_EXERCISE }])
  const [activeSuperSet, setActiveSuperSet] = useState<Exercise[]>([])

  const supersetBtn = useRef<HTMLButtonElement>(null)

  const renderedInputs = inputs.map((input, i) => {
    return (
      <div
        key={i}
        className="flex flex-col gap-2"
      >
        <label htmlFor={input.name}>{input.label}</label>
        {input.type == 'date' ? (
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            enableTabLoop={false}
          />
        ) : (
          <TextInput
            name={input.name}
            type={input.type}
            value={data[input.name as keyof typeof data] as string}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                [input.name]: e.target.value,
              }))
            }}
            className="bg-gray-700"
          />
        )}
      </div>
    )
  })

  const renderedExerciseForms = exercises.map((exercise, index) => {
    return (
      <ExerciseForm
        key={index}
        exercises={exercises}
        setExercises={setExercises}
        index={index}
      />
    )
  })

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, { ...BASE_EXERCISE }])
  }

  const availableExercises = exercises.filter(
    (exercise) => !exercise.inSuperSet
  )

  const superSetModalContent = (
    <Fragment>
      {data.supersets.length > 0 && (
        <Fragment>
          <h3 className="text-lg mb-6">Current Supersets</h3>
          <ul>
            {data.supersets.map((superset, i) => {
              return (
                <li
                  key={i}
                  className="flex gap-4"
                >
                  {superset.map((exercise, j) => {
                    return <span key={j}>{exercise.name}</span>
                  })}
                </li>
              )
            })}
          </ul>
        </Fragment>
      )}
      {availableExercises.length >= 2 ? (
        <Fragment>
          <h3 className="text-lg mb-6">
            Which exercises would you like to superset?
          </h3>
          <ul className="flex items-center gap-2 mb-12">
            {exercises.map((exercise, i) => {
              if (!exercise.inSuperSet && exercise.name.length > 0)
                return (
                  <li key={i}>
                    <input
                      type="checkbox"
                      name={exercise.name}
                      id={exercise.name}
                      checked={activeSuperSet.includes(exercise)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setActiveSuperSet((prev) => [...prev, exercise])
                        } else {
                          setActiveSuperSet((prev) =>
                            prev.filter((ex) => ex.name !== exercise.name)
                          )
                        }
                      }}
                      hidden
                    />
                    <label
                      htmlFor={exercise.name}
                      className="rounded-full py-2 px-4 text-sm bg-gray-600 transition-all cursor-pointer"
                    >
                      {activeSuperSet.includes(exercise) && <span></span>}{' '}
                      {exercise.name}
                    </label>
                  </li>
                )
            })}
          </ul>
          <button
            type="button"
            disabled={activeSuperSet.length < 2}
            onClick={() => {
              setData((prev) => ({
                ...prev,
                supersets: [...prev.supersets, activeSuperSet],
              }))
              activeSuperSet.forEach((exercise) => (exercise.inSuperSet = true))
              setActiveSuperSet([])
            }}
            className="bg-green-500 rounded-md px-8 py-2 text-sm w-fit disabled:bg-green-500/25 [&:not(:disabled)]:hover:brightness-110 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            Save
          </button>
        </Fragment>
      ) : (
        <span>
          You need at least two available exercises to form a superset.
        </span>
      )}
    </Fragment>
  )

  return (
    <form className="flex flex-col w-full max-w-[450px] gap-6">
      {renderedInputs}
      {renderedExerciseForms}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleAddExercise}
          className="bg-gray-700 hover:bg-violet-400 active:bg-violet-400 p-3 text-sm hover:brightness-110 transition-all rounded-md"
        >
          Add Exercise
        </button>
        <button
          type="button"
          ref={supersetBtn}
          className="bg-gray-700 p-3 text-sm disabled:bg-gray-800 disabled:cursor-not-allowed [&:not(:disabled)]:hover:brightness-110 transition-all rounded-md"
        >
          Supersets
        </button>
        <Modal
          button={supersetBtn}
          onClose={() => setActiveSuperSet([])}
        >
          {superSetModalContent}
        </Modal>
      </div>

      <div className="flex flex-col gap-2">
        <label>Notes</label>
        <textarea
          value={data.notes}
          onChange={(e) =>
            setData((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="rounded-md h-32 bg-gray-700 p-3 outline-none focus:outline-violet-400 focus:bg-violet-400/25 focus:ring-2 focus:ring-violet-400 shadow-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md p-3 text-sm bg-gray-700 hover:brightness-110 hover:bg-green-500 active:bg-green-500 transition-all">
          Save
        </button>
        <button className="rounded-md p-3 text-sm bg-gray-700 hover:brightness-110 hover:bg-green-500 active:bg-green-500 transition-all">
          Save & Exit
        </button>
      </div>
      <button className="mr-auto w-fit mt-6 underline underline-offset-2 text-sm text-gray-400">
        Delete Workout
      </button>
    </form>
  )
}
