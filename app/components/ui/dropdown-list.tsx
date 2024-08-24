import { Filters, FilterType } from '@/app/libs/types'
import { FaCheck } from 'react-icons/fa6'
import React, { useState, useRef, useEffect } from 'react'

type DropdownSelectProps = {
  list: string[]
  onClick: (item: string, remove?: boolean) => void
  activeFilters?: Filters
  selectedIndex?: number
}

export default function DropdownList({
  list,
  onClick,
  activeFilters,
  selectedIndex,
}: DropdownSelectProps) {
  const filtersList = (
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
              className={`p-2 hover:bg-violet-500 select-none cursor-pointer !flex justify-between items-center w-full text-left transition-colors ${
                isChecked ? 'bg-violet-500 text-white' : ''
              }  `}
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

  const searchList = (
    <ul>
      {list.map((item, index) => {
        return (
          <li key={index}>
            <button
              type="button"
              onMouseDown={() => {
                onClick(item)
              }}
              className={`p-2 hover:bg-violet-500 select-none cursor-pointer !flex justify-between items-center w-full text-left transition-colors ${
                selectedIndex === index ? 'bg-violet-500' : ''
              }`}
            >
              {item}
            </button>
          </li>
        )
      })}
    </ul>
  )

  return activeFilters ? filtersList : searchList
}
