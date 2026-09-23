import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clipReveal, comAtraso, easeSilk, fadeOnly } from '@/lib/motion'
import { useIntroConcluida } from '@/lib/intro'
import type { ImageName } from '@/data/images'
import { MirrorFrame } from './MirrorFrame'
import { Picture } from './Picture'
import { RevealTitle } from './RevealTitle'

type PageHeaderProps = {
  eyebrow: string
  /** Uma entrada por linha do título (text reveal linha a linha) */
  titleLines: ReactNode[]
  /** Título completo em texto puro, para leitores de tela */
  titleLabel: string
  description?: string
  /** Rótulo da página atual no breadcrumb */
  crumb: string
  /**
   * light = fundo ivory (padrão) · dark = bg-deep.
   * Rotas com tone="dark" precisam estar em DARK_HERO_ROUTES (config/routes.ts)
   * para o header começar com texto claro.
   */
  tone?: 'light' | 'dark'
  /** Hero mais baixo (ex.: Contato) */
  compact?: boolean
  /**
   * Text reveal linha a linha. Por regra do site ele só aparece nos heroes
   * de Home, Galeria, Agendamento, Equipe e Contato (os heroes escuros), então o padrão segue o tom.
   * Sem reveal, as linhas correm juntas como um título normal.
   */
  reveal?: boolean
  /**
   * Foto em espelho cápsula à direita, só no desktop (lg+). Destampa de baixo para cima
   * quando a página abre. caption: legenda curta (ex.: "Imagem ilustrativa").
   */
  image?: { name: ImageName; alt: string; caption?: string }
}

/** Cabeçalho das páginas internas: breadcrumb, eyebrow, título (com ou sem text reveal) e apoio. */
export function PageHeader({
  eyebrow,
  titleLines,
  titleLabel,
  description,
  crumb,
  tone = 'light',
  compact = false,
  reveal,
  image,
}: PageHeaderProps) {
  const dark = tone === 'dark'
  const comReveal = reveal ?? dark
  const pronto = useIntroConcluida()
  const reduce = useReducedMotion()
  // Parallax só na camada de fundo (nunca no texto): ela desce mais devagar que a página
  const { scrollY } = useScroll()
  const fundoY = useTransform(scrollY, [0, 500], [0, 90])

  return (
    <header className={cn('relative overflow-hidden pt-[var(--header-h)]', dark && 'on-dark bg-deep')}>
      {dark && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={reduce ? undefined : { y: fundoY }}
        >
          {/* Eco dos espelhos ovais do salão, só em contorno */}
          <span className="absolute -right-10 top-8 h-[26rem] w-48 rounded-full border border-primary/25 sm:right-[6%] md:h-[30rem] md:w-56" />
          <span className="absolute right-[18%] top-40 hidden h-[20rem] w-36 rounded-full border border-primary/15 md:block" />
        </motion.div>
      )}

      <div
        className={cn('container relative', compact ? 'pb-10 pt-8 md:pb-14 md:pt-12' : 'pb-12 pt-10 md:pb-20 md:pt-16')}
      >
        <nav aria-label="Você está em">
          <ol className={cn('flex items-center gap-1.5 text-sm', dark ? 'text-ivory/70' : 'text-muted-strong')}>
            <li>
              <Link
                to="/"
                className={cn(
                  'link-underline inline-flex min-h-[44px] min-w-[44px] items-center',
                  dark ? 'hover:text-ivory' : 'hover:text-ink',
                )}
              >
                Início
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} strokeWidth={1.5} />
            </li>
            <li>
              <span aria-current="page" className={dark ? 'text-ivory' : 'text-ink'}>
                {crumb}
              </span>
            </li>
          </ol>
        </nav>

        <div className={cn(image && 'lg:grid lg:grid-cols-12 lg:items-end lg:gap-10')}>
          <div className={cn(image && 'lg:col-span-8')}>
            <p className={cn(compact ? 'mt-6 md:mt-8' : 'mt-8 md:mt-12', dark ? 'eyebrow-light' : 'eyebrow')}>
              {eyebrow}
            </p>
            {comReveal ? (
              <RevealTitle
                lines={titleLines}
                label={titleLabel}
                className={cn('mt-4 max-w-4xl text-display-xl', dark && '!text-ivory')}
              />
            ) : (
              <motion.h1
                className={cn('mt-4 max-w-4xl text-display-xl', dark && '!text-ivory')}
                initial={{ opacity: 0 }}
                animate={{ opacity: pronto ? 1 : 0 }}
                transition={{ duration: 0.6, ease: easeSilk }}
              >
                {titleLines.map((linha, i) => (
                  <Fragment key={i}>
                    {i > 0 && ' '}
                    {linha}
                  </Fragment>
                ))}
              </motion.h1>
            )}
            {description && (
              <motion.p
                className={cn('mt-6 max-w-xl text-lg leading-relaxed', dark ? 'text-ivory/75' : 'text-muted-strong')}
                initial={{ opacity: 0, y: 12 }}
                animate={pronto ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeSilk }}
              >
                {description}
              </motion.p>
            )}
          </div>

          {image && (
            <figure className="hidden lg:col-span-4 lg:block">
              <motion.div
                variants={reduce ? fadeOnly : comAtraso(clipReveal, 0.25)}
                initial="hidden"
                animate={pronto ? 'show' : 'hidden'}
              >
                <MirrorFrame className="ml-auto aspect-[3/4] w-full max-w-[17rem]">
                  <Picture name={image.name} alt={image.alt} sizes="272px" className="block h-full w-full" />
                </MirrorFrame>
              </motion.div>
              {image.caption && (
                <figcaption className="mt-3 text-right text-sm text-muted-strong">{image.caption}</figcaption>
              )}
            </figure>
          )}
        </div>
      </div>
    </header>
  )
}
