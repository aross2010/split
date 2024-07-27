import React from 'react'
import { getSession } from '../functions/get-session'
import Link from 'next/link'

const links = [
  {
    label: 'Workouts',
    href: '/workouts',
  },
  {
    label: 'Exercises',
    href: '/exercises',
  },
  {
    label: 'Weight',
    href: '/weight',
  },
]

const authButtons = [
  {
    label: 'Login',
    stateAction: 'login',
  },
  {
    label: 'Register',
    stateAction: 'register',
  },
]

export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className="w-full max-w-[1200px] h-[50px] flex justify-between items-center">
      <Link
        href="/"
        className="text-3xl font-extrabold text-violet-400"
      >
        split
      </Link>
      <div>fer</div>
      <div>ferf</div>
    </nav>
  )
}
