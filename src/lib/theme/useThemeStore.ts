import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'momentum'

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
        if (state) applyThemeToDocument(state.theme)
      },
    },
  ),
)
