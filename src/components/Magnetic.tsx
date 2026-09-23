import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'
import { cn } from '@/lib/cn'

type MagneticProps = {
  children: ReactNode
  className?: string
  /** Deslocamento máximo em px. Padrão 8 */
  strength?: number
  /** Botão desabilitado não "chama" o cursor */
  disabled?: boolean
  /** Botão de largura total (w-full): o wrapper vira bloco */
  block?: boolean
}

/**
 * Envolve um CTA gold com o cursor magnético (desktop com mouse).
 * O wrapper é inline-flex; use `block` quando o botão for w-full.
 */
export function Magnetic({ children, className, strength = 8, disabled = false, block = false }: MagneticProps) {
  const m = useMagneticEffect(strength, !disabled)
  return (
    <motion.span
      className={cn(block ? 'flex w-full' : 'inline-flex', className)}
      style={m.style}
      onMouseMove={m.onMouseMove}
      onMouseLeave={m.onMouseLeave}
    >
      {children}
    </motion.span>
  )
}
