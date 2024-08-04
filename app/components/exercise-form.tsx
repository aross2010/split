import { useRef, useState, Fragment, useEffect } from 'react'
import TextInput from './ui/text-input'
import { Exercise } from '../libs/types'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import Modal from './ui/modal'
import Button from './ui/button'
import { Set } from '../libs/types'
import { set } from 'react-datepicker/dist/date_utils'

type ExerciseFormProps = {
  exercises: Exercise[]
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>
  index: number
}

const setInputs = [
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
  {
    name: 'partialReps',
    type: 'number',
    label: 'Partials',
  },
] as const

export default function ExerciseForm({
  exercises,
  setExercises,
  index,
}: ExerciseFormProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeDropset, setActiveDropset] = useState<Set[]>([])
  const [dropsetToAppend, setDropsetToAppend] = useState<Set[] | null>(null)

  const dropSetBtn = useRef<HTMLButtonElement>(null)

  const handleDeleteExercise = () => {
    setExercises((prev) => {
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleAddSet = (set?: Set) => {
    const newExercises = [...exercises]
    if (set) {
      const indexOfSet = newExercises[index].sets?.indexOf(set)
      if (indexOfSet !== -1) {
        newExercises[index].sets.splice(indexOfSet + 1, 0, {
          ...set,
          id: Math.random().toString(),
        })
      }
    } else {
      const baseSet = {
        reps: null,
        weight: null,
        rpe: null,
        partialReps: null,
        inDropset: false,
        id: Math.random().toString(),
      }
      newExercises[index].sets?.push(baseSet)
    }

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

  const handleActiveDropsetChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    set: Set
  ) => {
    if (e.target.checked) {
      setActiveDropset((prev) => [...prev, set])
    } else {
      setActiveDropset((prev) => prev.filter((s) => s !== set))
    }
  }

  const handleSaveDropset = () => {
    if (!dropsetToAppend) {
      const newExercises = [...exercises]
      newExercises[index].dropsets.push(activeDropset)
      setExercises(newExercises)
    } else {
      const newDropsets = [...exercises[index].dropsets]
      const indexOfDropset = newDropsets.indexOf(dropsetToAppend)
      newDropsets[indexOfDropset] = [
        ...newDropsets[indexOfDropset],
        ...activeDropset,
      ]
      setExercises((prev) => {
        const newExercises = [...prev]
        newExercises[index].dropsets = newDropsets
        return newExercises
      })
      setDropsetToAppend(null)
    }
    activeDropset.forEach((set) => {
      set.inDropset = true
    })
    setActiveDropset([])
  }

  const removeSetFromDropset = (dropset: Set[], setIndex: number) => {
    const newDropsets = [...exercises[index].dropsets]
    dropset[setIndex].inDropset = false
    dropset.splice(setIndex, 1)
    if (dropset.length <= 1) {
      newDropsets.splice(newDropsets.indexOf(dropset), 1)
      dropset.forEach((set) => {
        set.inDropset = false
      })
    }
    setExercises((prev) => {
      const newExercises = [...prev]
      newExercises[index].dropsets = newDropsets
      return newExercises
    })
  }

  const renderedSetInputs = exercises[index].sets?.map((set, i) => {
    return (
      <div
        key={i}
        className="flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => handleAddSet(set)}
          className={`text-green-500/75 text-sm ${i == 0 ? 'mt-8' : ''}`}
        >
          <FaPlusCircle />
        </button>
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
                  step={input.name === 'rpe' ? 0.5 : 1}
                  value={
                    String(exercises[index].sets[i][input.name as keyof Set]) ||
                    ''
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
          className={`text-red-500/75 text-sm ${i == 0 ? 'mt-8' : ''}`}
        >
          <FaMinusCircle />
        </button>
      </div>
    )
  })

  const availableSetsToDropset = exercises[index].sets?.filter(
    (set) => !set.inDropset
  )

  const setsToAdd =
    availableSetsToDropset.length >= 2 ||
    (dropsetToAppend && availableSetsToDropset.length >= 1)

  const invalidSave =
    (activeDropset.length < 2 && !dropsetToAppend) ||
    (activeDropset.length < 1 && dropsetToAppend !== null)

  const dropSetModal = (
    <Fragment>
      {exercises[index].dropsets?.length >= 1 && (
        <div className="flex flex-col gap-4 mb-8">
          <h3 className="text-lg">
            Current Dropsets{' '}
            <span className="text-sm ml-3 text-gray-400">
              (Click to remove)
            </span>
          </h3>

          <ul
            className={`text-sm flex flex-col gap-4 ${
              setDropsetToAppend !== null ? 'px-2' : 'px-0'
            }`}
          >
            {exercises[index].dropsets?.map((dropset, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center gap-2"
                >
                  <ul
                    className={`flex items-center gap-2 ${
                      dropsetToAppend == dropset
                        ? ' bg-violet-400/75 rounded-md'
                        : ''
                    }`}
                  >
                    {'{'}
                    {dropset.map((set, j) => {
                      return (
                        <li key={j}>
                          <Button
                            type="button"
                            className="!w-fit !p-0 hover:underline hover:underline-offset-2"
                            onClick={() => removeSetFromDropset(dropset, j)}
                          >
                            Set {exercises[index].sets?.indexOf(set) + 1}
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
                      setDropsetToAppend(dropsetToAppend ? null : dropset)
                    }
                    hidden={
                      dropsetToAppend !== null && dropsetToAppend !== dropset
                    }
                  >
                    {dropsetToAppend ? 'Exit' : 'Add to Superset'}
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg">
          {dropsetToAppend ? 'Add to dropset' : 'Create a new dropset'}
        </h3>
        {setsToAdd ? (
          <Fragment>
            <ul className="flex flex-wrap gap-4 mb-6">
              {exercises[index].sets?.map((set, i) => {
                if (set.inDropset) return null
                return (
                  <li key={i}>
                    <input
                      hidden
                      type="checkbox"
                      name={set.id}
                      id={set.id}
                      checked={activeDropset.includes(set)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleActiveDropsetChange(e, set)
                      }
                    />
                    <label
                      htmlFor={set.id}
                      className="rounded-full py-2 px-4 text-sm bg-gray-600 text-gray-200 transition-all cursor-pointer select-none"
                    >
                      Set {i + 1}
                      {set.reps && ` • ${set.reps} reps`}
                      {set.weight && ` • ${set.weight} lbs`}
                      {set.rpe && ` • RPE ${set.rpe}`}
                    </label>
                  </li>
                )
              })}
            </ul>
            <Button
              type="button"
              className="bg-green-500 rounded-md !px-8 !py-2 text-sm !w-fit"
              onClick={handleSaveDropset}
              disabled={invalidSave}
            >
              Save
            </Button>
          </Fragment>
        ) : (
          <span className="text-sm text-gray-400">
            You need at least two available exercises to create a new dropset.
          </span>
        )}
      </div>
    </Fragment>
  )

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
          <Button
            type="button"
            className="!p-2 bg-gray-700 text-sm"
            onClick={() => handleAddSet()}
          >
            Add New Set
          </Button>
          <Button
            type="button"
            disabled={exercises[index].inSuperSet}
            className="!p-2 bg-gray-700 text-sm"
            ref={dropSetBtn}
          >
            Dropsets
          </Button>
          <Modal
            onClose={() => setActiveDropset([])}
            button={dropSetBtn}
          >
            {dropSetModal}
          </Modal>
        </div>
        <div className="flex justify-between items-center mt-6">
          <Button
            type="button"
            onClick={() => {
              if (!exercises[index].name) handleDeleteExercise()
              else setIsOpen(false)
            }}
            className="!w-fit !p-0 underline underline-offset-2 text-sm text-gray-400"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleDeleteExercise}
            className="!w-fit !p-0 underline underline-offset-2 text-sm text-gray-400"
          >
            Delete
          </Button>
        </div>
      </div>
      <div
        className={`${isOpen ? 'hidden' : 'flex'} justify-between items-center`}
        hidden={isOpen}
      >
        <h3 className="text-lg">
          {exercises[index].name}{' '}
          <span className="text-gray-400">
            ({exercises[index].sets.length})
          </span>{' '}
        </h3>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="!w-fit !p-0 underline underline-offset-2 text-sm text-gray-400"
        >
          Edit
        </Button>
      </div>
    </section>
  )
}
