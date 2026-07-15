import type { ButtonHTMLAttributes } from 'react'

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Pill({ active = false, className = '', ...props }: PillProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={`flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
        active
          ? 'border-accent-primary bg-accent-soft text-accent-primary'
          : 'border-border-subtle bg-bg-surface text-text-secondary hover:text-text-primary'
      } ${className}`}
    />
  )
}
