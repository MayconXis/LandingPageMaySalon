import { useEffect, useState } from 'react'
import { site } from '@/config/site'
import { statusDoSalao } from '@/lib/horario'
import { cn } from '@/lib/cn'

/**
 * Selo "● Aberto agora" (ponto pulsando e um halo suave de 2s em volta do selo)
 * ou "○ Fechado · Abre segunda às 9h".
 * Calculado no fuso do salão com site.hours e atualizado a cada minuto,
 * então vira sozinho às 19h com a página aberta.
 */
export function StatusFuncionamento({ className }: { className?: string }) {
  const [agora, setAgora] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setAgora(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const status = statusDoSalao(agora, site.hours)

  if (status.aberto) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-full bg-primary/15 px-3.5 py-1.5 text-sm font-medium text-primary-700 motion-safe:animate-selo',
          className,
        )}
      >
        <span aria-hidden="true" className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-primary-600 motion-safe:animate-pulse-ring" />
          <span className="relative h-2 w-2 rounded-full bg-primary-600" />
        </span>
        Aberto agora
        <span className="sr-only">, até as {status.fechaAs}</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm text-charcoal-soft',
        className,
      )}
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full border border-muted-strong" />
      Fechado{status.abre && ` · Abre ${status.abre}`}
    </span>
  )
}
