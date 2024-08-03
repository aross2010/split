'use client'
import { Fragment, useRef, useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'

type ModalProps = {
  button: React.RefObject<HTMLButtonElement>
  onClose?: () => void
  children?: React.ReactNode
}

export default function Modal({ children, button, onClose }: ModalProps) {
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

  const close = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (
        isOpen &&
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        document.contains(e.target as Node) // check if the target is still in the document, sometimes it gets removed after being clicked and doesnt register as a child of the modal
      ) {
        close()
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
          <div className="fixed inset-0 bg-black bg-opacity-40"></div>
          <div
            ref={ref}
            className="fixed flex flex-col overflow-y-auto top-0 sm:top-1/2 left-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 sm:h-auto h-screen bg-gray-700 px-4 py-2 sm:rounded-md shadow-lg z-20 w-full max-w-[450px]"
          >
            <button
              onClick={close}
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
