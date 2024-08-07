import { WorkoutInDb, Filters } from '../libs/types'

export const filterWorkouts = (
  filters: Filters,
  workouts: WorkoutInDb[]
): WorkoutInDb[] => {
  return workouts.filter((workout) => {
    console.log(filters)
    if (filters.workout && workout.workoutName !== filters.workout) {
      return false
    }
    if (filters.location && workout.location !== filters.location) {
      return false
    }
    if (filters.exercise.size > 0) {
      const exerciseNames = workout.exercises.map((exercise) => exercise.name)
      const hasAllExercises = Array.from(filters.exercise).every((ex) =>
        exerciseNames.includes(ex)
      )
      if (!hasAllExercises) {
        return false
      }
    }
    return true
  })
}
