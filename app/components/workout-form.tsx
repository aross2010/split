'use client'
import { Fragment, useRef, useState } from 'react'
import TextInput from './ui/text-input'
import ExerciseForm from './exercise-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Exercise, FiltersData, WorkoutData, WorkoutInDb } from '../libs/types'
import Modal from './ui/modal'
import Button from './ui/button'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import SubmitButton from './ui/submit-btn'
import Dropdown from './ui/dropdown'
import DropdownList from './ui/dropdown-list'
import SearchInput from './ui/search-input'
import { set } from 'react-datepicker/dist/date_utils'

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
] as const

const BASE_EXERCISE = {
  name: '',
  sets: [
    {
      reps: null,
      partialReps: null,
      weight: null,
      rpe: null,
      inDropset: false,
      id: Math.random().toString(),
    },
  ],
  dropsets: [],
  inSuperSet: false,
  id: 'werewrew',
} as Exercise

type WorkoutFormProps = {
  workout?: WorkoutInDb
  uniqueHistory: FiltersData
}

export default function WorkoutForm({
  workout,
  uniqueHistory,
}: WorkoutFormProps) {
  const [data, setData] = useState<WorkoutData | WorkoutInDb>(
    workout
      ? workout
      : {
          workoutName: '',
          location: '',
          notes: '',
          supersets: [],
        }
  )
  const [date, setDate] = useState<Date | null>(
    workout ? workout.date : new Date()
  )
  const [exercises, setExercises] = useState<Exercise[]>(
    workout ? workout.exercises : [BASE_EXERCISE]
  )
  const [activeSuperSet, setActiveSuperSet] = useState<Exercise[]>([])
  const [superSetToAppend, setSuperSetToAppend] = useState<Exercise[] | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)

  const supersetBtn = useRef<HTMLButtonElement>(null)
  const exerciseRefs = useRef<(HTMLDivElement | null)[]>([])

  const router = useRouter()

  const handleSubmitWorkout = async (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    const submitType = e.nativeEvent.submitter.value
    const workoutData = {
      ...data,
      date,
      exercises,
    }
    try {
      if (!workout) {
        const res = await axios.post('/api/workouts', workoutData)
        if (submitType === 'exit') {
          router.replace('/workouts')
        }
        toast.success('Workout saved successfully.')
      } else {
        const res = await axios.put(`/api/workouts/${workout.id}`, workoutData)
        if (submitType === 'exit') {
          router.replace('/workouts')
        }
        toast.success('Workout updated successfully.')
      }
    } catch (e: any) {
      if (e.response.data.error) toast.error(e.response.data.error)
      else toast.error('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteWorkout = async () => {
    if (!workout) return
    setSubmitting(true)
    try {
      await axios.delete(`/api/workouts/${workout.id}`)
      router.replace('/workouts')
      toast.success('Workout deleted successfully.')
    } catch (e: any) {
      if (e.response.data.error) toast.error(e.response.data.error)
      else toast.error('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

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
          <SearchInput
            name={input.name}
            type={input.type}
            value={data[input.name as keyof typeof data] as string}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                [input.name]: e.target.value,
              }))
            }}
            input={data[input.name as keyof typeof data] as string}
            items={
              input.name === 'location'
                ? uniqueHistory.location
                : uniqueHistory.workout
            }
            onClick={(item) =>
              setData((prev) => ({ ...prev, [input.name]: item }))
            }
            className="bg-gray-700 relative"
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
          exerciseNames={uniqueHistory.exercise}
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
            reps: null,
            partialReps: null,
            weight: null,
            rpe: null,
            inDropset: false,
            id: Math.random().toString(),
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

  const removeExerciseFromSuperset = (
    superset: Exercise[],
    exerciseIndex: number
  ) => {
    const newSupersets = [...data.supersets]
    const newExercises = [...exercises]
    newSupersets.forEach((superset, i) => {
      superset.forEach((exercise, j) => {
        if (exercise.id === superset[exerciseIndex].id) {
          exercises.forEach((ex) => {
            if (ex.id === exercise.id) {
              ex.inSuperSet = false
            }
          })
        }
      })
      superset.splice(exerciseIndex, 1)
      if (superset.length <= 1) {
        newExercises.forEach((exercise) => (exercise.inSuperSet = false))
        newSupersets.splice(newSupersets.indexOf(superset), 1)
      }
    })
    setData((prev) => ({ ...prev, supersets: newSupersets }))
    setExercises(newExercises)
  }

  const handleSaveSuperset = () => {
    if (!superSetToAppend) {
      setData((prev) => ({
        ...prev,
        supersets: [...prev.supersets, activeSuperSet],
      }))
    } else {
      const supersets = [...data.supersets]
      const index = supersets.findIndex(
        (superset) => superset === superSetToAppend
      )
      supersets[index] = [...supersets[index], ...activeSuperSet]
      setData((prev) => ({ ...prev, supersets }))
      setSuperSetToAppend(null)
    }
    activeSuperSet.forEach((exercise) => (exercise.inSuperSet = true))
    setActiveSuperSet([])
  }

  const handleActiveSupersetChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    exercise: Exercise
  ) => {
    if (
      (activeSuperSet.length >= 1 &&
        activeSuperSet[activeSuperSet.length - 1].sets) ||
      superSetToAppend
    ) {
      if (
        superSetToAppend &&
        exercise.sets.length !== superSetToAppend[0].sets.length
      ) {
        toast.error(
          'All exercises in a superset must have the same number of sets.'
        )
        return
      } else if (
        activeSuperSet.length >= 1 &&
        activeSuperSet[activeSuperSet.length - 1].sets.length !==
          exercise.sets.length
      ) {
        toast.error(
          'All exercises in a superset must have the same number of sets.'
        )
        return
      }
    }

    if (e.target.checked) {
      setActiveSuperSet((prev) => [...prev, exercise])
    } else {
      setActiveSuperSet((prev) => prev.filter((ex) => ex.id !== exercise.id))
    }
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
        <div className="flex flex-col gap-4 mb-8">
          <h3 className="text-lg">
            Current Supersets{' '}
            <span className="text-sm ml-3 text-gray-400">
              (Click to remove)
            </span>
          </h3>
          <ul
            className={`flex flex-col gap-4 text-sm flex-wrap ${
              superSetToAppend ? 'px-2' : 'px-0'
            }`}
          >
            {data.supersets.map((superset, i) => {
              return (
                <li
                  key={i}
                  className={`flex items-center gap-2`}
                >
                  <ul
                    className={`flex items-center gap-2 ${
                      superSetToAppend === superset
                        ? 'bg-violet-400/75 rounded-md'
                        : ''
                    }`}
                  >
                    {'{'}
                    {superset.map((exercise, j) => {
                      return (
                        <li key={j}>
                          <Button
                            type="button"
                            className="!w-fit !p-0 hover:underline hover:underline-offset-2"
                            onClick={() =>
                              removeExerciseFromSuperset(superset, j)
                            }
                          >
                            {exercise.name}
                          </Button>
                        </li>
                      )
                    })}
                    {'}'}
                  </ul>

                  <Button
                    type="button"
                    className="!p-0 !w-fit text-sm hover:underline hover:underline-offset-2"
                    onClick={() =>
                      setSuperSetToAppend(superSetToAppend ? null : superset)
                    }
                    hidden={
                      superSetToAppend !== null && superSetToAppend !== superset
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
            <ul className="flex items-center gap-4 mb-12 flex-wrap">
              {exercises.map((exercise, i) => {
                if (!exercise.inSuperSet && exercise.name.length > 0)
                  return (
                    <li key={i}>
                      <input
                        type="checkbox"
                        name={exercise.id}
                        id={exercise.id}
                        checked={activeSuperSet.includes(exercise)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleActiveSupersetChange(e, exercise)
                        }
                        hidden
                      />
                      <label
                        htmlFor={exercise.id}
                        className="rounded-full py-2 px-4 text-sm bg-gray-600 text-gray-200 transition-all cursor-pointer select-none"
                      >
                        {exercise.name}
                        {exercise.sets && ` (${exercise.sets.length})`}
                      </label>
                    </li>
                  )
              })}
            </ul>
            <Button
              type="button"
              disabled={invalidSave}
              onClick={handleSaveSuperset}
              className="bg-green-500 rounded-md !px-8 !py-2 text-sm !w-fit"
            >
              Save
            </Button>
          </Fragment>
        ) : (
          <span className="text-sm text-gray-400">
            {superSetToAppend
              ? 'You need at least one available exercise add to the superset.'
              : 'You need at least two available exercises to create a new superset.'}
          </span>
        )}
      </div>
    </Fragment>
  )

  return (
    <form
      className="flex flex-col w-full gap-6"
      onSubmit={handleSubmitWorkout}
    >
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
        <SubmitButton
          disabled={submitting}
          value={'save'}
          className="text-sm bg-gray-700 flex justify-center [&:not(:disabled)]:hover:bg-green-500 [&:not(:disabled)]:active:bg-green-500"
        >
          Save
        </SubmitButton>
        <SubmitButton
          disabled={submitting}
          value={'exit'}
          className="text-sm bg-gray-700 flex justify-center [&:not(:disabled)]:hover:bg-green-500 [&:not(:disabled)]:active:bg-green-500"
        >
          Save & Exit
        </SubmitButton>
      </div>
      <Button
        disabled={submitting}
        type="button"
        onClick={handleDeleteWorkout}
        className="mr-auto !w-fit !p-0 mt-6 underline underline-offset-2 text-sm text-gray-400"
      >
        Delete Workout
      </Button>
    </form>
  )
}
