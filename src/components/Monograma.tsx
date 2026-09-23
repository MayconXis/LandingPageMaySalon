import { cn } from '@/lib/cn'

type MonogramaProps = {
  /** Lado em px. Padrão 40 (header) · 96 na abertura */
  size?: number
  /** Cor das letras: sand (padrão, como no Instagram) ou ivory (sobre fundo escuro) */
  letras?: 'sand' | 'ivory'
  className?: string
}

/**
 * Monograma "MS" do May Salon em SVG inline (sem arquivo externo, funciona no Safari 14+).
 * Aproximação do monograma do @maysalon.oficial: círculo sage e "MS" em Cormorant Garamond
 * itálico, letras levemente sobrepostas.
 * TODO(cliente): trocar pelo vetor oficial do logo quando a marca enviar o arquivo.
 * Decorativo: quem nomeia o link é o aria-label do <Logo>.
 */
export function Monograma({ size = 40, letras = 'sand', className }: MonogramaProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
    >
      <circle cx="48" cy="48" r="48" className="fill-primary" />
      <text
        x="48"
        y="62"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
        fontSize="36"
        letterSpacing="-2"
        className={letras === 'ivory' ? 'fill-ivory' : 'fill-sand'}
      >
        MS
      </text>
    </svg>
  )
}
