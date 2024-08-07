import React from 'react'
import { useFormStatus } from 'react-dom'
import Button from './button'
import { TailSpin } from 'react-loader-spinner'

type SubmitButtonProps = {
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function SubmitButton({
  children,
  className,
  ...rest
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className={`disabled:bg-opacity-70 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
      disabled={pending}
      {...rest}
    >
      {children}
      {pending && (
        <TailSpin
          color="#ffffff"
          height={20}
          width={20}
        />
      )}
    </Button>
  )
}
