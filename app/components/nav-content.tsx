'use client'
import { Session } from '../libs/types'
import { Fragment } from 'react'
import Link from 'next/link'
import NavAuth from './nav-auth'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { useState } from 'react'
import { motion } from 'framer-motion'

type NavContentProps = {
  session: Session | null
}

const links = [
  {
    label: 'Workouts',
    href: '/workouts',
  },
  {
    label: 'Exercises',
    href: '/exercises',
  },
]

export default function NavContent({ session }: NavContentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const renderedLinks = links.map((link) => {
    return (
      <Link
        key={link.href}
        replace
        className="hover:text-violet-400 transition-colors font-medium"
        href={link.href}
      >
        {link.label}
      </Link>
    )
  })

  const renderedMobileLinks = links.map((link) => {
    return (
      <Link
        key={link.href}
        onClick={() => setIsMenuOpen(false)}
        hidden={session == null}
        className="rounded-lg hover:text-violet-400 transition-colors font-medium"
        href={link.href}
      >
        {link.label}
      </Link>
    )
  })

  return (
    <nav className="w-full max-w-[1200px]">
      <div className="w-full h-[55px] flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-extrabold text-violet-400"
          onClick={() => setIsMenuOpen(false)}
        >
          split
        </Link>
        <div className="sm:flex hidden items-center sm:gap-6 gap-4">
          {session && (
            <Fragment>
              <div className="flex items-center sm:gap-6 gap-4">
                {renderedLinks}
              </div>
              <span className="text-gray-600">|</span>
            </Fragment>
          )}

          <NavAuth session={session} />
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden hover:text-violet-400 transition-colors"
        >
          {!isMenuOpen ? (
            <FaBars className="text-3xl" />
          ) : (
            <FaXmark className="text-3xl" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="sm:hidden flex flex-col pt-4 gap-4"
      >
        {renderedMobileLinks}
        <div
          hidden={session == null}
          className="border-b-[0.5px] border-b-gray-600"
        />
        <NavAuth session={session} />
      </motion.div>
    </nav>
  )
}
