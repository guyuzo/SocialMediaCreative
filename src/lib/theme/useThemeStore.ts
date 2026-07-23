import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function applyThemeToDocument(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => {
        applyThemeToDocument(theme)
        set({ theme })
      },
    }),
    {
      name: 'social-creative-theme',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Normaliza valor antigo persistido ('momentum', removido do produto)
        // pra não deixar data-theme apontando pra um tema que não existe mais.
        if (state.theme !== 'light' && state.theme !== 'dark') state.theme = 'light'
        applyThemeToDocument(state.theme)
      },
    },
  ),
)
