import { useEffect, useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { mainNav, site } from '@/config/site'
import { whatsappLink } from '@/lib/whatsapp'
import { easeSilk } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { Magnetic } from './Magnetic'
import { MenuIcon } from './MenuIcon'
import { InstagramIcon, WhatsAppIcon } from './icons/BrandIcons'

type MobileDrawerProps = {
  open: boolean
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Menu lateral (mobile e tablet). Acessível: role=dialog, foco preso dentro,
 * Esc fecha, scroll do fundo travado, foco volta para o botão ao fechar (no Header).
 */
export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useBodyScrollLock(open)

  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true })
  }, [open])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab' || !panelRef.current) return

    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-0 z-drawer lg:hidden"
          onKeyDown={handleKeyDown}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Fundo escurecido: toque fora fecha */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-deep/55 backdrop-blur-[3px]"
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.45, ease: easeSilk }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col overflow-y-auto overscroll-contain bg-ivory shadow-lift"
            variants={{ closed: { x: '100%' }, open: { x: 0 } }}
            transition={{ duration: 0.6, ease: easeSilk }}
          >
            {/* Linha do topo alinhada com a altura do header */}
            <div className="relative flex h-[var(--header-h)] shrink-0 items-center justify-between pl-7 pr-[calc(1.25rem-10px)] sm:pr-[calc(1.5rem-10px)]">
              <span className="eyebrow">Menu</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar menu"
                className="grid h-11 w-11 place-items-center rounded-full text-ink"
              >
                <MenuIcon open />
              </button>
            </div>

            <motion.nav
              aria-label="Principal"
              className="relative flex-1 px-7 pt-6"
              variants={{
                closed: {},
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
              }}
            >
              <ul className="space-y-1">
                {mainNav.map((item, index) => (
                  <motion.li
                    key={item.to}
                    variants={{
                      closed: { opacity: 0, x: 24 },
                      open: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeSilk } },
                    }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group flex min-h-[52px] items-baseline gap-4 py-1.5 font-display text-[1.875rem] leading-tight transition-colors duration-400',
                          isActive ? 'text-primary-700' : 'text-ink hover:text-primary-700',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            aria-hidden="true"
                            className="w-6 font-accent text-base italic text-muted-strong"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span>{item.label}</span>
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 self-center rounded-full bg-primary"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <motion.div
              className="relative space-y-6 px-7 pb-[calc(2rem+var(--safe-bottom))] pt-8"
              variants={{
                closed: { opacity: 0, y: 16 },
                open: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5, ease: easeSilk } },
              }}
            >
              <Magnetic block>
                <Link to="/agendamento" onClick={onClose} className="btn btn-primary btn-lg w-full">
                  Reserve seu momento
                </Link>
              </Magnetic>

              <div className="flex items-center justify-between border-t border-line pt-6">
                <p className="text-sm leading-snug text-muted-strong">
                  {site.hours.short}
                </p>
                <div className="flex gap-2">
                  <a
                    href={site.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${site.instagram.handle} (abre em nova aba)`}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors duration-400 hover:border-primary hover:text-primary-700"
                  >
                    <InstagramIcon size={20} />
                  </a>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Conversar no WhatsApp (abre em nova aba)"
                    className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors duration-400 hover:border-primary hover:text-primary-700"
                  >
                    <WhatsAppIcon size={19} />
                  </a>
                </div>
              </div>

              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1 font-accent text-lg italic text-ink"
              >
                {site.instagram.handle}
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
