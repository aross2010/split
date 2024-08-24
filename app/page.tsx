import { getSession } from './functions/get-session'
import { getWorkouts } from './functions/get-workouts'
import { getDashboardData } from './functions/get-dashboard-data'
import Dashboard from './components/dashboard'
import LandingPage from './components/landing-page'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    return <LandingPage />
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
