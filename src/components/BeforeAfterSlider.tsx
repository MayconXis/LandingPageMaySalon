import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ImageName } from '@/data/images'
import { cn } from '@/lib/cn'
import { Picture } from './Picture'

type Img = { name: ImageName; alt: string }

type BeforeAfterSliderProps = {
  antes: Img
  depois: Img
  /** Título curto da transformação, ex.: "Morena iluminada" */
  label: string
  /** Descrição para leitores de tela (vai no aria-label do role="img") */
  descricao?: string
  /**
   * Demonstração: ainda não temos a foto real de "antes", então o "antes" é a mesma
   * foto em preto e branco. Quando vierem os pares reais, passe false: o filtro some.
   */
  ilustrativo?: boolean
  /** capsule = espelho oval (assinatura) · rounded = cantos arredondados (faixa da Home) */
  shape?: 'capsule' | 'rounded'
  className?: string
}

const clamp = (n: number) => Math.min(100, Math.max(0, n))

/**
 * Comparador antes/depois sem biblioteca: clip-path + pointer events.
 *
 * - A foto é um role="img" com aria-label descrevendo a transformação.
 * - A alça é um role="slider" separado (setas ±5%, Page ±25%, Home/End), arrastável
 *   com mouse, toque ou caneta. Tocar/clicar na foto também move a alça.
 * - No toque, só a alça captura o arraste horizontal: o resto da foto deixa a página rolar.
 * - Com "reduzir movimento": sem arraste, as duas fotos aparecem lado a lado.
 */
export function BeforeAfterSlider({
  antes,
  depois,
  label,
  descricao,
  ilustrativo,
  shape = 'rounded',
  className,
}: BeforeAfterSliderProps) {
  const reduce = useReducedMotion()
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const areaRef = useRef<HTMLDivElement>(null)
  const tapStart = useRef<{ x: number; y: number } | null>(null)

  const capsule = shape === 'capsule'
  const radius = capsule ? 'rounded-full' : 'rounded-panel'
  const antesFiltro = ilustrativo ? 'grayscale' : undefined
  const ariaLabel = [
    `Antes e depois${ilustrativo ? ' (imagem ilustrativa)' : ''}: ${label}.`,
    descricao,
  ]
    .filter(Boolean)
    .join(' ')

  // Posição das etiquetas: no espelho oval ficam mais para dentro para não serem cortadas
  const tagPos = capsule ? 'top-[17%]' : 'top-3'
  const tagLeft = capsule ? 'left-[15%]' : 'left-3'
  const tagRight = capsule ? 'right-[15%]' : 'right-3'

  const posFromClientX = useCallback((clientX: number) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return 50
    return clamp(((clientX - rect.left) / rect.width) * 100)
  }, [])

  const onHandleDown = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onHandleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setPos(posFromClientX(e.clientX))
  }
  const onHandleUp = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const onAreaDown = (e: PointerEvent<HTMLDivElement>) => {
    tapStart.current = { x: e.clientX, y: e.clientY }
  }
  const onAreaUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = tapStart.current
    tapStart.current = null
    if (start && Math.abs(e.clientX - start.x) < 8 && Math.abs(e.clientY - start.y) < 8) {
      setPos(posFromClientX(e.clientX))
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -25,
      PageUp: 25,
    }
    if (e.key in steps) {
      e.preventDefault()
      setPos((p) => clamp(p + (steps[e.key] ?? 0)))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setPos(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setPos(100)
    }
  }

  const tagAntes = 'rounded-full bg-deep/60 px-3 py-1 text-xs font-medium text-ivory backdrop-blur-sm'
  // "Depois": base escura com véu gold/20, para o texto claro continuar legível sobre qualquer foto
  const tagDepois =
    'rounded-full bg-deep/60 px-3 py-1 text-xs font-medium text-ivory shadow-[inset_0_0_0_999px_rgb(201_168_76/0.2)] ring-1 ring-gold/50 backdrop-blur-sm'

  /* ── Movimento reduzido: as duas fotos lado a lado, sem arraste ── */
  if (reduce) {
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className={cn('relative grid grid-cols-2 gap-1 overflow-hidden', radius, className)}
      >
        <div className="relative overflow-hidden">
          <Picture name={antes.name} alt="" className="absolute inset-0 block h-full w-full" imgClassName={antesFiltro} />
          <span aria-hidden="true" className={cn('absolute', tagPos, capsule ? 'left-[30%]' : tagLeft, tagAntes)}>
            Antes
          </span>
        </div>
        <div className="relative overflow-hidden">
          <Picture name={depois.name} alt="" className="absolute inset-0 block h-full w-full" />
          <span aria-hidden="true" className={cn('absolute', tagPos, capsule ? 'right-[30%]' : tagRight, tagDepois)}>
            Depois
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={areaRef}
      className={cn('relative isolate select-none overflow-hidden', radius, className)}
      style={{ touchAction: 'pan-x pan-y' }}
      onPointerDown={onAreaDown}
      onPointerUp={onAreaUp}
      onPointerCancel={() => (tapStart.current = null)}
    >
      {/* Imagem composta (antes + depois), descrita como uma só para leitores de tela */}
      <div role="img" aria-label={ariaLabel} className="absolute inset-0">
        <Picture name={depois.name} alt="" className="absolute inset-0 block h-full w-full" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Picture name={antes.name} alt="" className="absolute inset-0 block h-full w-full" imgClassName={antesFiltro} />
        </div>

        <span
          aria-hidden="true"
          className={cn('pointer-events-none absolute transition-opacity duration-300', tagPos, tagLeft, tagAntes)}
          style={{ opacity: pos < 22 ? 0 : 1 }}
        >
          Antes
        </span>
        <span
          aria-hidden="true"
          className={cn('pointer-events-none absolute transition-opacity duration-300', tagPos, tagRight, tagDepois)}
          style={{ opacity: pos > 78 ? 0 : 1 }}
        >
          Depois
        </span>
      </div>

      {/* Linha divisória */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-10 -ml-px w-0.5 bg-ivory/90"
        style={{ left: `${pos}%` }}
      />

      {/* Alça: círculo sage com setas em ivory (ícones 3.9:1) */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Comparar antes e depois: ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% da foto de antes visível`}
        onKeyDown={onKeyDown}
        onPointerDown={onHandleDown}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
        onPointerCancel={onHandleUp}
        className={cn(
          'absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-primary text-ivory shadow-lift ring-2 ring-ivory/80 transition-transform duration-200',
          dragging && 'scale-110',
        )}
        style={{ left: `${pos}%`, touchAction: 'none' }}
      >
        <ChevronLeft aria-hidden="true" size={16} strokeWidth={2} className="-mr-1" />
        <ChevronRight aria-hidden="true" size={16} strokeWidth={2} className="-ml-1" />
      </div>
    </div>
  )
}
