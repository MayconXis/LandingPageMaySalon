import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Star } from 'lucide-react'
import type { Depoimento } from '@/data/depoimentos'
import { easeSilk } from '@/lib/motion'
import { cn } from '@/lib/cn'

type TestimonialsCarouselProps = {
  items: Depoimento[]
  interval?: number
}

/**
 * Carrossel de depoimentos (um por vez, editorial).
 * - Troca sozinho a cada 4s; pausa no hover, no foco e pelo botão (WCAG 2.2.2).
 * - Com "reduzir movimento", não troca sozinho.
 * - Swipe no celular, setas e pontos de navegação.
 */
export function TestimonialsCarousel({ items, interval = 4000 }: TestimonialsCarouselProps) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  const playing = !reduce && !userPaused && !hovered && !focused
  const total = items.length

  const go = useCallback(
    (next: number, dir: 1 | -1) => {
      setDirection(dir)
      setIndex(((next % total) + total) % total)
    },
    [total],
  )
  const next = useCallback(() => go(index + 1, 1), [go, index])
  const prev = useCallback(() => go(index - 1, -1), [go, index])

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(next, interval)
    return () => window.clearTimeout(id)
  }, [playing, next, interval, index])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) next()
    else if (info.offset.x > 60) prev()
  }

  const item = items[index]
  if (!item) return null

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Depoimentos de clientes"
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <div className="relative" aria-live={playing ? 'off' : 'polite'}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.figure
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${total}`}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 32 * d }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: -32 * d }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: easeSilk }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            className="cursor-grab rounded-panel border border-blush/45 px-7 py-10 text-center active:cursor-grabbing sm:px-12 md:px-16 md:py-14"
          >
            <div className="flex justify-center gap-1 text-blush" aria-label={`Nota ${item.nota} de 5`} role="img">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.5}
                  className={i < item.nota ? 'fill-current' : 'opacity-30'}
                />
              ))}
            </div>

            <blockquote className="mt-8">
              <p className="font-accent text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] italic leading-snug text-ivory">
                “{item.texto}”
              </p>
            </blockquote>

            <figcaption className="mt-8">
              <span className="block font-medium text-ivory">{item.nome}</span>
              <span className="mt-1 block text-sm text-blush">
                {item.servico}
                {/* A data só aparece em depoimento real: data em relato ilustrativo pareceria verdadeira */}
                {!item.ilustrativo && item.data && <> · {item.data}</>}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* Controles */}
      <div className="mt-8 flex items-center justify-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={prev}
          aria-label="Depoimento anterior"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors duration-400 hover:border-blush hover:text-blush"
        >
          <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>

        {/* Mobile: contador "2 / 6". A partir de sm: pontos clicáveis. */}
        <p className="min-w-[4.5rem] text-center text-sm tabular-nums text-ivory/75 sm:hidden" aria-hidden="true">
          {index + 1} / {total}
        </p>
        <div className="hidden items-center sm:flex" role="group" aria-label="Escolher depoimento">
          {items.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Depoimento ${i + 1}: ${d.nome}`}
              aria-current={i === index ? 'true' : undefined}
              className="group grid h-11 w-8 place-items-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-500 ease-silk',
                  i === index ? 'w-5 bg-blush' : 'w-1.5 bg-ivory/35 group-hover:bg-ivory/70',
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Próximo depoimento"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors duration-400 hover:border-blush hover:text-blush"
        >
          <ChevronRight aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>

        {!reduce && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? 'Retomar troca automática' : 'Pausar troca automática'}
            className="ml-1 grid h-11 w-11 shrink-0 place-items-center rounded-full sm:ml-2 text-ivory/70 transition-colors duration-400 hover:text-ivory"
          >
            {userPaused ? (
              <Play aria-hidden="true" size={16} strokeWidth={1.5} />
            ) : (
              <Pause aria-hidden="true" size={16} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
