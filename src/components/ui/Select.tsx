import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative flex items-center">
      <select
        {...props}
        className={`h-11 w-full appearance-none rounded-md border border-border-subtle bg-bg-app px-4 pr-10 text-sm text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-soft ${className}`}
      >
        {children}
      </select>
      <ChevronDown size={16} strokeWidth={2} className="pointer-events-none absolute right-3 text-text-muted" />
    </div>
  )
}
