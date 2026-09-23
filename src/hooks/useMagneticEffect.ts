import { useEffect, useState, type MouseEvent } from 'react'
import { useReducedMotion, useSpring, type MotionValue } from 'framer-motion'

const clamp = (n: number) => Math.max(-1, Math.min(1, n))

type Magnetic = {
  /** false em touch (pointer: coarse), com "reduzir movimento" ou com active=false */
  enabled: boolean
  style: { x: MotionValue<number>; y: MotionValue<number> } | undefined
  onMouseMove: ((e: MouseEvent<HTMLElement>) => void) | undefined
  onMouseLeave: (() => void) | undefined
}

/**
 * Cursor magnético: o elemento "puxa" para o mouse, no máximo ±`strength` px,
 * com mola do Framer Motion. Só com mouse (pointer: fine) e sem "reduzir movimento".
 * `active=false` (ex.: botão desabilitado) solta o elemento de volta ao lugar.
 */
export function useMagneticEffect(strength = 8, active = true): Magnetic {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const spring = { stiffness: 250, damping: 18, mass: 0.5 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)
  const possivel = fine && !reduce
  const enabled = possivel && active

  useEffect(() => {
    if (!enabled) {
      x.set(0)
      y.set(0)
    }
  }, [enabled, x, y])

  // Sem mouse ou com "reduzir movimento": nenhum transform é aplicado
  if (!possivel) return { enabled: false, style: undefined, onMouseMove: undefined, onMouseLeave: undefined }

  return {
    enabled,
    style: { x, y },
    onMouseMove: enabled
      ? (e) => {
          const r = e.currentTarget.getBoundingClientRect()
          x.set(clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength)
          y.set(clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength)
        }
      : undefined,
    onMouseLeave: () => {
      x.set(0)
      y.set(0)
    },
  }
}
