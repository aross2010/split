import type { Exercise, ExercisesFormatted, Set } from '../libs/types'

export const formatExercises = (
  exercises: Exercise[],
  supersets: Exercise[][]
) => {
  const exercisesFormatted = [] as ExercisesFormatted[]
  let supersetsMap = new Map<string, string[]>()
  supersets.forEach((superset) => {
    superset.forEach((exercise) => {
      supersetsMap.set(
        exercise.id,
        superset.filter((ex) => ex.id !== exercise.id).map((ex) => ex.name)
      )
    })
  })
  exercises.forEach((exercise, i) => {
    const name = exercise.name
    const sets = []
    for (let i = 0; i < exercise.sets.length; i++) {
      const set = exercise.sets[i]
      const { reps, rpe, partialReps, inDropset } = set
      const weight = set.weight ?? 0
      if (i == 0)
        sets.push({
          [weight]: {
            sets: [
              {
                reps,
                rpe,
                partialReps,
                times: 1,
                inDropset: inDropset ?? false,
              },
            ],
          },
        })
      else {
        const prevSet = exercise.sets[i - 1] as Set
        if (weight == prevSet.weight) {
          // if identical set
          if (
            reps == prevSet.reps &&
            rpe == prevSet.rpe &&
            partialReps == prevSet.partialReps
          ) {
            sets[sets.length - 1][weight].sets[0].times++
          } else if (
            reps !== prevSet.reps ||
            rpe !== prevSet.rpe ||
            partialReps !== prevSet.partialReps
          ) {
            sets[sets.length - 1][weight].sets.push({
              reps,
              rpe,
              partialReps,
              times: 1,
              inDropset: inDropset ?? false,
            })
          }
        } else {
          sets.push({
            [weight]: {
              sets: [
                {
                  reps,
                  rpe,
                  partialReps,
                  times: 1,
                  inDropset: inDropset ?? false,
                },
              ],
            },
          })
        }
      }
    }
    exercisesFormatted.push({
      name,
      sets,
      dropsets: [],
      supersets: supersetsMap,
      id: exercise.id,
    })
  })
  return exercisesFormatted as ExercisesFormatted[]
}
