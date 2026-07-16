import { TEMA_ICONES } from '@/types/tema'

interface IconPickerProps {
  value: string
  onChange: (icone: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMA_ICONES.map((icone) => (
        <button
          key={icone}
          type="button"
          onClick={() => onChange(icone)}
          aria-label={`Selecionar ícone ${icone}`}
          aria-pressed={value === icone}
          className={`flex h-11 w-11 items-center justify-center rounded-full border text-lg transition-colors ${
            value === icone
              ? 'border-accent-primary bg-accent-soft'
              : 'border-border-subtle hover:border-accent-primary'
          }`}
        >
          {icone}
        </button>
      ))}
    </div>
  )
}
