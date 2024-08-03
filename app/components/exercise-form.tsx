import { useRef, useState, Fragment, useEffect } from 'react'
import TextInput from './ui/text-input'
import { Exercise } from '../libs/types'
import { FaMinusCircle } from 'react-icons/fa'
import Modal from './ui/modal'
import Button from './ui/button'

type ExerciseFormProps = {
  exercises: Exercise[]
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>
  index: number
}

const setInputs = [
  {
    name: 'sets',
    type: 'number',
    label: 'Sets',
  },
  {
    name: 'reps',
    type: 'number',
    label: 'Reps',
  },
  {
    name: 'weight',
    type: 'number',
    label: 'lbs',
  },
  {
    name: 'rpe',
    type: 'number',
    label: 'RPE',
  },
]

export default function ExerciseForm({
  exercises,
  setExercises,
  index,
}: ExerciseFormProps) {
  const [isOpen, setIsOpen] = useState(true)
  const partialRepsBtn = useRef<HTMLButtonElement>(null)

  const handleDeleteExercise = () => {
    setExercises((prev) => {
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleAddSet = () => {
    const baseSet = {
      sets: null,
      reps: null,
      weight: null,
      rpe: null,
    }
    const newExercises = [...exercises]
    newExercises[index].sets?.push(baseSet)
    setExercises(newExercises)
  }

  const handleDeleteSet = (i: number) => {
    const newExercises = [...exercises]
    newExercises[index].sets?.splice(i, 1)
    setExercises(newExercises)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExercises((prev) => {
      const newExercises = [...prev]
      newExercises[index].name = e.target.value
      return newExercises
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const { name, value } = e.target
    const newExercises = [...exercises]
    if (newExercises[index].sets) {
      newExercises[index].sets[i] = {
        ...newExercises[index].sets[i],
        [name]: value,
      }
    }
    setExercises(newExercises)
  }

  const renderedSetInputs = exercises[index].sets?.map((set, i) => {
    return (
      <div
        key={i}
        className="flex items-center gap-2"
      >
        <div className="grid grid-cols-4 gap-2">
          {setInputs.map((input, j) => {
            return (
              <div
                key={j}
                className="flex flex-col gap-2"
              >
                {i == 0 && <label htmlFor={input.name}>{input.label}</label>}
                <TextInput
                  type={input.type}
                  name={input.name}
                  id={input.name}
                  min={0}
                  autoComplete="off"
                  value={
                    exercises[index].sets?.[i][
                      input.name as keyof typeof set
                    ] ?? ''
                  }
                  onChange={(e) => handleChange(e, i)}
                  className="!p-2 text-sm"
                />
              </div>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => handleDeleteSet(i)}
        >
          <FaMinusCircle className={`text-red-500 ${i == 0 ? 'mt-7' : ''}`} />
        </button>
      </div>
    )
  })

  return (
    <section className="bg-gray-800 p-3 rounded-md flex flex-col">
      <div hidden={!isOpen}>
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="exerciseName">Exercise Name</label>
          <TextInput
            type="text"
            name="exerciseName"
            id="exerciseName"
            onChange={handleNameChange}
            value={exercises[index].name}
          />
        </div>
        <div className="mb-12 flex flex-col gap-2">{renderedSetInputs}</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="p-2 bg-gray-700 rounded-md hover:brightness-110 transition-all text-sm"
            onClick={handleAddSet}
          >
            Add Set
          </button>
          <button className="p-2 bg-gray-700 rounded-md hover:brightness-110 transition-all text-sm">
            Dropset
          </button>
          <button
            ref={partialRepsBtn}
            type="button"
            className="p-2 bg-gray-700 rounded-md hover:brightness-110 transition-all text-sm disabled:bg-gray-700/25 disabled:cursor-not-allowed"
          >
            Partial Reps
          </button>

          <button
            type="button"
            onClick={() => {
              if (!exercises[index].name) handleDeleteExercise()
              else setIsOpen(false)
            }}
            className="rounded-md text-sm hover:brightness-110 transition-all p-2 bg-gray-700"
          >
            Close
          </button>
        </div>
        <button
          type="button"
          onClick={handleDeleteExercise}
          className="mr-auto w-fit mt-6 underline underline-offset-2 text-sm text-gray-400"
        >
          Delete
        </button>
      </div>
      <div
        className={`${isOpen ? 'hidden' : 'flex'} justify-between items-center`}
        hidden={isOpen}
      >
        <h3 className="text-lg">{exercises[index].name}</h3>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="!w-fit underline underline-offset-2 text-sm text-gray-400"
        >
          Edit
        </Button>
      </div>
    </section>
  )
}
