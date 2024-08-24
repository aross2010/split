import { WorkoutInDb } from '../libs/types'

const daysBetween = (start: Date, end: Date) => {
  const startAtMidnight = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  )
  const endAtMidnight = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  )

  const differenceInMillis = endAtMidnight.getTime() - startAtMidnight.getTime()

  const oneDayInMillis = 1000 * 60 * 60 * 24
  const differenceInDays = Math.floor(differenceInMillis / oneDayInMillis)

  const today = new Date()
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  if (
    differenceInDays === 1 &&
    endAtMidnight.getTime() === todayAtMidnight.getTime()
  ) {
    return 0
  }

  return differenceInDays
}

export const getDashboardData = (workouts: WorkoutInDb[]) => {
  let totalWorkouts = 0,
    totalReps = 0,
    totalSets = 0
  const maxPR = {
    name: '',
    value: 0,
  }
  const PRs = new Map<string, number>()
  const popularExercises = new Map<string, number>()
  const locations = new Map<string, number>()
  const workoutNames = new Map<string, number>()
  let currentWorkoutStreak = 0
  let streakDate = new Date(new Date().toLocaleDateString())
  let isStreakAlive = true

  workouts.forEach((workout) => {
    const { location, exercises, date, workoutName } = workout
    totalWorkouts++
    workoutNames.set(workoutName, (workoutNames.get(workoutName) || 0) + 1)
    locations.set(location, (locations.get(location) || 0) + 1)
    if (isStreakAlive) {
      const workoutDate = new Date(new Date(date).toLocaleDateString())
      const days = Math.abs(daysBetween(workoutDate, streakDate))
      console.log(days, workoutDate, streakDate)
      if (days < 1) {
        currentWorkoutStreak++
        streakDate = workoutDate
      } else {
        isStreakAlive = false
      }
    }
    exercises.forEach((exercise) => {
      const { name, sets } = exercise
      totalSets += sets.length
      popularExercises.set(
        name,
        (popularExercises.get(name) || 0) + sets.length
      )
      sets.forEach((set) => {
        const { reps, weight } = set
        totalReps += set.reps ?? 0
        if (weight && weight > 0)
          PRs.set(name, Math.max(PRs.get(name) || 0, weight ?? 0))
        if (weight && weight > maxPR.value) {
          maxPR.name = name
          maxPR.value = weight
        }
      })
    })
  })
  return {
    totalWorkouts,
    totalSets,
    totalReps,
    totalExercises: popularExercises.size,
    totalWorkoutNames: workoutNames.size,
    totalLocations: locations.size,
    maxPRExercise: maxPR.name,
    maxPRValue: maxPR.value,
    PRs,
    popularExercises,
    locations,
    workoutNames,
    currentWorkoutStreak,
  }
}
