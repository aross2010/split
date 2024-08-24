import Link from 'next/link'
import React, { cloneElement } from 'react'

type IconCardProps = {
  title: string
  value: number | string
  icon: React.ReactElement
  link?: string
  className?: string
}

export default function IconCard({
  title,
  value,
  icon,
  link,
  className,
}: IconCardProps) {
  const isSingular =
    value == 1 && title !== 'PR' && title !== 'PL' && title !== 'Current Streak'

  const card = (
    <div
      className={`rounded-lg p-3 flex flex-col w-full gap-6 bg-gray-800 items-center text-center ${
        link ? 'hover:brightness-125 transition-all' : ''
      } ${className}`}
    >
      <div className="p-3 rounded-full flex justify-center items-center bg-violet-500/25">
        {cloneElement(icon, { className: 'text-3xl text-violet-500' })}
      </div>
      <div>
        <h4 className="text-gray-200">{value}</h4>
        <h3 className="font-semibold">
          {isSingular ? title.slice(0, -1) : title}
        </h3>
      </div>
    </div>
  )

  return link ? (
    <Link
      className="rounded-lg h-auto w-full flex"
      href={link}
    >
      {card}
    </Link>
  ) : (
    card
  )
}
