import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { easeSilk, staggerItem, viewportOnce } from '@/lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section'
}

/**
 * Bloco que aparece ao entrar na tela (fade + 32px de subida), uma única vez.
 * Para listas, prefira <Stagger> + <StaggerItem>, que escalonam os filhos sozinhos.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Tag = motion[as]
  const variants: Variants = delay
    ? {
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeSilk, delay } },
      }
    : staggerItem
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants}>
      {children}
    </Tag>
  )
}
