import type { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min: number
  max: number
  value: number
}

export function Slider({ className = '', min, max, value, ...props }: SliderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-xs text-text-muted">{min}</span>
      <input
        {...props}
        type="range"
        min={min}
        max={max}
        value={value}
        className={`h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-border-subtle accent-accent-primary ${className}`}
      />
      <span className="shrink-0 text-xs text-text-muted">{max}</span>
    </div>
  )
}
