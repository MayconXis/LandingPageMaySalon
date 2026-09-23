import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Monograma } from './Monograma'

type LogoProps = {
  /** full: monograma + "May Salon" · icon: só o monograma */
  mode?: 'full' | 'icon'
  /** Fundo em que o logo está: no escuro as letras do monograma ficam ivory */
  tom?: 'claro' | 'escuro'
  /** md (header) ou lg (rodapé) */
  tamanho?: 'md' | 'lg'
  className?: string
  onClick?: () => void
}

/**
 * Logo do May Salon: monograma MS (sage) + wordmark em Playfair Display.
 * A cor do texto vem do className: text-primary-700 no claro, text-ivory no escuro.
 */
export function Logo({ mode = 'full', tom = 'claro', tamanho = 'md', className, onClick }: LogoProps) {
  const grande = tamanho === 'lg'
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="May Salon, página inicial"
      className={cn(
        'inline-flex min-h-[44px] min-w-[44px] items-center font-display leading-none tracking-[-0.01em]',
        grande ? 'gap-3.5' : 'gap-2.5',
        className,
      )}
    >
      <Monograma size={grande ? 56 : 40} letras={tom === 'escuro' ? 'ivory' : 'sand'} />
      {mode === 'full' && (
        <span aria-hidden="true">
          May <em className="font-normal italic">Salon</em>
        </span>
      )}
    </Link>
  )
}
