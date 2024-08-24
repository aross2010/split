import React from 'react'

import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa6'

const links = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/alex-ross-32b278236/',
    icon: <FaLinkedin />,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/aross2010',
    icon: <FaGithub />,
  },
  {
    label: 'Email',
    href: 'mailto:adross1027@gmail.com',
    icon: <FaEnvelope />,
  },
]

export default function Footer() {
  return (
    <footer className="mt-auto py-16 flex flex-col justify-center gap-2 text-sm">
      <span> © {new Date().getFullYear()} Split, Alex Ross.</span>
      <ul className="flex items-center justify-center gap-3 text-3xl">
        {links.map((link) => {
          return (
            <li key={link.href}>
              <a
                className="hover:text-violet-500 transition-colors"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.icon}
              </a>
            </li>
          )
        })}
      </ul>
    </footer>
  )
}
