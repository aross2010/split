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
