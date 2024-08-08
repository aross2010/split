import Image from 'next/image'
import { getSession } from './functions/get-session'
import { getWorkouts } from './functions/get-workouts'
import { getDashboardData } from './functions/get-dashboard-data'
import Dashboard from './components/dashboard'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    return (
      <section className="w-full">
        <h1 className="text-4xl font-medium">
          Sign in to view your dashboard.
        </h1>
      </section>
    )
  }

  const workouts = await getWorkouts(session.user.id)
  const dashboardData = getDashboardData(workouts)

  return (
    <Dashboard
      name={session.user.name}
      dashboardData={dashboardData}
    />
  )
}
