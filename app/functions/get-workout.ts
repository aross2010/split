export const getWorkout = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/workouts/${id}`)

  if (!res.ok) {
    throw new Error('Failed to fetch the workout')
  }

  return res.json()
}
