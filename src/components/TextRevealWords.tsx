import { Fragment } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeOnly, viewportOnce, wordRevealContainer, wordRevealItem } from '@/lib/motion'
import { useIntroConcluida } from '@/lib/intro'
import { cn } from '@/lib/cn'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span'

type TextRevealWordsProps = {
  /** Texto do título. "\n" quebra a linha. */
  text: string
  className?: string
  delay?: number
  as?: Tag
  id?: string
  /** Quantas palavras do fim ganham o destaque (ex.: "nossa arte." em itálico gold) */
  accentWords?: number
  accentClassName?: string
  /** inView (padrão): ao entrar na tela · mount: ao montar, esperando a abertura do site (heroes) */
  trigger?: 'inView' | 'mount'
  /** Intervalo entre palavras (s) */
  stagger?: number
}

/**
 * Texto que aparece palavra por palavra (sobe 12px e sai do desfoque).
 * Cada palavra fica numa "janela" com overflow hidden; o respiro em volta (padding com margem
 * negativa, sem mudar o layout) evita cortar acentos, descendentes e o traço do itálico.
 * Leitores de tela leem a frase normal: as palavras continuam separadas por espaços no DOM.
 * Com "reduzir movimento": só fade.
 */
export function TextRevealWords({
  text,
  className,
  delay = 0,
  as = 'p',
  id,
  accentWords = 0,
  accentClassName,
  trigger = 'inView',
  stagger = 0.04,
}: TextRevealWordsProps) {
  const reduce = useReducedMotion()
  const introConcluida = useIntroConcluida()
  const Component = motion[as]

  const linhas = text.split('\n').map((l) => l.trim().split(/\s+/).filter(Boolean))
  const total = linhas.reduce((n, l) => n + l.length, 0)
  let indice = 0

  const container = { ...wordRevealContainer(stagger) }
  if (delay && container.show && typeof container.show !== 'function') {
    container.show = { ...container.show, transition: { staggerChildren: stagger, delayChildren: delay } }
  }

  const gatilho =
    trigger === 'mount'
      ? { animate: introConcluida ? 'show' : 'hidden' }
      : { whileInView: 'show', viewport: viewportOnce }

  return (
    <Component id={id} className={className} variants={container} initial="hidden" {...gatilho}>
      {linhas.map((palavras, l) => (
        <Fragment key={l}>
          {l > 0 && <br />}
          {palavras.map((palavra, p) => {
            const destaque = indice++ >= total - accentWords
            return (
              <Fragment key={p}>
                {p > 0 && ' '}
                <span className="-mx-[0.12em] -mb-[0.16em] -mt-[0.08em] inline-block overflow-hidden px-[0.12em] pb-[0.16em] pt-[0.08em] align-bottom">
                  <motion.span
                    className={cn('inline-block', destaque && accentClassName)}
                    variants={reduce ? fadeOnly : wordRevealItem}
                  >
                    {palavra}
                  </motion.span>
                </span>
              </Fragment>
            )
          })}
        </Fragment>
      ))}
    </Component>
  )
}
