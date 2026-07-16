import type { ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/40"
      />
      <div className="relative w-full max-w-lg rounded-t-2xl border border-border-subtle bg-bg-surface p-6">
        {title && (
          <h2 className="mb-4 text-md font-semibold text-text-primary">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}
