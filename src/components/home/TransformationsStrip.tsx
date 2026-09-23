import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { transformacoes } from '@/data/transformacoes'
import { clipRevealLeft, fadeOnly, staggerContainer, viewportOnce } from '@/lib/motion'
import { BeforeAfterSlider } from '../BeforeAfterSlider'
import { SectionHeading } from '../SectionHeading'

/**
 * Faixa horizontal com 5 comparadores antes/depois. Fundo sand.
 * Cada card destampa da esquerda para a direita, um depois do outro.
 */
export function TransformationsStrip() {
  const trackRef = useRef<HTMLUListElement>(null)
  const reduce = useReducedMotion()

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current
    const card = track?.querySelector('li')
    if (!track || !card) return
    track.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: 'smooth' })
  }

  const temIlustrativo = transformacoes.some((t) => t.ilustrativo)

  return (
    <section aria-labelledby="transformacoes-titulo" className="overflow-hidden bg-sand py-section">
      <div className="container">
        <SectionHeading
          id="transformacoes-titulo"
          eyebrow="Antes e depois"
          title={
            <>
              Transformações que <em className="font-accent italic text-primary-700">falam por si.</em>
            </>
          }
          description={reduce ? 'Antes à esquerda, depois à direita.' : 'Arraste a alça sobre a foto para comparar.'}
          action={
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Ver transformação anterior"
                className="grid h-12 w-12 place-items-center rounded-full border border-primary/50 text-primary-700 transition-colors duration-400 hover:border-primary-700 hover:bg-primary-700 hover:text-ivory"
              >
                <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Ver próxima transformação"
                className="grid h-12 w-12 place-items-center rounded-full border border-primary/50 text-primary-700 transition-colors duration-400 hover:border-primary-700 hover:bg-primary-700 hover:text-ivory"
              >
                <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
              </button>
            </div>
          }
        />
      </div>

      {/* A faixa começa alinhada ao container e vaza para a direita */}
      <div className="mt-12 md:mt-16">
        <motion.ul
          ref={trackRef}
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[max(1.25rem,calc((100vw-1360px)/2+3rem))] pb-2 sm:px-[max(1.5rem,calc((100vw-1360px)/2+3rem))] lg:px-[max(2.5rem,calc((100vw-1360px)/2+3rem))] xl:px-[max(3rem,calc((100vw-1360px)/2+3rem))]"
          style={{ scrollPaddingInline: 'max(1.25rem, calc((100vw - 1360px) / 2 + 3rem))' }}
        >
          {transformacoes.map((t) => (
            <motion.li
              key={t.id}
              variants={reduce ? fadeOnly : clipRevealLeft}
              className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-[20rem]"
            >
              <BeforeAfterSlider
                antes={t.antes}
                depois={t.depois}
                ilustrativo={t.ilustrativo}
                label={t.titulo}
                descricao={t.descricao}
                className="aspect-[4/5]"
              />
              <div className="mt-4 flex items-start justify-between gap-3 px-1">
                <div>
                  <p className="text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-primary-700">
                    {t.servico}
                  </p>
                  <p className="mt-1 font-display text-xl text-ink">{t.titulo}</p>
                </div>
                {t.ilustrativo && (
                  <span className="mt-0.5 shrink-0 rounded-full border border-ink/20 px-2.5 py-1 text-xs text-charcoal-soft">
                    Imagem ilustrativa
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="container mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/galeria"
          className="link-underline inline-flex min-h-[44px] items-center gap-2 self-start font-medium text-primary-700"
        >
          Ver galeria completa
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </Link>
        {temIlustrativo && (
          <p className="text-sm text-charcoal-soft">
            Fotos de antes em preto e branco apenas para demonstração.
          </p>
        )}
      </div>
    </section>
  )
}
