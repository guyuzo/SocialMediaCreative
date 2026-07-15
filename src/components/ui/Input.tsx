import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="pointer-events-none absolute left-3 flex text-text-muted">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`h-11 w-full rounded-md border border-border-subtle bg-bg-app px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-soft ${
          icon ? 'pl-10' : ''
        } ${className}`}
      />
    </div>
  )
}
