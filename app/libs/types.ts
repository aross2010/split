export type Session = {
  user: {
    name: string
    email: string
    id: string
    image: string | null | undefined
  }
}

export type LoginUserData = {
  email: string
  password: string
}

export type RegisterUserData = {
  name: string
  email: string
  password: string
}

export type Set = {
  reps?: number | null
  partialReps?: number | null
  weight?: number | null
  rpe?: number | null
  inDropset?: boolean
  id: string
}

export type Exercise = {
  name: string
  sets: Set[]
  dropsets: Set[][]
  inSuperSet: boolean
  id: string
}

export type WorkoutData = {
  workoutName: string
  location: string
  notes: string
  supersets: Exercise[][]
}

export type WorkoutInDb = {
  id: string
  workoutName: string
  date: Date
  location: string
  notes: string
  exercises: Exercise[]
  supersets: Exercise[][]
  userId: string
}

export type ExercisesFormatted = {
  name: string
  sets: {
    [weight: number]: {
      sets: {
        reps: number | undefined | null
        rpe: number | undefined | null
        partialReps: number | undefined | null
        times: number
        inDropset: boolean
      }[]
    }
  }[]
  dropsets: string[]
  supersets: Map<string, string[]>
  id: string
}

export type FiltersData = {
  workout: string[]
  location: string[]
  exercise: string[]
}

export type Filters = {
  workout: string | null
  exercise: globalThis.Set<string>
  location: string | null
}

export type FilterType = 'workout' | 'exercise' | 'location'

export type ExerciseStatsType = {
  name: string
  totalWorkouts: number
  totalSets: number
  totalReps: number
  totalLocations: number
  PR: number
  PL: number
  topSets: ChartData
}

export type ChartData = {
  header: string
  data: {
    rpe: number | null
    reps: number | null
    weight: number
    workoutId: string
  }
}[]

export type DashboardData = {
  totalWorkouts: number
  totalSets: number
  totalReps: number
  totalExercises: number
  totalWorkoutNames: number
  totalLocations: number
  PRs: Map<string, number>
  maxPRValue: number
  maxPRExercise: string
  popularExercises: Map<string, number>
  locations: Map<string, number>
  workoutNames: Map<string, number>
  currentWorkoutStreak: number
}
