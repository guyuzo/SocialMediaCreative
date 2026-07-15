interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md'
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const sizeClasses = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-11 w-11 text-sm'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses} flex items-center justify-center rounded-full bg-accent-soft font-semibold text-accent-primary`}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
