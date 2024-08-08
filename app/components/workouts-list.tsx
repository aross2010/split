'use client'
import { RxCaretDown } from 'react-icons/rx'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiltersData, WorkoutInDb, Filters } from '../libs/types'
import Workout from './ui/workout'
import { Fragment, useEffect, useRef, useState } from 'react'
import Dropdown from './ui/dropdown'
import DropdownList from './ui/dropdown-list'
import { FilterType } from '../libs/types'
import { IoIosCloseCircle } from 'react-icons/io'
import { filterWorkouts } from '../functions/filter-workouts'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6'
import Button from './ui/button'
import { motion } from 'framer-motion'

type WorkoutsProps = {
  workouts: WorkoutInDb[]
  filtersData: FiltersData
}

const filterOptions = [
  {
    name: 'Workout',
    value: 'workout',
  },
  {
    name: 'Exercise',
    value: 'exercise',
  },
  {
    name: 'Location',
    value: 'location',
  },
] as const

export default function WorkoutsList({ workouts, filtersData }: WorkoutsProps) {
  const [filters, setFilters] = useState<Filters>({
    workout: null,
    exercise: new Set<string>(),
    location: null,
  })
  const [workoutsToDisplay, setWorkoutsToDisplay] =
    useState<WorkoutInDb[]>(workouts)
  const [activeFilterType, setActiveFilterType] = useState<FilterType | null>(
    null
  )
  const [isSortDesc, setIsSortDesc] = useState(true)
  const [maxDisplayedWorkouts, setMaxDisplayedWorkouts] = useState(25)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setWorkoutsToDisplay(filterWorkouts(filters, workouts))
    setURLParams(filters)
  }, [filters])

  useEffect(() => {
    const exercise = searchParams.get('exercise')
    const location = searchParams.get('location')
    const workout = searchParams.get('workout')
    const newFilters = { ...filters }
    if (exercise) {
      newFilters.exercise = new Set(exercise.split(','))
    }
    if (location) {
      newFilters.location = location
    }
    if (workout) {
      newFilters.workout = workout
    }
    setFilters(newFilters)
  }, [searchParams])

  useEffect(() => {
    const workoutsCopy = [...workoutsToDisplay]
    workoutsCopy.sort((a, b) => {
      if (isSortDesc)
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      else return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    setWorkoutsToDisplay(workoutsCopy)
  }, [isSortDesc])

  const setURLParams = (filters: Filters) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([filterType, filterValue]) => {
      if (filterType === 'exercise' && (filterValue as Set<string>).size >= 1) {
        params.append(
          filterType,
          Array.from(filterValue as Set<string>).join(',')
        )
      } else if (filterValue && filterType !== 'exercise') {
        params.append(filterType, filterValue as string)
      }
    })
    router.push(`/workouts?${params.toString()}`)
    setWorkoutsToDisplay(filterWorkouts(filters, workouts))
  }

  const workoutButtonRef = useRef<HTMLButtonElement>(null)
  const exerciseButtonRef = useRef<HTMLButtonElement>(null)
  const locationButtonRef = useRef<HTMLButtonElement>(null)

  const handleFilterSelect = (filter: string, remove?: boolean) => {
    if (!activeFilterType) return
    if (remove) {
      handleRemoveFilter(activeFilterType, filter)
    } else {
      const newFilters = { ...filters }
      if (activeFilterType === 'workout' || activeFilterType === 'location') {
        newFilters[activeFilterType] = filter
      } else {
        newFilters.exercise.add(filter)
      }
      setURLParams(newFilters)
      setFilters(newFilters)
    }
    if (activeFilterType === 'workout') {
      workoutButtonRef.current?.click()
    } else if (activeFilterType === 'exercise') {
      exerciseButtonRef.current?.click()
    } else {
      locationButtonRef.current?.click()
    }
  }

  const handleRemoveFilter = (filterType: FilterType, exercise?: string) => {
    if (exercise) {
      const newFilters = { ...filters }
      newFilters.exercise.delete(exercise)
      setFilters(newFilters)
    } else {
      setFilters({ ...filters, [filterType]: null })
    }
  }

  const renderedFilters = filterOptions.map((filter, i) => {
    const { name, value } = filter
    return (
      <Fragment key={name}>
        <button
          ref={
            i === 0
              ? workoutButtonRef
              : i === 1
              ? exerciseButtonRef
              : locationButtonRef
          }
          type="button"
          value={value}
          key={name}
          className={`flex items-center gap-1 p-2 hover:bg-violet-400 transition-all ${
            i == 0 ? 'rounded-l-md' : i == 2 ? 'rounded-r-md' : ''
          } ${activeFilterType == value ? 'bg-violet-400' : ''} `}
        >
          {name} <RxCaretDown className="text-gray-200" />{' '}
        </button>

        <Dropdown
          opener={
            i === 0
              ? workoutButtonRef
              : i === 1
              ? exerciseButtonRef
              : locationButtonRef
          }
          onOpen={() => {
            setTimeout(() => {
              setActiveFilterType(value)
            }, 50)
          }}
          onClose={() => setActiveFilterType(null)}
        >
          <DropdownList
            list={filtersData[value]}
            onClick={handleFilterSelect}
            activeFilters={filters}
          />
        </Dropdown>
      </Fragment>
    )
  })

  const renderedWorkouts = workoutsToDisplay.map((workout, i) => {
    if (i >= maxDisplayedWorkouts) return
    return (
      <li key={i}>
        <Workout workout={workout} />
      </li>
    )
  })

  const renderedDisplayedFilters = Object.entries(filters).map(
    ([filterType, filterValue]) => {
      if (!filterValue) return null
      if (filterType === 'exercise') {
        return Array.from(filterValue).map((exercise) => {
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
              key={exercise}
              className="bg-gray-600 py-1 px-3 flex items-center gap-2 rounded-full"
            >
              {exercise}{' '}
              <button
                onClick={() => handleRemoveFilter(filterType, exercise)}
                type="button"
                className="text-gray-400 hover:text-red-500 transition-all"
              >
                <IoIosCloseCircle />
              </button>
            </motion.div>
          )
        })
      } else if (filterType === 'workout' || filterType === 'location')
        return (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.25,
            }}
            key={filterType}
            className="bg-gray-600 py-1 px-3 flex items-center gap-2 rounded-full"
          >
            {filterValue}{' '}
            <button
              onClick={() => handleRemoveFilter(filterType)}
              type="button"
              className="text-gray-400 hover:text-red-500 transition-all"
            >
              <IoIosCloseCircle />
            </button>
          </motion.div>
        )
    }
  )

  const numOfFilters = Object.values(filters).reduce((acc, filter) => {
    if (filter) {
      if (typeof filter === 'string') return acc + 1
      return acc + (filter as Set<string>).size
    }
    return acc
  }, 0)

  return (
    <div className="w-full max-w-[550px]">
      <div className="flex flex-col items-center">
        <h3 className="text-xl mb-2">Filter by </h3>

        <div className="mb-6 relative bg-gray-700 rounded-md grid grid-cols-3 gap-0">
          {renderedFilters}
        </div>
        <div className="mb-6 flex items-center flex-wrap gap-2 justify-center transition-all">
          {renderedDisplayedFilters}
          {numOfFilters >= 2 && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
            >
              <button
                onClick={() => {
                  setFilters({
                    workout: null,
                    exercise: new Set(),
                    location: null,
                  })
                  setURLParams({
                    workout: null,
                    exercise: new Set(),
                    location: null,
                  })
                }}
                type="button"
                className="bg-gray-700 py-1 px-3 flex items-center gap-2 rounded-full text-gray-400 hover:bg-red-500 hover:text-gray-50 transition-all"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </div>
      {workoutsToDisplay.length === 0 && (
        <p className="text-center mt-6">No workouts found.</p>
      )}
      {workoutsToDisplay.length > 0 && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="px-2 mb-0.5 flex items-center justify-between text-gray-200"
        >
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <button
              type="button"
              onClick={() => setIsSortDesc(!isSortDesc)}
              className=" group flex font-medium items-center gap-1"
            >
              <span className="group-hover:text-violet-400 transition-all">
                Date
              </span>
              <FaArrowDown
                className={`transition-all text-gray-400 text-sm group-hover:text-violet-400 ${
                  !isSortDesc ? '-rotate-180' : ''
                }`}
              />
            </button>
          </div>
          <span>
            {workoutsToDisplay.length}{' '}
            {workoutsToDisplay.length == 1 ? 'Workout' : 'Workouts'}
          </span>
        </motion.div>
      )}

      <ul className="flex flex-col gap-6">{renderedWorkouts}</ul>
      {maxDisplayedWorkouts < workoutsToDisplay.length && (
        <div className="flex justify-center mt-8">
          <Button
            type="button"
            onClick={() => setMaxDisplayedWorkouts((prev) => prev + 25)}
            className="mt-4 text-sm !w-fit flex items-center gap-1 !px-4 !py-2 bg-gray-600"
          >
            Load More <FaArrowDown className="text-sm text-gray-200" />
          </Button>
        </div>
      )}
    </div>
  )
}
