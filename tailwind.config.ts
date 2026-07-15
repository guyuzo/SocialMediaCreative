import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['Gilroy', '-apple-system', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.4' }],
        sm: ['14px', { lineHeight: '1.4' }],
        base: ['16px', { lineHeight: '1.4' }],
        md: ['18px', { lineHeight: '1.4' }],
        lg: ['24px', { lineHeight: '1.1' }],
        xl: ['32px', { lineHeight: '1.1' }],
        '2xl': ['48px', { lineHeight: '1.1' }],
        display: ['96px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16,24,40,0.04)',
        sm: '0 2px 8px rgba(16,24,40,0.06)',
        md: '0 8px 24px rgba(16,24,40,0.08)',
        lg: '0 16px 40px rgba(16,24,40,0.12)',
        'glow-accent': '0 0 60px rgba(255,107,26,0.35)',
      },
      colors: {
        // primitivos
        gray: {
          0: '#FFFFFF',
          50: '#F6F7FB',
          100: '#EEEFF4',
          200: '#E2E4EC',
          400: '#9CA0AF',
          600: '#6B6F7D',
          800: '#232329',
          900: '#17171B',
          950: '#0D0D10',
        },
        violet: {
          100: '#EDEBFF',
          300: '#A79BFF',
          500: '#6C5CE7',
          600: '#5B4BD9',
          700: '#4A3DB8',
        },
        orange: {
          100: '#FFE4D1',
          300: '#FFAD73',
          500: '#FF6B1A',
          600: '#E85A0C',
          900: '#3A1D0D',
        },
        pink: { 500: '#FF4D8D' },
        blue: { 500: '#3B5BDB' },
        green: { 500: '#34C759' },
        red: { 500: '#FF3B30' },
        yellow: { 500: '#FFC93C' },

        // semânticos — resolvidos via CSS var, trocam sozinhos com [data-theme]
        'bg-app': 'var(--color-bg-app)',
        'bg-surface': 'var(--color-bg-surface)',
        'bg-surface-raised': 'var(--color-bg-surface-raised)',
        'border-subtle': 'var(--color-border-subtle)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'accent-primary': 'var(--color-accent-primary)',
        'accent-primary-hover': 'var(--color-accent-primary-hover)',
        'accent-soft': 'var(--color-accent-soft)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        glow: 'var(--color-glow)',
      },
    },
  },
  plugins: [],
} satisfies Config
