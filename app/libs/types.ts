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

export type Location = {
  id: string
  name: string
}

export type WorkoutName = {
  id: string
  name: string
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
  id: string
  name: string
  sets: Set[]
  dropsets: Set[][]
  inSuperSet: boolean
}

export type WorkoutData = {
  name: string
  location: string
  notes: string
  supersets: Exercise[][]
}

export type WorkoutInDib = {
  id: string
  name: WorkoutName
  date: Date
  location: Location
  notes: string
  exercises: Exercise[]
}

// set will have partials reps within one set
// exercise will have dropsets with two sets in same exercise
// exercise will haave super set with another exercise
