import { ExerciseStatsType, WorkoutInDb } from '../libs/types'

export const getExerciseStats = (
  exerciseName: string,
  workouts: WorkoutInDb[]
) => {
  const exerciseStats = {
    name: exerciseName,
    totalWorkouts: 0,
    totalSets: 0,
    totalReps: 0,
    totalLocations: 0,
    PR: 0,
    PL: 0,
    topSets: [],
  } as ExerciseStatsType

  const locations = new Set()

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      if (exercise.name === exerciseName) {
        exerciseStats.totalWorkouts++
        locations.add(workout.location)
        const topSetInWorkout = {
          header: `${new Date(workout.date).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit',
          })}`,
          data: {
            rpe: null as number | null,
            reps: null as number | null,
            weight: 0,
            workoutId: workout.id,
          },
        }
        exercise.sets.forEach((set) => {
          exerciseStats.totalSets++
          exerciseStats.totalReps += set.reps ?? 0
          if (set.weight) {
            exerciseStats.PR = Math.max(exerciseStats.PR, set.weight)
            exerciseStats.PL =
              exerciseStats.PL == 0
                ? set.weight
                : Math.min(exerciseStats.PL, set.weight)
            if (
              !topSetInWorkout.data.weight ||
              set.weight > topSetInWorkout.data.weight
            ) {
              topSetInWorkout.data.weight = set.weight
              topSetInWorkout.data.rpe = set.rpe ?? null
              topSetInWorkout.data.reps = set.reps ?? null
            }
          }
        })
        if (topSetInWorkout.data.weight !== 0)
          exerciseStats.topSets.push(topSetInWorkout)
      }
    })
  })

  exerciseStats.totalLocations = locations.size

  return exerciseStats
}
