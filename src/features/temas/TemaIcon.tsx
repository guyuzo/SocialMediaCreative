import type { Tema } from '@/types/tema'

interface TemaIconProps {
  tema?: Pick<Tema, 'cor' | 'icone'>
  size?: 'xs' | 'sm' | 'md'
}

const SIZE_CLASSES: Record<NonNullable<TemaIconProps['size']>, string> = {
  xs: 'h-4 w-4 text-[10px]',
  sm: 'h-6 w-6 text-xs',
  md: 'h-9 w-9 text-base',
}

const COR_PADRAO = '#9CA0AF'

export function TemaIcon({ tema, size = 'sm' }: TemaIconProps) {
  const cor = tema?.cor ?? COR_PADRAO
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full leading-none ${SIZE_CLASSES[size]}`}
      style={{ backgroundColor: `${cor}26` }}
    >
      {tema?.icone ?? '❓'}
    </span>
  )
}
