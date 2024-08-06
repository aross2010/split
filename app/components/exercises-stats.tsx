'use client'

import { WorkoutInDb } from '../libs/types'
import { useState, useRef, useEffect } from 'react'
import Dropdown from './ui/dropdown'
import DropdownList from './ui/dropdown-list'
import TextInput from './ui/text-input'
import { set } from 'react-datepicker/dist/date_utils'
import { text } from 'stream/consumers'
import { useRouter, useSearchParams } from 'next/navigation'

type ExerciseStatsProps = {
  exerciseNames: string[]
  workouts: WorkoutInDb[]
}

export default function ExerciseStats({
  exerciseNames,
  workouts,
}: ExerciseStatsProps) {
  const [textResults, setTextResults] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    setSelectedIndex(0)
  }, [textResults])

  useEffect(() => {
    const exercise = searchParams.get('name')
    if (exercise && exercise !== selectedExercise) setSelectedExercise(exercise)
  }, [searchParams])

  const handleSearch = (input: string) => {
    if (input.length === 0) setDropdownOpen(false)
    setSearch(input)
    const results = exerciseNames.filter((name) =>
      name.toLowerCase().includes(input.toLowerCase())
    )
    setTextResults(results)
    if (results.length > 0 && input.length > 0) setDropdownOpen(true)
    else setDropdownOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (textResults.length === 0) return

    const prevIndex = selectedIndex
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prevIndex + 1) % textResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(
        (prevIndex - 1 + textResults.length) % textResults.length
      )
    } else if (e.key === 'Enter') {
      handleSelectExercise(textResults[selectedIndex])
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
      setTextResults([])
    }
  }

  const handleSelectExercise = (exercise: string) => {
    setSelectedExercise(exercise)
    setDropdownOpen(false)
    setTextResults([])
    const textInputElement = document.querySelector(
      '.exercise-search'
    ) as HTMLInputElement
    textInputElement.blur()
    setSearch('')
    router.push(`/exercises?name=${exercise}`)
  }

  return (
    <div className="mt-12 w-full flex flex-col items-center">
      <div className="w-full max-w-[400px] relative">
        <TextInput
          className="exercise-search"
          onFocus={(e) => {
            if (textResults.length > 0 && e.target.value.length > 0)
              setDropdownOpen(true)
          }}
          onBlur={() => {
            setSearch('')
            setDropdownOpen(false)
          }}
          type="text"
          value={search}
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for an exercise..."
        />
        <Dropdown opener={dropdownOpen}>
          <DropdownList
            list={textResults}
            onClick={handleSelectExercise}
            selectedIndex={selectedIndex}
          />
        </Dropdown>
      </div>
      {selectedExercise && (
        <div className="mt-12 w-full max-w-[600px] rounded-md p-3 bg-gray-700">
          {selectedExercise}
        </div>
      )}
    </div>
  )
}
