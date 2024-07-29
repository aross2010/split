import React from 'react'

type InputProps = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function TextInput({ className, ...rest }: InputProps) {
  return (
    <input
      className={`w-full bg-gray-600 outline-none rounded-md p-3 focus:outline-violet-400 focus:bg-violet-400/10 focus:ring-2 focus:ring-violet-400 shadow-sm ${className}`}
      {...rest}
    />
  )
}
