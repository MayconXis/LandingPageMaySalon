import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { comAtraso, fadeOnly, lineReveal } from '@/lib/motion'
import { useIntroConcluida } from '@/lib/intro'

type WizardProgressProps = {
  etapas: readonly string[]
  /** índice da etapa atual (0, 1, 2) */
  atual: number
}

/**
 * Progresso do assistente: bolinhas ligadas por uma linha.
 * Concluída = sage preenchido com ✓ · Atual = anel sage · Próxima = contorno neutro.
 * Ao abrir a página, as linhas entre as etapas "desenham" da esquerda para a direita.
 */
export function WizardProgress({ etapas, atual }: WizardProgressProps) {
  const reduce = useReducedMotion()
  const pronto = useIntroConcluida()
  return (
    <nav aria-label="Etapas do agendamento">
      <p className="sr-only">
        Etapa {atual + 1} de {etapas.length}: {etapas[atual]}
      </p>
      <ol className="flex items-start">
        {etapas.map((etapa, i) => {
          const feita = i < atual
          const agora = i === atual
          const ultima = i === etapas.length - 1
          return (
            <li
              key={etapa}
              aria-current={agora ? 'step' : undefined}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* Linha até a próxima etapa */}
              {!ultima && (
                <motion.span
                  aria-hidden="true"
                  className="absolute left-1/2 top-4 h-0.5 w-full origin-left bg-line"
                  variants={reduce ? fadeOnly : comAtraso(lineReveal, 0.3 + i * 0.2)}
                  initial="hidden"
                  animate={pronto ? 'show' : 'hidden'}
                >
                  <span
                    className="block h-full bg-primary transition-[width] duration-600 ease-silk"
                    style={{ width: feita ? '100%' : '0%' }}
                  />
                </motion.span>
              )}
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 text-sm font-medium transition-colors duration-500',
                  feita && 'border-primary bg-primary text-ivory',
                  agora && 'border-primary bg-ivory text-primary-700',
                  !feita && !agora && 'border-line bg-ivory text-muted-strong',
                )}
              >
                {feita ? <Check size={16} strokeWidth={2} /> : i + 1}
              </span>
              <span
                className={cn(
                  'mt-2 text-center text-[0.8125rem] font-medium',
                  agora ? 'text-ink' : 'text-muted-strong',
                )}
              >
                {etapa}
                <span className="sr-only">{feita ? ' (concluída)' : agora ? ' (etapa atual)' : ''}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
