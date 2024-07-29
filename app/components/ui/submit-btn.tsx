import React from 'react'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({
  children,
}: {
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="bg-violet-400 text-white rounded-md p-3 hover:brightness-110 transition-all disabled:bg-opacity-70 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {children}
    </button>
  )
}
