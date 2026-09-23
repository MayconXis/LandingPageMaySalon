import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { TeamCard } from '@/components/TeamCard'
import { Stagger, StaggerItem } from '@/components/Stagger'
import { MirrorFrame } from '@/components/MirrorFrame'
import { ParallaxImage } from '@/components/ParallaxImage'
import { Reveal } from '@/components/Reveal'
import { ParallaxSection } from '@/components/ParallaxSection'
import { HorizontalMarquee } from '@/components/HorizontalMarquee'
import { TextRevealWords } from '@/components/TextRevealWords'
import { MOCK_DATA, primeiroNome, team } from '@/data/mockData'
import { seo } from '@/config/seo'
import { clipReveal, fadeOnly, viewportOnce } from '@/lib/motion'
import { useIntroConcluida } from '@/lib/intro'

export default function Equipe() {
  // A dona é a primeira da lista da equipe (o nome vem dos dados, não do texto)
  const fundadora = team[0]
  const dona = fundadora ? primeiroNome(fundadora) : 'May'

  return (
    <>
      <Seo {...seo.equipe} path="/equipe" />
      <PageHeader
        tone="dark"
        crumb="Equipe"
        eyebrow="Nossa equipe"
        titleLines={['Conheça quem vai', <em className="font-accent italic text-primary-200">cuidar de você.</em>]}
        titleLabel="Conheça quem vai cuidar de você."
        description="Especialistas que tratam cada cliente como única."
      />

      <FaixaSalao />

      {/* Nomes da equipe correndo entre a foto e os cards (decorativo) */}
      <HorizontalMarquee items={team.map((m) => m.name)} speed={30} className="mt-12 md:mt-16" />

      {/* Especialistas */}
      <section aria-labelledby="especialistas-titulo" className="container max-w-5xl pt-12 md:pt-16">
        <h2 id="especialistas-titulo" className="sr-only">
          Especialistas
        </h2>
        <p className="text-[0.9375rem] text-charcoal-soft">
          <span className="[@media(hover:hover)]:hidden">Toque em um card para ver a bio e os serviços de cada uma.</span>
          <span className="hidden [@media(hover:hover)]:inline">
            Passe o mouse sobre um card para ver a bio e os serviços de cada uma.
          </span>
        </p>

        <Stagger as="ul" className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
          {team.map((m) => (
            <StaggerItem as="li" key={m.id}>
              <TeamCard member={m} />
            </StaggerItem>
          ))}
        </Stagger>

        {MOCK_DATA && (
          <p className="mt-8 text-sm text-charcoal-soft">
            Perfis ilustrativos. Em breve, as fotos e as histórias reais da nossa equipe.
          </p>
        )}
      </section>

      {/* Nossa história (fundo ivory: o rodapé já "repousa" sobre o ivory com a curva dele) */}
      <section aria-labelledby="historia-equipe-titulo" className="pt-section">
        <div className="container grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Nossa história</p>
            <TextRevealWords
              as="h2"
              id="historia-equipe-titulo"
              text={`Um salão com o jeito da ${dona}.`}
              accentWords={3}
              accentClassName="font-accent italic text-primary-700"
              delay={0.15}
              className="mt-4 text-display-lg"
            />
            {/* TODO(cliente): texto provisório, validar a história com a proprietária */}
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-charcoal-soft">
              <p>
                O May Salon nasceu da paixão da {dona} pela cor e da vontade de cuidar de cada cliente com tempo e
                atenção de verdade. A ideia sempre foi simples: um lugar em Inhumas onde você é ouvida antes da
                primeira mecha.
              </p>
              <p>
                A equipe cresceu, mas o jeito de trabalhar continua o mesmo: explicar cada etapa, respeitar o seu
                tempo e só terminar quando você se reconhecer no espelho.
              </p>
            </div>
            <Link to="/galeria" className="btn btn-ghost-sage mt-8">
              Conheça nosso trabalho
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
          </Reveal>

          {/* Foto à direita no desktop (na Home, a história tem a foto à esquerda) */}
          <Reveal
            delay={0.1}
            className="mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:mx-0 lg:ml-auto"
          >
            <MirrorFrame className="aspect-[3/4]">
              <ParallaxImage
                name="galeria-noiva-penteado"
                alt="Especialista do May Salon finalizando o penteado semipreso de uma noiva de vestido branco"
                className="h-full w-full"
              />
            </MirrorFrame>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/**
 * Foto larga do salão logo abaixo do título: destampa de baixo para cima (clip-path) quando aparece
 * (esperando a abertura do site, se for a primeira página) e o fundo anda devagar ao rolar.
 * Foto de banco de imagens, marcada como ilustrativa.
 */
function FaixaSalao() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: viewportOnce.margin })
  const pronto = useIntroConcluida()
  const reduce = useReducedMotion()

  return (
    <div className="container pt-12 md:pt-16">
      <motion.div
        ref={ref}
        className="relative"
        variants={reduce ? fadeOnly : clipReveal}
        initial="hidden"
        animate={inView && pronto ? 'show' : 'hidden'}
      >
        <ParallaxSection
          as="div"
          speed={0.15}
          className="h-[15rem] rounded-panel sm:h-[20rem] lg:h-[26rem]"
          backgroundImage={{
            name: 'hd-salao',
            alt: 'Salão de beleza moderno com espelhos redondos iluminados, cadeiras pretas e parede de tijolos',
            sizes: '(min-width: 1360px) 1264px, 94vw',
          }}
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-deep/70 px-3 py-1 text-xs text-ivory backdrop-blur-sm sm:bottom-5 sm:left-5">
          Imagem ilustrativa
        </span>
      </motion.div>
    </div>
  )
}
