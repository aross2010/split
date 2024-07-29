import React from 'react'
import { getSession } from '../functions/get-session'
import Link from 'next/link'
import NavAuth from './nav-auth'
import { Fragment } from 'react'

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

export default async function Navbar() {
  const session = await getSession()

  const renderedLinks = links.map((link) => {
    return (
      <Link
        className="hover:text-violet-400 transition-colors font-medium"
        href={link.href}
      >
        {link.label}
      </Link>
    )
  })

  return (
    <nav className="w-full max-w-[1200px] h-[55px] flex justify-between items-center">
      <Link
        href="/"
        className="text-3xl font-extrabold text-violet-400"
      >
        split
      </Link>
      <div className="flex items-center gap-6">
        {session && (
          <Fragment>
            <div className="flex items-center gap-6">{renderedLinks}</div>
            <span className="text-gray-600">|</span>
          </Fragment>
        )}

        <NavAuth session={session} />
      </div>
    </nav>
  )
}
