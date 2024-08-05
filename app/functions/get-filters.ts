import { WorkoutInDb } from '../libs/types'

export const getFilters = (workouts: WorkoutInDb[]) => {
  const workoutNames = new Set()
  const locations = new Set()
  const exerciseName = new Set()

  workouts.forEach((workout) => {
    workoutNames.add(workout.workoutName)
    locations.add(workout.location)
    workout.exercises.forEach((exercise) => {
      exerciseName.add(exercise.name)
    })
  })

  return {
    workout: Array.from(workoutNames),
    location: Array.from(locations),
    exercise: Array.from(exerciseName),
  }
}
