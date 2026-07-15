import { Check } from 'lucide-react'
import { TEMA_CORES } from '@/types/tema'

interface ColorPickerProps {
  value: string
  onChange: (cor: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMA_CORES.map((cor) => (
        <button
          key={cor}
          type="button"
          onClick={() => onChange(cor)}
          aria-label={`Selecionar cor ${cor}`}
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: cor }}
        >
          {value === cor && <Check size={18} strokeWidth={2.5} className="text-white" />}
        </button>
      ))}
    </div>
  )
}
