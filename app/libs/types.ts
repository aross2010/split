export type Session = {
  user: {
    name: string
    email: string
    id: string
    image: string | null | undefined
  }
}

export type LoginUserType = {
  email: string
  password: string
}

export type RegisterUserType = {
  name: string
  email: string
  password: string
}

export type Set = {
  sets: number
  reps?: number
  weight?: number
  RPE?: number
  name?: string // for super sets
}

export type Exercise = {
  name: string
  sets?: Set[]
  dropsets?: Set[]
}

export type SuperSetExercise = {
  name: string[]
  sets?: Set[]
  dropsets?: Set[]
}

export type Workout = {
  id: string
  name: string
  date: Date
  notes: string
  exercises: Exercise[] | SuperSetExercise[]
}

// set will have partials reps within one set
// exercise will have dropsets with two sets in same exercise
// exercise will haave super set with another exercise
