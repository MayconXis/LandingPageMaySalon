import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, viewportOnce } from '@/lib/motion'
import { variantsDeRevelacao, type RevealVariant } from './ScrollReveal'

type Tag = 'div' | 'ul' | 'ol' | 'li' | 'dl' | 'section'

type StaggerProps = {
  children: ReactNode
  className?: string
  as?: Tag
  /** intervalo entre filhos (s). Padrão 0.12 */
  stagger?: number
  delay?: number
}

/**
 * Container de stagger reveal: quando entra na tela (uma vez, 80px depois da borda),
 * os <StaggerItem> filhos aparecem um depois do outro.
 */
export function Stagger({ children, className, as = 'div', stagger = 0.12, delay = 0 }: StaggerProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </Component>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  as?: Tag
  /** Como o item entra. Padrão fadeUp (sobe 32px, 0.7s). */
  variant?: Exclude<RevealVariant, 'wordReveal'>
}

/** Filho de <Stagger>. Com "reduzir movimento", qualquer variante vira só fade. */
export function StaggerItem({ children, className, as = 'div', variant = 'fadeUp' }: StaggerItemProps) {
  const reduce = useReducedMotion()
  const Component = motion[as]
  return (
    <Component className={className} variants={variantsDeRevelacao(variant, reduce)}>
      {children}
    </Component>
  )
}
