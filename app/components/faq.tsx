'use client'

import QA from './ui/qa'
import { motion } from 'framer-motion'

type FAQProps = {
  QAs: Map<string, string>
}

export default function FAQ({ QAs }: FAQProps) {
  const questions = Array.from(QAs.keys())

  return (
    <div className="w-full max-w-[800px]">
      <motion.h2
        initial={{ opacity: 0, x: -25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.25 }}
        className="font-semibold text-3xl text-center mb-8"
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="flex flex-col gap-4">
        {questions.map((question) => {
          return (
            <QA
              key={question}
              question={question}
              answer={QAs.get(question) || ''}
            />
          )
        })}
      </div>
    </div>
  )
}
