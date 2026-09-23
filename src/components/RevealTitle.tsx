import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { textRevealContainer, textRevealLine } from '@/lib/motion'
import { useIntroConcluida } from '@/lib/intro'
import { cn } from '@/lib/cn'

type RevealTitleProps = {
  /** Uma entrada por linha visual. Cada linha sobe de baixo da própria "janela". */
  lines: ReactNode[]
  /** Texto completo, lido por leitores de tela (as linhas ficam aria-hidden) */
  label: string
  as?: 'h1' | 'h2'
  id?: string
  className?: string
  /** atraso antes da primeira linha (s) */
  delay?: number
}

/**
 * Text reveal linha a linha: a animação-assinatura do site.
 * Use SÓ em títulos de hero. Em cards e listas, use <Stagger>.
 *
 * A janela de cada linha tem um respiro vertical (padding + margem negativa)
 * para não cortar acentos (É, Ó) nem descendentes (ç, g, p) da Playfair e da Cormorant.
 */
export function RevealTitle({ lines, label, as = 'h1', id, className, delay = 0.05 }: RevealTitleProps) {
  const Tag = motion[as]
  // Na primeira visita, espera a cortina da abertura abrir
  const pronto = useIntroConcluida()
  return (
    <Tag
      id={id}
      aria-label={label}
      className={className}
      variants={textRevealContainer(delay)}
      initial="hidden"
      animate={pronto ? 'show' : 'hidden'}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn('-mb-[0.16em] -mt-[0.08em] block overflow-hidden pb-[0.16em] pr-[0.1em] pt-[0.08em]')}
        >
          <motion.span className="block will-change-transform" variants={textRevealLine}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
