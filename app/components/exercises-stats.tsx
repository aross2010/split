'use client'

import { ChartData, ExerciseStatsType, WorkoutInDb } from '../libs/types'
import { useState, useEffect, useRef, Fragment } from 'react'
import Dropdown from './ui/dropdown'
import DropdownList from './ui/dropdown-list'
import TextInput from './ui/text-input'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from './ui/button'
import { getExerciseStats } from '../functions/get-exercises-stats'
import { BiCalendarCheck } from 'react-icons/bi'
import { RiBracesFill } from 'react-icons/ri'
import { motion } from 'framer-motion'
import {
  FaLocationDot,
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaRepeat,
} from 'react-icons/fa6'
import IconCard from './ui/icon-card'
import Modal from './ui/modal'
import SubmitButton from './ui/submit-btn'
import axios from 'axios'
import toast from 'react-hot-toast'
import SearchInput from './ui/search-input'
import ChartLine from './ui/chart-line'

type ExerciseStatsProps = {
  exerciseNames: string[]
  workouts: WorkoutInDb[]
}

const facts = [
  {
    title: 'Workouts',
    value: 'totalWorkouts',
    icon: <BiCalendarCheck />,
  },
  {
    title: 'Sets',
    value: 'totalSets',
    icon: <RiBracesFill />,
  },
  {
    title: 'Reps',
    value: 'totalReps',
    icon: <FaRepeat />,
  },
  {
    title: 'Locations',
    value: 'totalLocations',
    icon: <FaLocationDot />,
  },
  {
    title: 'PL',
    value: 'PL',
    icon: <FaArrowTrendDown />,
  },
  {
    title: 'PR',
    value: 'PR',
    icon: <FaArrowTrendUp />,
  },
] as const

export default function ExerciseStats({
  exerciseNames,
  workouts,
}: ExerciseStatsProps) {
  const [search, setSearch] = useState('')
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseStatsType | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const editButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const exercise = searchParams.get('name')
    if (exercise && exercise !== selectedExercise?.name)
      setSelectedExercise(getExerciseStats(exercise, workouts))
  }, [searchParams])

  const handleSelectExercise = (exercise: string) => {
    setSelectedExercise(getExerciseStats(exercise, workouts))
    const textInputElement = document.querySelector(
      '.exercise-search'
    ) as HTMLInputElement
    textInputElement.blur()
    setSearch('')
    router.push(`/exercises?name=${exercise}`)
  }

  const handleChangeName = async (formData: FormData) => {
    if (!selectedExercise) return
    const newExerciseName = formData.get('newExerciseName')
    if (typeof newExerciseName === 'string' && newExerciseName.length < 1) {
      toast.error('Exercise name must be at least one character.')
      return
    }
    try {
      await axios.put(`/api/exercises`, {
        oldExerciseName: selectedExercise.name,
        newExerciseName,
      })
      toast.success(`Successfully changed name to ${newExerciseName}!`)
      const modalButtonClose = document.querySelector(
        '.modal-button-close'
      ) as HTMLButtonElement
      if (modalButtonClose) {
        modalButtonClose.click()
      }
      router.push(`/exercises?name=${newExerciseName}`)
    } catch (e: any) {
      if (e.response.data.error) toast.error(e.response.data.error)
      else toast.error('Something went wrong.')
    }
  }

  const editNameModal = selectedExercise && (
    <Fragment>
      <h3 className="font-medium mb-6">Change {selectedExercise.name} to...</h3>
      <form action={handleChangeName}>
        <TextInput
          type="text"
          placeholder="New Name"
          name="newExerciseName"
          className="w-full !bg-gray-600"
        />
        <SubmitButton className="mt-4 text-sm !w-fit !px-4 !py-2 bg-violet-400">
          Change Name
        </SubmitButton>
      </form>
    </Fragment>
  )

  const renderedFacts =
    selectedExercise &&
    facts.map((fact) => {
      const { value, title, icon } = fact
      return (
        <IconCard
          key={title}
          title={title}
          icon={icon}
          value={selectedExercise[value]}
          link={
            value === 'totalWorkouts'
              ? `/workouts?exercise=${selectedExercise.name}`
              : undefined
          }
        />
      )
    })

  return (
    <div className="mt-8 w-full flex flex-col items-center">
      <div className="w-full max-w-[400px] relative">
        <SearchInput
          className="exercise-search"
          autoFocus
          type="text"
          value={search}
          input={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          onClick={(item) => handleSelectExercise(item as string)}
          items={exerciseNames}
          placeholder="Search for an exercise..."
        />
      </div>
      {selectedExercise && (
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-full rounded-lg p-4 bg-gray-700"
        >
          <h3 className="font-medium text-lg">{selectedExercise.name}</h3>
          <Button
            ref={editButtonRef}
            type="button"
            className="!w-fit !p-0 underline underline-offset-2 text-gray-400 text-sm"
          >
            Edit Name
          </Button>
          <Modal button={editButtonRef}>{editNameModal}</Modal>
          <div className="grid sm:grid-cols-3 md:grid-cols-6 grid-cols-2 sm:gap-3 gap-2 w-full mt-6">
            {renderedFacts}
          </div>
          <div className="mt-8">
            {selectedExercise.topSets.length >= 2 ? (
              <Fragment>
                <h3 className="font-medium text-lg mb-4">Progression Chart</h3>
                <ChartLine chartData={selectedExercise.topSets} />
              </Fragment>
            ) : (
              <span className="text-gray-400">
                Not enough data to display progression chart.
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
