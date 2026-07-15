import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  label: string
}

export function IconButton({ children, label, className = '', ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      aria-label={label}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-accent-soft hover:text-text-primary ${className}`}
    >
      {children}
    </button>
  )
}
