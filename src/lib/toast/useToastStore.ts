import { create } from 'zustand'

export type ToastVariant = 'default' | 'success' | 'error'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastItem[]
  show: (message: string, variant?: ToastVariant) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show(message, variant = 'default') {
    const id = crypto.randomUUID()
    set({ toasts: [...get().toasts, { id, message, variant }] })
    setTimeout(() => get().dismiss(id), 3000)
  },

  dismiss(id) {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) })
  },
}))
