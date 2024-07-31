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
  sets: number
  reps?: number
  partialReps?: number
  weight?: number
  RPE?: number
}

export type Exercise = {
  id: string
  name: string
  sets?: Set[]
  dropsets?: Set[]
  superSetWith?: Exercise
}

export type Workout = {
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
