import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  clipReveal,
  clipRevealLeft,
  comAtraso,
  fadeOnly,
  scaleReveal,
  staggerItem,
  viewportOnce,
  wordRevealContainer,
} from '@/lib/motion'

export type RevealVariant = 'fadeUp' | 'clipBottom' | 'clipLeft' | 'scale' | 'wordReveal'

const VARIANTS: Record<RevealVariant, Variants> = {
  fadeUp: staggerItem,
  clipBottom: clipReveal,
  clipLeft: clipRevealLeft,
  scale: scaleReveal,
  wordReveal: wordRevealContainer(),
}

/** Variants de uma revelação, já com o fallback de "reduzir movimento" (só opacidade) */
export function variantsDeRevelacao(variant: RevealVariant, reduce: boolean | null): Variants {
  if (!reduce) return VARIANTS[variant]
  // wordReveal é só um container (quem anima são as palavras filhas): segue igual
  return variant === 'wordReveal' ? VARIANTS.wordReveal : fadeOnly
}

type ScrollRevealProps = {
  children: ReactNode
  /**
   * fadeUp: sobe 32px · clipBottom: destampa de baixo para cima · clipLeft: da esquerda para a direita ·
   * scale: encaixa de 1.15 para 1 · wordReveal: escalona filhos com wordRevealItem (use TextRevealWords)
   */
  variant?: RevealVariant
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'article'
}

/**
 * Revela o conteúdo ao entrar na tela (uma vez, 80px depois da borda de cima/baixo).
 * Com "reduzir movimento": só fade, sem transform, recorte ou blur.
 */
export function ScrollReveal({ children, variant = 'fadeUp', delay = 0, className, as = 'div' }: ScrollRevealProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      variants={comAtraso(variantsDeRevelacao(variant, reduce), delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </Tag>
  )
}
