import React from 'react'

type InputProps = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function TextInput({ className, ...rest }: InputProps) {
  return (
    <input
      className={`w-full bg-gray-700 outline-none rounded-md sm:p-3 p-2 focus:outline-violet-400 focus:bg-violet-400/25 focus:ring-2 focus:ring-violet-400 shadow-sm ${className}`}
      {...rest}
    />
  )
}
