import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-subtle p-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-primary">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h3 className="text-md font-semibold text-text-primary">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {action}
    </div>
  )
}
