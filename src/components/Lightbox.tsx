import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { imagePath, images, type ImageName } from '@/data/images'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { easeSilk } from '@/lib/motion'
import { Picture } from './Picture'

export type LightboxItem = { imagem: ImageName; alt: string; legenda?: string }

type LightboxProps = {
  items: LightboxItem[]
  /** índice aberto; null = fechado */
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

/**
 * Lightbox em tela cheia (fundo bg-deep/95).
 * - Esc fecha · ← → navegam · swipe no celular · foco preso dentro do diálogo
 * - Ao fechar, o foco volta para a foto que abriu o lightbox
 * - A foto mantém o recorte de espelho oval, como no resto do site, e entra assentando de 1.1 para 1
 */
export function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)

  useBodyScrollLock(open)

  // Guarda quem abriu, foca o botão de fechar e devolve o foco ao fechar
  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    return () => returnFocus.current?.focus({ preventScroll: true })
  }, [open])

  const total = items.length
  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return
      setDirection(dir)
      onIndexChange((index + dir + total) % total)
    },
    [index, total, onIndexChange],
  )

  // Pré-carrega a anterior e a próxima
  useEffect(() => {
    if (index === null) return
    for (const d of [-1, 1]) {
      const item = items[(index + d + total) % total]
      if (item) new Image().src = imagePath(item.imagem, 'webp')
    }
  }, [index, items, total])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'Tab' && dialogRef.current) {
      // Só elementos visíveis: as setas do celular ficam display:none no desktop e vice-versa
      const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      )
      const first = els[0]
      const last = els[els.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
  }

  const item = index !== null ? items[index] : undefined
  const ratio = item ? images[item.imagem].w / images[item.imagem].h : 1

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          ref={dialogRef}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          data-lenis-prevent
          className="on-dark fixed inset-0 z-[70] flex flex-col bg-deep/95 backdrop-blur-sm"
          onKeyDown={onKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: easeSilk }}
        >
          {/* Topo: contador + fechar */}
          <div className="container flex h-16 shrink-0 items-center justify-between">
            <p className="text-sm tabular-nums text-ivory/75" aria-live="polite">
              {index + 1} de {total}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar foto ampliada"
              className="-mr-2.5 grid h-11 w-11 place-items-center rounded-full text-ivory transition-colors duration-400 hover:bg-ivory/10"
            >
              <X aria-hidden="true" size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Foto */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.figure
                key={item.imagem}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: 40 * d }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: -40 * d }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: easeSilk }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={onDragEnd}
                className="flex cursor-grab flex-col items-center active:cursor-grabbing"
              >
                <div
                  className="relative overflow-hidden rounded-full ring-1 ring-gold/40 ring-offset-8 ring-offset-deep"
                  style={{
                    aspectRatio: String(ratio),
                    width: `min(84vw, calc((100svh - 13rem) * ${ratio}))`,
                  }}
                >
                  {/* A foto chega levemente ampliada (1.1) e assenta em 1.0 */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.9, ease: easeSilk }}
                  >
                    <Picture
                      name={item.imagem}
                      alt={item.alt}
                      priority
                      className="absolute inset-0 block h-full w-full"
                      imgClassName="pointer-events-none select-none"
                    />
                  </motion.div>
                </div>
                {item.legenda && (
                  <figcaption className="mt-6 text-center font-accent text-xl italic text-ivory/85">
                    {item.legenda}
                  </figcaption>
                )}
              </motion.figure>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Foto anterior"
                  className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors duration-400 hover:border-ivory/70 sm:grid"
                >
                  <ChevronLeft aria-hidden="true" size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próxima foto"
                  className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors duration-400 hover:border-ivory/70 sm:grid"
                >
                  <ChevronRight aria-hidden="true" size={20} strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>

          {/* Navegação no celular (as setas laterais somem abaixo de 640px) */}
          {total > 1 && (
            <div className="flex shrink-0 items-center justify-center gap-4 pb-[calc(1.5rem+var(--safe-bottom))] pt-4 sm:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className="grid h-12 w-12 place-items-center rounded-full border border-ivory/25 text-ivory"
              >
                <ChevronLeft aria-hidden="true" size={20} strokeWidth={1.5} />
              </button>
              <span className="text-xs text-ivory/70">Deslize para o lado</span>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima foto"
                className="grid h-12 w-12 place-items-center rounded-full border border-ivory/25 text-ivory"
              >
                <ChevronRight aria-hidden="true" size={20} strokeWidth={1.5} />
              </button>
            </div>
          )}
          {total > 1 && <div className="hidden h-8 shrink-0 sm:block" />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
