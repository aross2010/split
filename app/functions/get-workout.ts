export const getWorkout = async (id: string) => {
  const res = await fetch(`https://split-test.vercel.app/api/workouts/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch the workout')
  }

  return res.json()
}
