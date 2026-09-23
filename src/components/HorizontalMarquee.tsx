import { Fragment } from 'react'
import { cn } from '@/lib/cn'

type HorizontalMarqueeProps = {
  items: string[]
  /** Segundos para percorrer uma volta. Padrão 25 */
  speed?: number
  separator?: string
  className?: string
}

/**
 * Faixa de texto que rola sem fim (decorativa, aria-hidden).
 * Três cópias lado a lado: a animação anda 1/3 e recomeça, sem emenda.
 * Com "reduzir movimento": parada. Passar o mouse pausa.
 * Texto muted-strong em 24px+ (texto grande pede 3:1; sobre sand dá 4.2:1).
 */
export function HorizontalMarquee({ items, speed = 25, separator = '✦', className }: HorizontalMarqueeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('overflow-hidden border-y border-ink/10 bg-sand py-4 md:py-5', className)}
    >
      <div
        className="flex w-max motion-safe:animate-marquee hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {[0, 1, 2].map((copia) => (
          <div key={copia} className="flex shrink-0 items-center">
            {items.map((item) => (
              <Fragment key={item}>
                <span className="whitespace-nowrap px-6 font-accent text-2xl uppercase italic tracking-widest text-muted-strong md:px-8 md:text-[1.75rem]">
                  {item}
                </span>
                <span className="text-lg text-primary">{separator}</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
