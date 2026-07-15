import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-bg-app/95 p-4 backdrop-blur">
      <div className="flex-1">
        <Input icon={<Search size={16} />} placeholder="Buscar tema, ideia, criativo..." />
      </div>
      <IconButton label="Notificações">
        <Bell size={20} strokeWidth={1.75} />
        <span className="absolute right-1.5 top-1.5">
          <Badge count={3} />
        </span>
      </IconButton>
      <Avatar name="Social Creative" />
    </header>
  )
}
