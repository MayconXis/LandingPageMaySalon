import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { site } from '@/config/site'
import { imagePath, images, srcSetDe, type ImageName } from '@/data/images'
import { clipReveal, comAtraso, easeSilk, fadeOnly } from '@/lib/motion'
import { useIntroConcluida } from '@/lib/intro'
import { Magnetic } from '../Magnetic'
import { MirrorFrame } from '../MirrorFrame'
import { ParallaxSection } from '../ParallaxSection'
import { TextRevealWords } from '../TextRevealWords'

/** Fotos que se alternam no espelho do hero (HD, ilustrativas) */
const FOTOS: { name: ImageName; alt: string }[] = [
  { name: 'hd-hero-ondas', alt: 'Cabelo longo castanho com mechas caramelo e ondas soltas, visto de costas' },
  { name: 'hd-hero-cachos', alt: 'Mulher de cabelo crespo volumoso, sobre fundo rosado' },
  { name: 'hd-hero-loira', alt: 'Mulher sorrindo, com cabelo loiro iluminado e ondulado' },
]
const INTERVALO_MS = 5500
const TAMANHOS = '(min-width: 1024px) 400px, (min-width: 640px) 352px, 78vw'

/**
 * Hero em split: texto à esquerda, "espelho" com fotos à direita.
 * - Título: palavra por palavra, esperando a abertura (intro) terminar.
 * - Espelho: destampa de baixo para cima (clip-path) e alterna 3 fotos HD em crossfade.
 * - Parallax: o fundo (gradiente + contornos dos espelhos) anda devagar e a foto sobe
 *   um pouco ao rolar. Nada de parallax no texto.
 * - "Reduzir movimento": sem recorte, sem troca de fotos, sem parallax; só fade.
 */
export function HomeHero() {
  const reduce = useReducedMotion()
  const pronto = useIntroConcluida()
  const { scrollY } = useScroll()
  const fotoY = useTransform(scrollY, [0, 500], [0, -60])

  const [ativa, setAtiva] = useState(0)
  useEffect(() => {
    if (reduce || !pronto) return
    const id = window.setInterval(() => setAtiva((i) => (i + 1) % FOTOS.length), INTERVALO_MS)
    return () => window.clearInterval(id)
  }, [reduce, pronto])

  const estado = pronto ? 'show' : 'hidden'

  return (
    <ParallaxSection
      aria-labelledby="hero-titulo"
      speed={0.15}
      bgColor="bg-deep"
      className="on-dark pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-20 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:pb-16 lg:pt-[calc(var(--header-h)+2rem)]"
      background={
        <>
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgb(var(--primary)/0.22),transparent_60%)]" />
          <span className="absolute -left-16 top-[18%] hidden h-[34rem] w-60 rounded-full border border-primary/15 lg:block" />
          <span className="absolute right-[36%] top-[58%] hidden h-[18rem] w-32 rounded-full border border-primary/10 lg:block" />
          <span className="absolute -right-20 -top-10 h-[24rem] w-44 rounded-full border border-primary/15 lg:hidden" />
        </>
      }
    >
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Texto */}
        <div className="lg:col-span-7">
          <motion.p
            className="eyebrow-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: pronto ? 1 : 0 }}
            transition={{ duration: 0.6, ease: easeSilk }}
          >
            Salão de beleza em Inhumas, Goiás
          </motion.p>

          <TextRevealWords
            as="h1"
            id="hero-titulo"
            text={'Sua beleza,\nnossa arte.'}
            trigger="mount"
            delay={0.1}
            stagger={0.08}
            accentWords={2}
            accentClassName="font-accent italic text-gold"
            className="mt-6 text-display-2xl !text-ivory"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={pronto ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.45, ease: easeSilk }}
          >
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ivory/75">
              Começamos ouvindo como você quer se sentir, do corte do dia a dia ao grande dia.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Magnetic>
                <Link to="/agendamento" className="btn btn-primary btn-lg">
                  Agendar Agora
                </Link>
              </Magnetic>
              <Link
                to="/servicos"
                className="link-underline inline-flex min-h-[44px] items-center text-base font-medium text-ivory"
              >
                Ver Serviços
              </Link>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ivory/10 pt-6 text-sm text-ivory/70">
              <li className="flex items-center gap-2">
                <Clock aria-hidden="true" size={16} strokeWidth={1.5} className="text-primary-300" />
                {site.hours.short}
              </li>
              <li className="flex items-center gap-2">
                <MapPin aria-hidden="true" size={16} strokeWidth={1.5} className="text-primary-300" />
                {site.address.city}, {site.address.state}
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Espelho com fotos (parallax na camada da foto, não no texto) */}
        <motion.figure
          className="mx-auto w-[min(78vw,20rem)] sm:w-[22rem] lg:col-span-5 lg:mx-0 lg:ml-auto lg:w-full lg:max-w-[25rem]"
          style={reduce ? undefined : { y: fotoY }}
        >
          <motion.div
            variants={reduce ? fadeOnly : comAtraso(clipReveal, 0.2)}
            initial="hidden"
            animate={estado}
          >
            <MirrorFrame rim="gold" className="aspect-[4/5] lg:aspect-[2/3]">
              {FOTOS.map((foto, i) => {
                const { w, h } = images[foto.name]
                const visivel = i === ativa
                return (
                  <motion.picture
                    key={foto.name}
                    aria-hidden={visivel ? undefined : true}
                    className="absolute inset-0 block"
                    initial={false}
                    animate={{ opacity: visivel ? 1 : 0, scale: visivel || reduce ? 1 : 1.04 }}
                    transition={{ duration: 1.4, ease: easeSilk }}
                  >
                    <source type="image/webp" srcSet={srcSetDe(foto.name, 'webp')} sizes={TAMANHOS} />
                    <img
                      src={imagePath(foto.name, 'jpg', 960)}
                      srcSet={srcSetDe(foto.name, 'jpg')}
                      sizes={TAMANHOS}
                      alt={visivel ? `${foto.alt} (imagem ilustrativa)` : ''}
                      width={w}
                      height={h}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      // @ts-expect-error fetchpriority ainda não está nos tipos do React 18
                      fetchpriority={i === 0 ? 'high' : 'low'}
                      className="h-full w-full object-cover"
                    />
                  </motion.picture>
                )
              })}
            </MirrorFrame>
          </motion.div>
          <motion.figcaption
            className="mt-4 text-center font-accent text-base italic text-ivory/70 lg:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: pronto ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: easeSilk }}
          >
            Imagens ilustrativas.
          </motion.figcaption>
        </motion.figure>
      </div>
    </ParallaxSection>
  )
}
