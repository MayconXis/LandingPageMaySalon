import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'
import { TextRevealWords } from './TextRevealWords'

type SectionHeadingProps = {
  id?: string
  eyebrow: string
  /** Título comum. Ignorado quando há titleWords. */
  title?: ReactNode
  /**
   * Título que aparece palavra por palavra (TextRevealWords).
   * accentWords: quantas palavras do fim ganham accentClassName (ex.: itálico).
   */
  titleWords?: { text: string; accentWords?: number; accentClassName?: string }
  description?: ReactNode
  /** light = seção clara (ivory/sand) · dark = seção bg-deep */
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  action?: ReactNode
  className?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  titleWords,
  description,
  tone = 'light',
  align = 'left',
  action,
  className,
}: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <p className={dark ? 'eyebrow-light' : 'eyebrow'}>{eyebrow}</p>
        {titleWords ? (
          <TextRevealWords
            as="h2"
            id={id}
            text={titleWords.text}
            accentWords={titleWords.accentWords}
            accentClassName={titleWords.accentClassName}
            className={cn('mt-4 text-display-lg', dark && '!text-ivory')}
          />
        ) : (
          <h2 id={id} className={cn('mt-4 text-display-lg', dark && '!text-ivory')}>
            {title}
          </h2>
        )}
        {description && (
          <p className={cn('mt-5 text-lg leading-relaxed', dark ? 'text-ivory/75' : 'text-charcoal-soft')}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  )
}
