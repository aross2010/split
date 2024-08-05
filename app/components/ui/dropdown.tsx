'use client'
import { on } from 'events'
import { useState, useEffect, useRef } from 'react'

type DropdownProps = {
  children: React.ReactNode
  openButton: React.RefObject<HTMLButtonElement>
  onOpen?: () => void
  onClose?: () => void
}

export default function Dropdown({
  children,
  openButton,
  onOpen,
  onClose,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && onOpen) onOpen()
    if (!isOpen && onClose) onClose()
  }, [isOpen])

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false)
      if (openButton.current && openButton.current.contains(e.target as Node)) {
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
      hidden={!isOpen}
      className={`absolute z-10 border border-gray-500 shadow-xl w-full rounded-md py-3 right-0 top-full mt-0.5 bg-gray-700 overflow-y-auto max-h-[30rem]`}
    >
      {children}
    </div>
  )
}
