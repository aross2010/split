export const getWorkouts = async (userId: string) => {
  const res = await fetch(
    `https://split-test.vercel.app/api/workouts/user/${userId}`
  )

  if (!res.ok) {
    throw new Error('Failed to fetch the workout')
  }

  return res.json()
}
