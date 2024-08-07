import Link from 'next/link'
import React, { cloneElement } from 'react'

type IconCardProps = {
  title: string
  value: number
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
  const isSingular = value == 1 && title !== 'PR' && title !== 'PL'

  const card = (
    <div
      className={`rounded-lg p-3 flex flex-col gap-6 bg-gray-600 items-center text-center ${
        link ? 'hover:brightness-125 transition-all' : ''
      } ${className}`}
    >
      <div className="h-14 w-14 rounded-full flex justify-center items-center bg-violet-400/25">
        {cloneElement(icon, { className: 'text-3xl text-violet-400' })}
      </div>
      <div>
        <h4 className="text-gray-200 text-lg">{value}</h4>
        <h3 className="font-semibold text-lg">
          {isSingular ? title.slice(0, -1) : title}
        </h3>
      </div>
    </div>
  )

  return link ? (
    <Link
      className="rounded-lg"
      href={link}
    >
      {card}
    </Link>
  ) : (
    card
  )
}
