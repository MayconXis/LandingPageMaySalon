import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type MirrorFrameProps = {
  children: ReactNode
  className?: string
  /** Aro do espelho: gold (só no hero) ou sage */
  rim?: 'gold' | 'sage'
}

/**
 * Assinatura visual do site: o "espelho cápsula".
 * Reproduz os espelhos ovais de moldura dourada do próprio salão (vide fotos do Instagram):
 * a foto recortada em cápsula vertical, com um aro fino afastado da imagem.
 */
export function MirrorFrame({ children, className, rim = 'sage' }: MirrorFrameProps) {
  return (
    <div className={cn('relative p-2.5 sm:p-3', className)}>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 rounded-full border',
          rim === 'gold' ? 'border-gold/60' : 'border-primary/50',
        )}
      />
      <div className="relative h-full w-full overflow-hidden rounded-full">{children}</div>
    </div>
  )
}
