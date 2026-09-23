import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ZoomIn } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { FilterPills } from '@/components/FilterPills'
import { Lightbox } from '@/components/Lightbox'
import { Picture } from '@/components/Picture'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'
import { Stagger, StaggerItem } from '@/components/Stagger'
import { SectionHeading } from '@/components/SectionHeading'
import { filtrosGaleria, fotosGaleria, transformacoesGaleria, type FiltroGaleria, type FotoGaleria } from '@/data/galeria'
import { transformacoes } from '@/data/transformacoes'
import { ehIlustrativa, images } from '@/data/images'
import { useFilterParam } from '@/hooks/useFilterParam'
import { useColumnCount } from '@/hooks/useColumnCount'
import { seo } from '@/config/seo'
import { clipRevealItem, fadeOnlyItem, listItem, viewportOnce } from '@/lib/motion'

const idsFiltro = filtrosGaleria.map((f) => f.id)

/** Distribui as fotos na coluna mais baixa, para o masonry ficar equilibrado. */
function distribuir(fotos: FotoGaleria[], colunas: number): FotoGaleria[][] {
  const cols: FotoGaleria[][] = Array.from({ length: colunas }, () => [])
  const alturas = new Array<number>(colunas).fill(0)
  for (const foto of fotos) {
    const { w, h } = images[foto.imagem]
    const menor = alturas.indexOf(Math.min(...alturas))
    cols[menor]?.push(foto)
    alturas[menor] = (alturas[menor] ?? 0) + h / w
  }
  return cols
}

export default function Galeria() {
  const [filtro, setFiltro] = useFilterParam<FiltroGaleria>('tipo', idsFiltro, 'todos')
  const [aberta, setAberta] = useState<number | null>(null)
  const colunas = useColumnCount()
  const reduce = useReducedMotion()

  // Primeira visita: cada foto destampa de baixo para cima ao entrar na tela (clip-path, em sequência).
  // Com "reduzir movimento", só fade.
  // Ao trocar o filtro: as que saem somem em 100ms e as novas entram 40ms uma depois da outra.
  const trocouFiltro = useRef(false)
  const mudarFiltro = (novo: FiltroGaleria) => {
    if (novo !== filtro) trocouFiltro.current = true
    setFiltro(novo)
  }

  const visiveis = useMemo(
    () =>
      filtro === 'todos' || filtro === 'antes-depois'
        ? fotosGaleria
        : fotosGaleria.filter((f) => f.tags.includes(filtro)),
    [filtro],
  )
  const grade = useMemo(() => distribuir(visiveis, colunas), [visiveis, colunas])
  const labelFiltro = filtrosGaleria.find((f) => f.id === filtro)?.label ?? ''
  const soAntesDepois = filtro === 'antes-depois'
  const temIlustrativa = visiveis.some((f) => ehIlustrativa(f.imagem))

  return (
    <>
      <Seo {...seo.galeria} path="/galeria" />
      <PageHeader
        tone="dark"
        crumb="Galeria"
        eyebrow="Galeria"
        titleLines={['Cada resultado conta', <em className="font-accent italic text-primary-200">uma história.</em>]}
        titleLabel="Cada resultado conta uma história."
        description="Uma seleção do nosso trabalho."
      />

      {/* Filtros fixos logo abaixo do header ao rolar */}
      <div className="sticky top-[var(--header-h)] z-30 border-b border-line/70 bg-ivory/[0.92] backdrop-blur-md">
        <div className="container">
          <FilterPills
            opcoes={filtrosGaleria}
            valor={filtro}
            onChange={mudarFiltro}
            label="Filtrar fotos"
            controls="galeria-conteudo"
            layoutId="galeria-filtro"
          />
        </div>
      </div>

      <div id="galeria-conteudo" className="container pt-10 md:pt-14">
        <p className="sr-only" aria-live="polite">
          {soAntesDepois
            ? `Mostrando ${transformacoesGaleria.length} comparações de antes e depois`
            : `${visiveis.length} ${visiveis.length === 1 ? 'foto' : 'fotos'} em ${labelFiltro}`}
        </p>

        {soAntesDepois ? (
          <AntesDepois />
        ) : visiveis.length === 0 ? (
          <div className="rounded-panel bg-sand px-6 py-14 text-center">
            <p className="font-display text-2xl text-ink">Ainda não temos fotos nesta categoria.</p>
            <button type="button" onClick={() => mudarFiltro('todos')} className="btn btn-ghost mt-6">
              Ver todas as fotos
            </button>
          </div>
        ) : (
          // items-start: cada coluna tem a altura das próprias fotos (nada de coluna esticada)
          <div className="flex items-start gap-5 lg:gap-7">
            {grade.map((coluna, c) => (
              <ul key={c} className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-7">
                <AnimatePresence mode="popLayout">
                  {coluna.map((foto) => {
                    const { w, h } = images[foto.imagem]
                    const indice = visiveis.indexOf(foto)
                    return (
                      <motion.li
                        key={foto.id}
                        layout
                        custom={indice}
                        variants={trocouFiltro.current ? listItem : reduce ? fadeOnlyItem : clipRevealItem}
                        initial="hidden"
                        whileInView="show"
                        exit="exit"
                        viewport={viewportOnce}
                      >
                        <figure>
                          <button
                            type="button"
                            onClick={() => setAberta(indice)}
                            aria-label={`Ampliar foto: ${foto.legenda}`}
                            data-cursor="zoom"
                            className="group relative block w-full overflow-hidden rounded-full"
                            style={{ aspectRatio: `${w} / ${h}` }}
                          >
                            <Picture
                              name={foto.imagem}
                              alt={foto.alt}
                              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 92vw"
                              className="absolute inset-0 block h-full w-full"
                              imgClassName="transition-transform duration-800 ease-silk group-hover:scale-[1.04]"
                            />
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 grid place-items-center bg-deep/0 text-ivory opacity-0 transition-all duration-500 group-focus-visible:bg-deep/70 group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:bg-deep/70 [@media(hover:hover)]:group-hover:opacity-100"
                            >
                              <span className="grid h-14 w-14 place-items-center rounded-full border border-ivory/50">
                                <ZoomIn size={22} strokeWidth={1.5} />
                              </span>
                            </span>
                          </button>
                          <figcaption className="mt-3 text-center font-accent text-lg italic text-charcoal-soft">
                            {foto.legenda}
                            {ehIlustrativa(foto.imagem) && (
                              <span className="ml-2 inline-block rounded-full border border-ink/20 px-2 py-0.5 align-middle font-sans text-xs not-italic text-charcoal-soft">
                                Ilustrativa
                              </span>
                            )}
                          </figcaption>
                        </figure>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            ))}
          </div>
        )}

        {!soAntesDepois && temIlustrativa && (
          <p className="mt-8 text-sm text-charcoal-soft">
            Fotos com o selo “Ilustrativa” são de banco de imagens, só para referência. As demais vêm do nosso
            Instagram.
          </p>
        )}
      </div>

      {/* Antes & Depois como seção própria (quando o filtro não é ele mesmo) */}
      {!soAntesDepois && (
        <div className="container mt-section">
          <AntesDepois />
        </div>
      )}

      <Lightbox
        items={visiveis.map((f) => ({
          imagem: f.imagem,
          alt: f.alt,
          legenda: ehIlustrativa(f.imagem) ? `${f.legenda} (imagem ilustrativa)` : f.legenda,
        }))}
        index={aberta}
        onClose={() => setAberta(null)}
        onIndexChange={setAberta}
      />
    </>
  )
}

/** Três comparadores lado a lado (empilhados no celular), com o recorte de espelho. */
function AntesDepois() {
  const reduce = useReducedMotion()
  const lista = transformacoesGaleria
    .map((id) => transformacoes.find((t) => t.id === id))
    .filter((t): t is (typeof transformacoes)[number] => Boolean(t))
  const temIlustrativo = lista.some((t) => t.ilustrativo)

  return (
    <section aria-labelledby="antes-depois-titulo">
      <SectionHeading
        id="antes-depois-titulo"
        eyebrow="Antes & Depois"
        title={
          <>
            Transformações <em className="font-accent italic text-primary-700">lado a lado.</em>
          </>
        }
        description={
          reduce
            ? 'Antes à esquerda, depois à direita.'
            : 'Arraste a alça ou use as setas do teclado para comparar.'
        }
        action={
          <Link
            to="/agendamento"
            className="link-underline inline-flex min-h-[44px] items-center gap-2 font-medium text-primary-700"
          >
            Quero esse resultado
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
        }
      />

      <Stagger as="ul" className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-8">
        {lista.map((t) => (
          <StaggerItem as="li" variant="clipLeft" key={t.id}>
            <BeforeAfterSlider
              shape="capsule"
              antes={t.antes}
              depois={t.depois}
              label={t.titulo}
              descricao={t.descricao}
              ilustrativo={t.ilustrativo}
              className="mx-auto aspect-[4/5] w-full max-w-[22rem]"
            />
            <div className="mx-auto mt-5 flex max-w-[22rem] items-start justify-between gap-3 px-2">
              <div>
                <p className="text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-primary-700">{t.servico}</p>
                <p className="mt-1 font-display text-xl text-ink">{t.titulo}</p>
              </div>
              {t.ilustrativo && (
                <span className="mt-0.5 shrink-0 rounded-full border border-ink/20 px-2.5 py-1 text-xs text-charcoal-soft">
                  Imagem ilustrativa
                </span>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {temIlustrativo && (
        <p className="mt-8 text-sm text-charcoal-soft">
          Fotos de antes em preto e branco apenas para demonstração, até recebermos os registros reais.
        </p>
      )}
    </section>
  )
}
