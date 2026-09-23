import { motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { CalendarHeart, House, Images, Sparkles, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useScrolled } from '@/hooks/useScrolled'
import { easeSilk } from '@/lib/motion'

type BottomItem = {
  label: string
  to: string
  icon: LucideIcon
}

const items: BottomItem[] = [
  { label: 'Início', to: '/', icon: House },
  { label: 'Serviços', to: '/servicos', icon: Sparkles },
  { label: 'Galeria', to: '/galeria', icon: Images },
  { label: 'Agendar', to: '/agendamento', icon: CalendarHeart },
]

/** Rotas com hero escuro: a barra começa em bg-deep para não "cortar" a foto com uma faixa clara. */
const DARK_HERO_ROUTES = new Set(['/'])

/** Barra de navegação fixa, só no mobile (abaixo de 768px). */
export function MobileBottomNav() {
  const { pathname } = useLocation()
  const pastHero = useScrolled(typeof window === 'undefined' ? 600 : window.innerHeight * 0.8)
  const dark = DARK_HERO_ROUTES.has(pathname) && !pastHero

  return (
    <nav
      aria-label="Atalhos"
      className={cn(
        'fixed inset-x-0 bottom-0 z-bottom-nav border-t pb-safe backdrop-blur-md backdrop-saturate-150 transition-colors duration-600 ease-silk md:hidden',
        dark ? 'on-dark border-ivory/10 bg-deep/90' : 'border-line/80 bg-ivory/[0.92]',
      )}
    >
      <ul className="mx-auto grid h-[var(--bottom-nav-h)] max-w-md grid-cols-4">
        {items.map(({ label, to, icon: Icon }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <li key={to} className="relative">
              <NavLink
                to={to}
                end={to === '/'}
                className={cn(
                  'flex h-full min-h-[44px] flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium tracking-[0.02em] transition-colors duration-400',
                  dark
                    ? active
                      ? 'text-ivory'
                      : 'text-ivory/70'
                    : active
                      ? 'text-ink'
                      : 'text-muted-strong',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 top-0 mx-auto h-[2px] w-8 rounded-full',
                      dark ? 'bg-primary-300' : 'bg-primary',
                    )}
                    transition={{ duration: 0.5, ease: easeSilk }}
                  />
                )}
                <Icon
                  aria-hidden="true"
                  size={22}
                  strokeWidth={active ? 1.75 : 1.5}
                  className={cn(
                    'transition-colors duration-400',
                    active && (dark ? 'text-primary-300' : 'text-primary-700'),
                  )}
                />
                <span>{label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
