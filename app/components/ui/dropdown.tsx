'use client'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={isOpenedByButton ? { height: 0, opacity: 0 } : {}}
      animate={
        isOpenedByButton
          ? { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }
          : {}
      }
      transition={{ duration: 0.25 }}
      ref={ref}
      hidden={isOpenedByButton ? !isOpen : !opener}
      className={`absolute border border-gray-500 z-10 shadow-xl w-full rounded-md py-3 right-0 top-full dropdown-container ${
        isOpenedByButton ? 'mt-0.5' : 'mt-1.5'
      } bg-gray-700 overflow-y-auto max-h-[30rem]`}
    >
      {children}
    </motion.div>
  )
}
