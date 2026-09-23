import { motion, useReducedMotion, useScroll } from 'framer-motion'

/**
 * Barra de progresso da leitura: 1px gold logo abaixo do header, cresce da esquerda
 * conforme a página rola. Decorativa. Com "reduzir movimento": não aparece.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[var(--header-h)] z-[39] h-px origin-left bg-gold/60"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
