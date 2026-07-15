import { Sparkles, Upload } from 'lucide-react'
import type { Ativo } from '@/types/ativo'

interface AtivoCardProps {
  ativo: Ativo
  onOpen: () => void
}

export function AtivoCard({ ativo, onOpen }: AtivoCardProps) {
  const Icon = ativo.origem === 'gerado' ? Sparkles : Upload

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-square overflow-hidden rounded-md bg-bg-app"
    >
      <img src={ativo.url} alt={ativo.nome} className="h-full w-full object-cover" />
      <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-950/50 text-white">
        <Icon size={12} strokeWidth={2} />
      </span>
      <span className="absolute inset-x-0 bottom-0 truncate bg-gray-950/60 px-2 py-1 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {ativo.nome}
      </span>
    </button>
  )
}
