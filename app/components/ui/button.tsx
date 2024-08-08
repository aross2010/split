import React from 'react'

type ButtonProps = {
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`rounded-md select-none p-3 [&:not(:disabled)]:hover:brightness-110 [&:not(:disabled)]:active:brightness-110  disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full ${className}`}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
