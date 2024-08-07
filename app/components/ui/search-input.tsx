'use client'
import { set } from 'react-datepicker/dist/date_utils'
import Dropdown from './dropdown'
import DropdownList from './dropdown-list'
import TextInput from './text-input'
import { Fragment, useEffect, useState } from 'react'

type SearchInputProps = {
  onClick: (item: string) => void
  items: string[]
  input: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchInput({
  onClick,
  items,
  input,
  className,
  ...rest
}: SearchInputProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [results, setResults] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (!items) return
    const filteredResults = items.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    )
    setResults(filteredResults)
    setSelectedIndex(0)
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return

    const prevIndex = selectedIndex
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prevIndex + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prevIndex - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      onClick(results[selectedIndex])
      setDropdownOpen(false)
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
      setResults([])
    } else if (!dropdownOpen) setDropdownOpen(true)
  }

  return (
    <div className="relative">
      <TextInput
        onKeyDown={handleKeyDown}
        className={`${className}`}
        onBlur={() => {
          setDropdownOpen(false)
        }}
        onFocus={() => {
          setDropdownOpen(true)
        }}
        autoComplete="off"
        {...rest}
      />
      <Dropdown opener={results.length > 0 && input.length > 0 && dropdownOpen}>
        <DropdownList
          list={results}
          onClick={onClick}
          selectedIndex={selectedIndex}
        />
      </Dropdown>
    </div>
  )
}
