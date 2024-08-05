'use client'
import { RxCaretDown } from 'react-icons/rx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FiltersData, WorkoutInDb, Filters } from '../libs/types'
import Workout from './ui/workout'
import { Fragment, useEffect, useRef, useState } from 'react'
import Dropdown from './ui/dropdown'
import DropdownList from './ui/dropdown-list'
import { FilterType } from '../libs/types'
import { IoIosCloseCircle } from 'react-icons/io'
import { filterWorkouts } from '../functions/filter-workouts'

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
  const router = useRouter()
  const searchParams = useSearchParams()

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
    console.log('filter chanfed')
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
  }, [filters])

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
          className={`flex items-center gap-2 p-2 hover:bg-violet-400 transition-all ${
            i == 0 ? 'rounded-l-md' : i == 2 ? 'rounded-r-md' : ''
          } ${activeFilterType == value ? 'bg-violet-400' : ''} `}
        >
          {name} <RxCaretDown className="text-gray-200" />{' '}
        </button>

        <Dropdown
          openButton={
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
            <div
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
            </div>
          )
        })
      } else if (filterType === 'workout' || filterType === 'location')
        return (
          <div
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
          </div>
        )
    }
  )

  return (
    <div className="w-full max-w-[550px]">
      <div className="flex flex-col items-center">
        <h3 className="text-xl mb-4">Filter by </h3>
        <div className="mb-6 relative bg-gray-700 rounded-md grid grid-cols-3 gap-0">
          {renderedFilters}
        </div>
        <div className="mb-6 flex items-center flex-wrap gap-2 justify-center transition-all">
          {renderedDisplayedFilters}
        </div>
      </div>
      {workoutsToDisplay.length === 0 && (
        <p className="text-center mt-6">
          No workouts found with the selected filters.
        </p>
      )}
      <ul className="flex flex-col gap-6">{renderedWorkouts}</ul>
    </div>
  )
}
