import Image from 'next/image'
import { getSession } from './functions/get-session'
import { getWorkouts } from './functions/get-workouts'
import { getDashboardData } from './functions/get-dashboard-data'
import Dashboard from './components/dashboard'

import { handleLogin } from './functions/handle-login'
import Button from './components/ui/button'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    return (
      <section className="w-full">
        <h1 className="text-4xl font-medium">
          Sign in to view your dashboard.
        </h1>
        <form
          action={async () => {
            'use server'
            try {
              const data = {
                email: 'demo@gmail.com',
                password: 'Password1',
              }
              await handleLogin(data)
            } catch (e) {}
          }}
        >
          <Button
            type="submit"
            className="!p-0 !w-fit underline underline-offset-2 font-medium mt-2 hover:text-violet-400"
          >
            Demo User
          </Button>
        </form>
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
