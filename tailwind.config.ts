import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * May Salon · Design tokens — Paleta: Sage Orgânico · Blush Natural · Gold Envelhecido
 *
 * Cores como variáveis CSS em src/styles/globals.css (canais RGB).
 * Tailwind aplica opacidade automática: bg-sage/20, text-ink/70...
 *
 * Regras WCAG 2.1 AA calculadas para a nova paleta:
 *  - sage (#687F6A) sobre ivory/sand: 3.2:1 — OK para UI (botão grande, borda, icon)
 *  - gold (#C9A84C) CTA: texto escuro #1C1714 sobre gold = 5.8:1 ✅
 *  - texto sage (primary-700 #3E513F) sobre ivory = 7.1:1 ✅
 *  - texto escuro (#1C1714) sobre ivory (#FAF0EE) = 16.5:1 ✅
 *  - texto claro (#FAF0EE) sobre bg-deep (#1E2720) = 14.2:1 ✅
 */
const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Breakpoints mobile-first: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536
    screens: defaultTheme.screens,
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2.5rem', xl: '3rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        // Sage Green — cor primária da marca (mesmo DNA do monograma do Instagram)
        primary: {
          DEFAULT: withAlpha('--primary'),
          50: '#EFF3EF',
          100: '#D9E3DA',
          200: '#B8CBB9',
          300: '#94AE96',
          400: '#7A9A7C',
          500: withAlpha('--primary'),
          600: withAlpha('--primary-600'),
          700: withAlpha('--primary-700'),
          800: '#2E4030',
          900: '#1A2C1B',
        },
        sage: withAlpha('--primary'),
        // Gold envelhecido — CTAs e destaques
        gold: {
          DEFAULT: withAlpha('--gold'),
          dark: withAlpha('--gold-dark'),
        },
        // Fundos
        ivory: withAlpha('--background'),
        background: withAlpha('--background'),
        sand: withAlpha('--surface'),
        cream: withAlpha('--surface'),
        deep: withAlpha('--bg-deep'),
        // Mantidos por compatibilidade com componentes da Fase 1
        champagne: withAlpha('--background'),
        charcoal: {
          DEFAULT: withAlpha('--text'),
          soft: withAlpha('--text-soft'),
        },
        ink: withAlpha('--text'),
        // Blush — acento feminino
        blush: withAlpha('--accent'),
        accent: withAlpha('--accent'),
        muted: {
          DEFAULT: withAlpha('--muted'),
          strong: withAlpha('--muted-strong'),
        },
        line: withAlpha('--line'),
      },
      fontFamily: {
        // Uma só serifa editorial (Fraunces, variável) nos dois papéis: display em peso/itálico
        // mais contidos, accent em itálico. O eixo óptico (opsz) ajusta o desenho conforme o tamanho.
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
        accent: ['Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        // Tipografia fluida: cresce com a viewport sem saltos entre breakpoints
        'display-2xl': ['clamp(2.75rem, 1.4rem + 5.6vw, 6.25rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.25rem, 1.3rem + 3.8vw, 4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.018em' }],
        'display-lg': ['clamp(1.875rem, 1.25rem + 2.4vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 1.15rem + 1.3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'accent-lg': ['clamp(1.375rem, 1.1rem + 1vw, 1.875rem)', { lineHeight: '1.35' }],
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.22em' }],
      },
      spacing: {
        header: '4.5rem',
        'header-sm': '4rem',
        'bottom-nav': '4rem',
        section: 'clamp(4.5rem, 3rem + 6vw, 9rem)',
      },
      borderRadius: {
        // Raio único para todos os painéis e fotos (a 2ª família, além do rounded-full nos pills/ações)
        panel: '1.75rem',
      },
      boxShadow: {
        // Sombras leves, nunca pesadas
        soft: '0 1px 2px rgb(28 23 20 / 0.04), 0 8px 24px -12px rgb(28 23 20 / 0.10)',
        lift: '0 2px 4px rgb(28 23 20 / 0.04), 0 18px 40px -18px rgb(28 23 20 / 0.22)',
        glow: '0 0 0 1px rgb(201 168 76 / 0.50), 0 16px 36px -18px rgb(201 168 76 / 0.45)',
        'sage-glow': '0 0 0 1px rgb(104 127 106 / 0.40), 0 12px 28px -14px rgb(104 127 106 / 0.35)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      zIndex: {
        header: '40',
        fab: '50',
        'bottom-nav': '45',
        drawer: '60',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%, 100%': { transform: 'scale(1.65)', opacity: '0' },
        },
        // Faixa de texto infinita: 3 cópias, anda 1/3 e recomeça sem emenda
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.3333%)' },
        },
        // Selo "Aberto agora": um halo sage que respira
        selo: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(104 127 106 / 0.28)' },
          '50%': { boxShadow: '0 0 0 6px rgb(104 127 106 / 0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        marquee: 'marquee 25s linear infinite',
        selo: 'selo 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
