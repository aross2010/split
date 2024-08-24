'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaMinus } from 'react-icons/fa6'

type QAProps = {
  question: string
  answer: string
}

export default function QA({ question, answer }: QAProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="bg-gray-900 w-full rounded-md"
      initial={{ opacity: 0, y: -25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: 0.25 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4"
      >
        <h3 className="font-medium text-lg">{question}</h3>
        <span>{isOpen ? <FaMinus /> : <FaPlus />}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
            onClick={() => setIsOpen(false)}
          >
            <p className="text-gray-400 py-2 px-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
