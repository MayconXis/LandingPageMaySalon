import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { easeSilk, viewportOnce } from '@/lib/motion'

type AnimatedCounterProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  /** Atraso em segundos (para escalonar vários números lado a lado) */
  delay?: number
}

/**
 * Conta de 0 até o valor (1.8s, curva silk) quando entra na tela, uma vez.
 * Enquanto sobe, o número sai de um desfoque de 4px e fica nítido ao chegar.
 * Usa MotionValue: o número muda sem re-renderizar o React a cada quadro.
 * Leitores de tela recebem só o número final. Com "reduzir movimento": número final direto, sem desfoque.
 */
export function AnimatedCounter({ value, decimals = 0, prefix = '', suffix = '', className, delay = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: viewportOnce.once, margin: viewportOnce.margin })
  const reduce = useReducedMotion()

  const format = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  const count = useMotionValue(0)
  const text = useTransform(count, (v) => `${prefix}${format(decimals ? v : Math.round(v))}${suffix}`)
  // Desfoque proporcional ao que falta: 4px no início, 0 no valor final
  const filter = useTransform(count, (v) => `blur(${value ? Math.max(0, 1 - v / value) * 4 : 0}px)`)

  useEffect(() => {
    if (reduce) {
      count.set(value)
      return
    }
    if (!inView) return
    const controls = animate(count, value, { duration: 1.8, ease: easeSilk, delay })
    return () => controls.stop()
  }, [inView, reduce, value, count, delay])

  return (
    <span ref={ref} className={className}>
      <motion.span aria-hidden="true" className="inline-block tabular-nums" style={reduce ? undefined : { filter }}>
        {text}
      </motion.span>
      <span className="sr-only">{`${prefix}${format(value)}${suffix}`}</span>
    </span>
  )
}
