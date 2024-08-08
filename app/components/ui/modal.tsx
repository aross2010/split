'use client'
import { Fragment, useRef, useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { motion } from 'framer-motion'

type ModalProps = {
  button: React.RefObject<HTMLButtonElement>
  fullScreen?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export default function Modal({
  children,
  button,
  fullScreen,
  onClose,
}: ModalProps) {
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
          <div className="fixed inset-0 bg-black bg-opacity-75 z-10"></div>
          <div
            ref={ref}
            className={`fixed flex flex-col overflow-y-auto !transform left-1/2 -translate-x-1/2  ${
              fullScreen
                ? 'h-screen top-0'
                : 'h-auto -translate-y-1/2 top-1/2 rounded-md'
            } bg-gray-700 px-4 py-2 shadow-lg z-20 w-full max-w-[450px]`}
          >
            <button
              onClick={close}
              className="ml-auto rounded-md p-2 text-gray-300 hover:bg-gray-500 transition-colors modal-button-close"
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
