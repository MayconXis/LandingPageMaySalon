import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { site } from '@/config/site'
import { instagramPosts } from '@/data/instagram'
import { fadeOnly, lineReveal, viewportOnce } from '@/lib/motion'
import { InstagramIcon } from '../icons/BrandIcons'
import { MirrorFrame } from '../MirrorFrame'
import { ParallaxImage } from '../ParallaxImage'
import { Picture } from '../Picture'
import { Reveal } from '../Reveal'
import { ScrollReveal } from '../ScrollReveal'
import { Stagger, StaggerItem } from '../Stagger'

/**
 * Nossa História (split com fotos reais do salão) + grade de 6 posts do Instagram. Fundo ivory.
 * A foto grande destampa da esquerda para a direita e tem parallax sutil dentro do espelho;
 * a foto redonda entra logo depois. O texto não se move. A linha antes do Instagram "desenha".
 */
export function OurStory() {
  const reduce = useReducedMotion()
  return (
    <section aria-labelledby="historia-titulo" className="bg-ivory py-section">
      <div className="container grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Composição de fotos */}
        <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:col-span-5 lg:mx-0">
          <ScrollReveal variant="clipLeft">
            <MirrorFrame className="aspect-[3/4]">
              <ParallaxImage
                name="historia-salao"
                alt="Interior do May Salon com linhas de luz no teto, espelhos ovais com moldura dourada e cadeiras de atendimento"
                className="h-full w-full"
              />
            </MirrorFrame>
          </ScrollReveal>
          <ScrollReveal
            variant="scale"
            delay={0.5}
            className="absolute -bottom-6 -right-2 w-[44%] overflow-hidden rounded-full bg-ivory p-2 sm:-right-8"
          >
            <Picture
              name="historia-atendimento"
              alt="Especialista do May Salon finalizando o penteado de uma noiva"
              className="block aspect-square overflow-hidden rounded-full"
            />
          </ScrollReveal>
        </div>

        {/* Texto */}
        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Nossa história</p>
          <h2 id="historia-titulo" className="mt-4 text-display-lg">
            Beleza que vira <em className="font-accent italic text-primary-700">confiança.</em>
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-charcoal-soft">
            <p>
              Aqui, cada atendimento começa com escuta. Você conta como quer se sentir, e a gente cuida do resto.
            </p>
          </div>
          <Link
            to="/equipe"
            className="link-underline mt-8 inline-flex min-h-[44px] items-center gap-2 font-medium text-primary-700"
          >
            Conheça nossas especialistas
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>

      {/* Instagram */}
      <div className="container mt-section">
        <motion.div
          aria-hidden="true"
          className="h-px origin-left bg-line"
          variants={reduce ? fadeOnly : lineReveal}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        />
        <Reveal className="flex flex-col gap-4 pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">No Instagram</p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center font-accent text-accent-lg italic text-ink"
            >
              {site.instagram.handle}
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </div>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost self-start sm:self-auto"
          >
            <InstagramIcon size={18} />
            Seguir no Instagram
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </Reveal>

        <Stagger as="ul" stagger={0.08} className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {instagramPosts.map((post) => (
            <StaggerItem as="li" key={post.name}>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[4/5] overflow-hidden rounded-panel"
              >
                <Picture
                  name={post.name}
                  alt={post.alt}
                  className="block h-full w-full"
                  imgClassName="transition-transform duration-800 ease-silk group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center bg-deep/0 text-ivory opacity-0 transition-all duration-500 group-hover:bg-deep/35 group-hover:opacity-100 group-focus-visible:bg-deep/35 group-focus-visible:opacity-100"
                >
                  <ArrowUpRight size={22} strokeWidth={1.5} />
                </span>
                <span className="sr-only">Ver no Instagram (abre em nova aba)</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
