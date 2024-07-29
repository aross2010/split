'use client'
import { Fragment, useRef, useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'

type ModalProps = {
  button: React.RefObject<HTMLButtonElement>
  children?: React.ReactNode
}

export default function Modal({ children, button }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (button.current) {
      button.current.addEventListener('click', (e: MouseEvent) => {
        setIsOpen(true)
        e.stopPropagation()
      })
    }
  }, [])

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', closeModal)

    return () => {
      document.removeEventListener('click', closeModal)
    }
  }, [isOpen])

  return (
    <Fragment>
      {isOpen && (
        <Fragment>
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div
            ref={ref}
            className="fixed flex flex-col overflow-y-auto top-0 sm:top-1/2 left-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 sm:h-auto h-screen bg-gray-700 p-3 sm:rounded-md shadow-lg z-20 w-full max-w-[500px]"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto rounded-md p-2 text-gray-300 hover:bg-gray-500 transition-colors"
            >
              <FaXmark />
            </button>
            {children}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
