import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { easeSilk } from '@/lib/motion'
import { cn } from '@/lib/cn'

type Opcao<T extends string> = { id: T; label: string }

type FilterPillsProps<T extends string> = {
  opcoes: readonly Opcao<T>[]
  valor: T
  onChange: (valor: T) => void
  /** Nome do grupo para leitores de tela, ex.: "Filtrar fotos" */
  label: string
  /** id da região que o filtro atualiza */
  controls?: string
  /** id único do indicador animado quando houver mais de um grupo na página */
  layoutId?: string
  className?: string
}

/**
 * Pills de filtro. Botões com aria-pressed (um ativo por vez).
 * Ativo: primary-700 com texto ivory (7.6:1). Rola na horizontal no mobile
 * e traz a pill ativa para a área visível.
 */
export function FilterPills<T extends string>({
  opcoes,
  valor,
  onChange,
  label,
  controls,
  layoutId = 'filter-pill',
  className,
}: FilterPillsProps<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    refs.current[valor]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [valor])

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-3', className)}
    >
      {opcoes.map((o) => {
        const ativo = o.id === valor
        return (
          <button
            key={o.id}
            ref={(el) => {
              refs.current[o.id] = el
            }}
            type="button"
            aria-pressed={ativo}
            aria-controls={controls}
            onClick={() => onChange(o.id)}
            className={cn(
              'relative min-h-[44px] shrink-0 snap-start whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-400',
              ativo ? 'text-ivory' : 'text-charcoal-soft hover:text-primary-700',
            )}
          >
            {ativo ? (
              <motion.span
                layoutId={layoutId}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-primary-700"
                transition={{ duration: 0.5, ease: easeSilk }}
              />
            ) : (
              <span aria-hidden="true" className="absolute inset-0 rounded-full border border-line" />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
