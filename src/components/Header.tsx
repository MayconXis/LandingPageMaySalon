import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useScrolled } from '@/hooks/useScrolled'
import { mainNav } from '@/config/site'
import { DARK_HERO_ROUTES } from '@/config/routes'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { Magnetic } from './Magnetic'
import { MenuIcon } from './MenuIcon'
import { MobileDrawer } from './MobileDrawer'


export function Header() {
  const { pathname } = useLocation()
  const scrolled = useScrolled(24)
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const overlay = DARK_HERO_ROUTES.has(pathname) && !scrolled

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    // Devolve o foco para quem abriu o menu (acessibilidade de teclado)
    requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }))
  }, [])

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Fecha o menu se a tela crescer para o layout desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-header border-b transition-[background-color,border-color,backdrop-filter,color] duration-600 ease-silk',
          overlay
            ? 'border-transparent bg-transparent text-ivory'
            : scrolled
              ? 'border-line/70 bg-ivory/[0.92] text-ink backdrop-blur-md backdrop-saturate-150'
              : 'border-transparent bg-ivory/0 text-ink',
          overlay && 'on-dark',
        )}
      >
        <div className="container flex h-[var(--header-h)] items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <Logo
            mode="full"
            tom={overlay ? 'escuro' : 'claro'}
            className={cn(
              'justify-self-start text-[1.375rem] transition-colors duration-600 lg:text-[1.625rem]',
              overlay ? 'text-ivory' : 'text-primary-700',
            )}
          />

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-10">
              {mainNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'link-underline inline-flex min-h-[44px] items-center text-[0.9375rem] tracking-[0.01em] transition-colors duration-400',
                        overlay
                          ? isActive
                            ? 'text-ivory'
                            : 'text-ivory/75 hover:text-ivory'
                          : isActive
                            ? 'text-primary-700'
                            : 'text-ink/70 hover:text-ink',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-2">
            <Magnetic className="hidden sm:inline-flex">
              <Link to="/agendamento" className="btn btn-primary btn-sm">
                Agendar Agora
              </Link>
            </Magnetic>

            <button
              ref={toggleRef}
              type="button"
              className={cn(
                '-mr-2.5 grid h-11 w-11 place-items-center rounded-full transition-opacity duration-300 lg:hidden',
                menuOpen && 'opacity-0',
              )}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon open={false} />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={menuOpen} onClose={closeMenu} />
    </>
  )
}
