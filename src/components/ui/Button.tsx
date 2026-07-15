import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent-primary text-white hover:bg-accent-primary-hover',
  secondary: 'bg-accent-soft text-accent-primary hover:bg-accent-soft/70',
  ghost: 'bg-transparent text-text-secondary hover:bg-accent-soft/60 hover:text-text-primary',
  danger: 'bg-transparent text-danger hover:bg-danger/10',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
    />
  )
}
