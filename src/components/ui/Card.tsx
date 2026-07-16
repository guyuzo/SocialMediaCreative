import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'default' | 'compact'
}

export function Card({ padding = 'default', className = '', ...props }: CardProps) {
  const paddingClass = padding === 'compact' ? 'p-4' : 'p-6'

  return (
    <div
      {...props}
      className={`rounded-xl border border-border-subtle bg-bg-surface ${paddingClass} ${className}`}
    />
  )
}
