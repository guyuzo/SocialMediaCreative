import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
        checked ? 'border-accent-primary bg-accent-primary text-white' : 'border-border-subtle text-transparent'
      }`}
    >
      <Check size={16} strokeWidth={2.5} />
    </button>
  )
}
