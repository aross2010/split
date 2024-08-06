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
    workout: Array.from(workoutNames).sort(),
    location: Array.from(locations).sort(),
    exercise: Array.from(exerciseName).sort(),
  }
}

export const getExerciseNames = (workouts: WorkoutInDb[]) => {
  const names = new Set()
  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      names.add(exercise.name)
    })
  })
  return Array.from(names).sort()
}
