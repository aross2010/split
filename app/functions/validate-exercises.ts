import { Exercise } from '../libs/types'

export const validateExercises = (exercises: Exercise[]): Exercise[] => {
  exercises.forEach((ex) => {
    if (!ex.name) {
      throw new Error('Exercise name is required for all exercises.')
    } else {
      ex.name = ex.name.trim()
    }
    ex.sets = ex.sets.filter((set) => {
      return set.reps !== null
    })
    ex.sets.forEach((set) => {
      set.reps = parseInt(set.reps as unknown as string) || 0
      set.partialReps = parseInt(set.partialReps as unknown as string) || 0
      set.weight = parseFloat(set.weight as unknown as string) || 0
      set.rpe = parseFloat(set.rpe as unknown as string) || 0
    })
  })

  return exercises
}
