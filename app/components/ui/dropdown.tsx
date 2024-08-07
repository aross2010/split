'use client'
import { on } from 'events'
import { useState, useEffect, useRef } from 'react'

type DropdownProps = {
  children: React.ReactNode
  opener: React.RefObject<HTMLButtonElement> | boolean
  onOpen?: () => void
  onClose?: () => void
}

export default function Dropdown({
  children,
  opener,
  onOpen,
  onClose,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isOpenedByButton =
    opener && typeof opener === 'object' && 'current' in opener

  useEffect(() => {
    if (isOpen && onOpen) onOpen()
    if (!isOpen && onClose) onClose()
  }, [isOpen])

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false)

      if (
        isOpenedByButton &&
        opener.current &&
        opener.current.contains(e.target as Node)
      ) {
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener('click', closeDropdown)

    return () => {
      document.removeEventListener('click', closeDropdown)
    }
  })

  return (
    <div
      ref={ref}
      hidden={isOpenedByButton ? !isOpen : !opener}
      className={`absolute border border-gray-500 shadow-xl w-full rounded-md py-3 right-0 top-full dropdown-container ${
        isOpenedByButton ? 'mt-0.5' : 'mt-1.5'
      } bg-gray-700 overflow-y-auto max-h-[30rem]`}
    >
      {children}
    </div>
  )
}
