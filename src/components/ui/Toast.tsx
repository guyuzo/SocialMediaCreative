import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { useToastStore, type ToastVariant } from '@/lib/toast/useToastStore'

const VARIANT_ICON: Record<ToastVariant, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  default: 'text-text-primary',
  success: 'text-success',
  error: 'text-danger',
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6">
      {toasts.map((toast) => {
        const Icon = VARIANT_ICON[toast.variant]
        return (
          <button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            className="pointer-events-auto flex max-w-sm items-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-4 py-3 text-sm shadow-lg"
          >
            <Icon size={18} strokeWidth={1.75} className={VARIANT_CLASSES[toast.variant]} />
            <span className="text-text-primary">{toast.message}</span>
          </button>
        )
      })}
    </div>
  )
}
