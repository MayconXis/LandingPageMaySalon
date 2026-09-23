import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'
import { springHover } from '@/lib/motion'

type Modo = 'ponto' | 'link' | 'zoom'

/** Elementos clicáveis: o cursor vira anel */
const CLICAVEL = 'a, button, [role="button"], [role="tab"], [role="slider"], label, select, summary, input, textarea'

const TAMANHO: Record<Modo, number> = { ponto: 12, link: 40, zoom: 56 }

/**
 * Cursor decorativo (só desktop com mouse): um ponto gold que segue o mouse com mola.
 * Sobre links e botões vira um anel de 40px; sobre fotos que abrem ampliadas
 * (data-cursor="zoom") mostra um "+". O cursor do sistema continua visível.
 * Não aparece em toque nem com "reduzir movimento".
 */
export function CustomCursor() {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )
  const [modo, setModo] = useState<Modo>('ponto')
  const [visivel, setVisivel] = useState(false)
  const modoRef = useRef<Modo>('ponto')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const mola = { stiffness: 500, damping: 40, mass: 0.4 }
  const sx = useSpring(x, mola)
  const sy = useSpring(y, mola)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const ativo = fine && !reduce

  useEffect(() => {
    if (!ativo) return
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisivel(true)
      const alvo = e.target instanceof Element ? e.target : null
      const novo: Modo = alvo?.closest('[data-cursor="zoom"]') ? 'zoom' : alvo?.closest(CLICAVEL) ? 'link' : 'ponto'
      if (novo !== modoRef.current) {
        modoRef.current = novo
        setModo(novo)
      }
    }
    const sair = () => setVisivel(false)
    window.addEventListener('pointermove', mover, { passive: true })
    document.documentElement.addEventListener('pointerleave', sair)
    return () => {
      window.removeEventListener('pointermove', mover)
      document.documentElement.removeEventListener('pointerleave', sair)
    }
  }, [ativo, x, y])

  if (!ativo) return null

  const tamanho = TAMANHO[modo]
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[10000] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold text-gold"
        animate={{
          width: tamanho,
          height: tamanho,
          opacity: visivel ? (modo === 'ponto' ? 0.5 : 0.9) : 0,
          backgroundColor: modo === 'ponto' ? 'rgba(201, 168, 76, 1)' : 'rgba(201, 168, 76, 0)',
        }}
        transition={springHover}
      >
        {modo === 'zoom' && <Plus size={20} strokeWidth={1.5} />}
      </motion.div>
    </motion.div>
  )
}
