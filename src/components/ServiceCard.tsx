import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ImageName } from '@/data/images'
import { precoServico } from '@/data/servicos'
import { easeSilk, springHover } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { Picture } from './Picture'

// Mesma sombra "lift" do tema, em rgba (o Framer interpola cada número); em repouso, transparente
const SOMBRA_REPOUSO = '0 2px 4px rgba(28, 23, 20, 0), 0 18px 40px -18px rgba(28, 23, 20, 0)'
const SOMBRA_HOVER = '0 2px 4px rgba(28, 23, 20, 0.04), 0 18px 40px -18px rgba(28, 23, 20, 0.22)'

type ServiceCardProps = {
  slug: string
  nome: string
  assinatura: string
  texto: string
  precoDe: number | null
  precoAte?: number | null
  /** Pacote montado sob medida (ex.: Dia da Noiva): mostra "Orçamento personalizado" no lugar do valor */
  orcamentoPersonalizado?: boolean
  duracao?: string
  icon: LucideIcon
  imagem?: { name: ImageName; alt: string }
  /** Posição da foto no bento: ao lado (card largo) ou em cima (card grande 2×2) */
  imagemPosicao?: 'lado' | 'topo'
  /** bento = Home (CTA aparece no hover) · lista = /servicos (CTA sempre visível) */
  variant?: 'bento' | 'lista'
  className?: string
}

/**
 * Cartão de serviço. Borda sage em repouso; no hover/foco a borda vira gold.
 * Micro-interação varia por tipo de card:
 *  - Sem foto: o card sobe 6px e gira 0.5° numa mola (stiffness 300, damping 20).
 *  - Com foto: o card fica parado, é a foto que ganha um zoom sutil (scale 1.05, lento);
 *    evita competir com a foto e diferencia o hover do card "sem imagem" (utilitário).
 * Com "reduzir movimento": só a borda e a sombra mudam, nada se desloca.
 * Card grande do bento (2×2, imagemPosicao="topo"): sem a bolha-ícone, a foto domina sozinha.
 * Hierarquia: nome comum (eyebrow) → nome-assinatura → descrição → duração/valor → Agendar.
 */
export function ServiceCard({
  slug,
  nome,
  assinatura,
  texto,
  precoDe,
  precoAte,
  orcamentoPersonalizado,
  duracao,
  icon: Icon,
  imagem,
  imagemPosicao = 'lado',
  variant = 'lista',
  className,
}: ServiceCardProps) {
  const bento = variant === 'bento'
  const lado = bento && imagemPosicao === 'lado'
  // Card grande do bento (2×2): a foto domina, sem a bolha-ícone
  const grande = bento && imagemPosicao === 'topo'
  const temFoto = !!imagem
  const titleId = `servico-${variant}-${slug}`
  const reduce = useReducedMotion()
  // Com foto, o hover é a própria foto (zoom sutil); sem foto, o card é que sobe e gira
  const levantaEGira = !temFoto && !reduce

  return (
    // Hover detectado no wrapper parado; o card é que sobe e gira (sem "quicar" com o cursor na borda)
    <motion.div className="h-full" whileHover={levantaEGira ? 'hover' : undefined}>
      <motion.article
        aria-labelledby={titleId}
        style={levantaEGira ? { boxShadow: SOMBRA_REPOUSO } : undefined}
        variants={{ hover: { y: -6, rotate: 0.5, boxShadow: SOMBRA_HOVER } }}
        transition={{ ...springHover, boxShadow: { duration: 0.4, ease: easeSilk } }}
        className={cn(
          'group relative flex h-full overflow-hidden rounded-panel border border-primary/35 bg-ivory transition-[border-color] duration-500 ease-silk',
          'hover:border-gold focus-within:border-gold',
          (reduce || temFoto) && 'transition-[border-color,box-shadow] hover:shadow-soft',
          imagem && lado ? 'flex-col sm:flex-row' : 'flex-col',
          className,
        )}
      >
        {imagem && (
          <div
            className={cn(
              'relative overflow-hidden',
              lado
                ? 'aspect-[4/3] sm:order-2 sm:aspect-auto sm:w-[46%] sm:shrink-0'
                : bento
                  ? 'aspect-[4/3] lg:aspect-auto lg:min-h-[16rem] lg:flex-1'
                  : 'aspect-[4/3]',
            )}
          >
            {/* Foto absoluta: quem define a altura é o card, não o tamanho da imagem */}
            <Picture
              name={imagem.name}
              alt={imagem.alt}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
              className="absolute inset-0 block h-full w-full"
              imgClassName="transition-transform duration-800 ease-silk group-hover:scale-[1.05]"
            />
          </div>
        )}

        <div
          className={cn(
            'flex flex-col p-6 sm:p-7',
            imagem && bento && !lado ? 'shrink-0' : 'flex-1',
            bento && !imagem && 'lg:p-8',
          )}
        >
          {!grande && (
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary-700">
                <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
              </span>
            </div>
          )}

          <p
            className={cn(
              'text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-muted-strong',
              grande ? 'mt-0' : 'mt-6',
            )}
          >
            {nome}
          </p>
          <h3 id={titleId} className="mt-2 font-display text-[1.5rem] leading-tight text-ink md:text-[1.625rem]">
            {assinatura}
          </h3>
          <p className={cn('mt-3 text-[0.9375rem] leading-relaxed text-charcoal-soft', !bento && 'sm:line-clamp-3')}>
            {texto}
          </p>

          <div className="mt-auto pt-6">
            <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal-soft">
              {duracao && (
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Duração</dt>
                  <Clock aria-hidden="true" size={15} strokeWidth={1.5} className="text-primary-700" />
                  <dd>{duracao}</dd>
                </div>
              )}
              <div>
                <dt className="sr-only">Valor</dt>
                <dd className="font-medium text-ink">{precoServico({ precoDe, precoAte, orcamentoPersonalizado })}</dd>
              </div>
            </dl>

            <Link
              to={`/agendamento?servico=${slug}`}
              aria-label={`Agendar ${nome}`}
              className={cn(
                'btn btn-primary btn-sm mt-5 w-full sm:w-auto',
                // No bento, o CTA aparece no hover (só em dispositivos com mouse) ou no foco
                bento &&
                  '[@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:pointer-events-auto [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100',
              )}
            >
              Agendar
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
