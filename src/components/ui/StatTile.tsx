import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string | number
  badgeClassName?: string
}

export function StatTile({ icon: Icon, label, value, badgeClassName = 'bg-accent-soft text-accent-primary' }: StatTileProps) {
  return (
    <Card padding="compact" className="flex items-center gap-3">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${badgeClassName}`}>
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold text-text-primary">{value}</p>
        <p className="truncate text-xs text-text-secondary">{label}</p>
      </div>
    </Card>
  )
}
