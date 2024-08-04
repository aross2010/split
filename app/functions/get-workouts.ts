export const getWorkouts = async (userId: string) => {
  const res = await fetch(`http://localhost:3000/api/workouts/user/${userId}`)

  if (!res.ok) {
    throw new Error('Failed to fetch the workout')
  }

  return res.json()
}
