'use client'
import { Fragment, use, useEffect, useRef, useState } from 'react'
import TextInput from './ui/text-input'
import ExerciseForm from './exercise-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Exercise, WorkoutData } from '../libs/types'
import Modal from './ui/modal'
import Button from './ui/button'

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
  id: 'werewrew',
}

export default function WorkoutForm() {
  const [data, setData] = useState<WorkoutData>({
    name: '',
    location: '',
    notes: '',
    supersets: [],
  })
  const [date, setDate] = useState<Date | null>(new Date())
  const [exercises, setExercises] = useState<Exercise[]>([BASE_EXERCISE])
  const [activeSuperSet, setActiveSuperSet] = useState<Exercise[]>([])
  const [superSetToAppend, setSuperSetToAppend] = useState<Exercise[] | null>(
    null
  )

  const supersetBtn = useRef<HTMLButtonElement>(null)
  const exerciseRefs = useRef<(HTMLDivElement | null)[]>([])

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
      <div
        key={index}
        ref={(el) => {
          exerciseRefs.current[index] = el
        }}
      >
        <ExerciseForm
          exercises={exercises}
          setExercises={setExercises}
          index={index}
        />
      </div>
    )
  })

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
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
        id: Math.random().toString(),
      },
    ])
    if (exercises.length > 0) {
      const lastExerciseRef =
        exerciseRefs.current[exerciseRefs.current.length - 1]
      if (lastExerciseRef) {
        lastExerciseRef.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const removeExerciseFromSuperset = (exerciseId: string) => {
    const newSupersets = [...data.supersets]
    newSupersets.forEach((superset) => {
      const index = superset.findIndex((exercise) => exercise.id === exerciseId)
      if (index !== -1) {
        superset[index].inSuperSet = false
        superset.splice(index, 1) // remove the exercise from the superset
        if (superset.length <= 1) {
          superset.forEach((exercise) => (exercise.inSuperSet = false))
          newSupersets.splice(newSupersets.indexOf(superset), 1) // remove the superset if it has less than 2 exercises
        }
      }
    })
    setData((prev) => ({ ...prev, supersets: newSupersets }))
  }

  const handleSaveSuperset = () => {
    if (!superSetToAppend) {
      setData((prev) => ({
        ...prev,
        supersets: [...prev.supersets, activeSuperSet],
      }))
      activeSuperSet.forEach((exercise) => (exercise.inSuperSet = true))
    } else {
      const supersets = [...data.supersets]
      const index = supersets.findIndex(
        (superset) => superset === superSetToAppend
      )
      supersets[index] = [...supersets[index], ...activeSuperSet]
      activeSuperSet.forEach((exercise) => (exercise.inSuperSet = true))
      setData((prev) => ({ ...prev, supersets }))
      setSuperSetToAppend(null)
    }
    setActiveSuperSet([])
  }

  const availableExercisesForSuperset = exercises.filter(
    (exercise) => !exercise.inSuperSet && exercise.name.length > 0
  )

  const invalidSave =
    (activeSuperSet.length < 2 && !superSetToAppend) ||
    (activeSuperSet.length < 1 && superSetToAppend !== null)

  const exercisesToAdd =
    availableExercisesForSuperset.length >= 2 ||
    (data.supersets.length >= 1 &&
      availableExercisesForSuperset.length >= 1 &&
      superSetToAppend)

  const superSetModalContent = (
    <Fragment>
      {data.supersets.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg">
            Current Supersets{' '}
            <span className="text-sm ml-3 text-gray-400">
              (Click to remove)
            </span>
          </h3>
          <ul className="flex flex-col gap-4 mb-8 text-sm">
            {data.supersets.map((superset, i) => {
              return (
                <li
                  key={i}
                  className={`flex items-center gap-3`}
                >
                  <div
                    className={`flex items-center gap-2 px-2 ${
                      superSetToAppend === superset
                        ? 'bg-violet-400/75 rounded-md'
                        : ''
                    }`}
                  >
                    {'{'}
                    {superset.map((exercise, j) => {
                      return (
                        <Button
                          type="button"
                          className="!w-fit !p-0 hover:underline hover:underline-offset-2"
                          onClick={() =>
                            removeExerciseFromSuperset(exercise.id)
                          }
                          key={j}
                        >
                          {exercise.name}
                        </Button>
                      )
                    })}
                    {'}'}
                  </div>

                  <Button
                    type="button"
                    className="!p-0 !w-fit text-sm hover:underline hover:underline-offset-2"
                    onClick={() =>
                      setSuperSetToAppend(superSetToAppend ? null : superset)
                    }
                  >
                    {superSetToAppend ? 'Exit' : 'Add to Superset'}
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg">
          {superSetToAppend ? 'Add to superset' : 'Create a new superset'}
        </h3>
        {exercisesToAdd ? (
          <Fragment>
            {' '}
            <ul className="flex items-center gap-2 mb-12 pl-2">
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
            <Button
              type="button"
              disabled={invalidSave}
              onClick={handleSaveSuperset}
              className="bg-green-500 rounded-md !px-8 !py-2 text-sm !w-fit ml-2"
            >
              Save
            </Button>
          </Fragment>
        ) : (
          <span className="text-sm pl-2">
            {superSetToAppend
              ? 'You need at least one available exercise add to the superset.'
              : 'You need at least two available exercises to form a superset.'}
          </span>
        )}
      </div>
    </Fragment>
  )

  return (
    <form className="flex flex-col w-full max-w-[450px] gap-6">
      {renderedInputs}
      {renderedExerciseForms}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          onClick={handleAddExercise}
          className="bg-gray-700 hover:bg-violet-400 active:bg-violet-400 text-sm"
        >
          Add Exercise
        </Button>
        <Button
          type="button"
          ref={supersetBtn}
          className="bg-gray-700 text-sm"
        >
          Supersets
        </Button>
        <Modal
          button={supersetBtn}
          onClose={() => {
            setSuperSetToAppend(null)
            setActiveSuperSet([])
          }}
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
        <Button className="text-sm bg-gray-700 hover:bg-green-500 active:bg-green-500">
          Save
        </Button>
        <Button className="text-sm bg-gray-700 hover:bg-green-500 active:bg-green-500">
          Save & Exit
        </Button>
      </div>
      <Button className="mr-auto !w-fit !p-0 mt-6 underline underline-offset-2 text-sm text-gray-400">
        Delete Workout
      </Button>
    </form>
  )
}
