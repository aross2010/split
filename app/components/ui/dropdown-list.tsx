import { Filters, FilterType } from '@/app/libs/types'
import { FaCheck } from 'react-icons/fa6'
import React from 'react'

type DropdownSelectProps = {
  list: string[]
  onClick: (item: string, remove?: boolean) => void
  activeFilters?: Filters
}

export default function DropdownList({
  list,
  onClick,
  activeFilters,
}: DropdownSelectProps) {
  return (
    <ul>
      {list.map((item, index) => {
        const isChecked =
          activeFilters?.exercise.has(item) ||
          activeFilters?.workout === item ||
          activeFilters?.location === item
        return (
          <li key={index}>
            <label
              htmlFor={`${item} ${index}`}
              className={`p-2 hover:bg-violet-400 select-none cursor-pointer !flex justify-between items-center w-full text-left transition-colors ${
                isChecked ? 'bg-violet-400 text-white' : ''
              }`}
            >
              {item}
              {isChecked && <FaCheck className="text-white text-sm" />}
            </label>
            <input
              type="checkbox"
              id={`${item} ${index}`}
              checked={isChecked}
              onChange={() => onClick(item, isChecked)}
              hidden
            />
          </li>
        )
      })}
    </ul>
  )
}
