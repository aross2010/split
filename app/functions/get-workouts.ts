export const getWorkouts = async (userId: string) => {
  const res = await fetch(
    `https://splitv1.vercel.app/api/workouts/user/${userId}`
  )

  if (!res.ok) {
    throw new Error('Failed to fetch the workout')
  }

  return res.json()
}
