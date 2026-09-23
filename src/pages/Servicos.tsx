import { useMemo, useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { ServiceCard } from '@/components/ServiceCard'
import { SectionHeading } from '@/components/SectionHeading'
import { Accordion } from '@/components/Accordion'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { categorias, servicos, type Categoria } from '@/data/servicos'
import { faq } from '@/data/faq'
import { fotosServicos } from '@/data/fotosServicos'
import { seo } from '@/config/seo'
import { whatsappLink } from '@/lib/whatsapp'
import { easeSilk, fadeOnly, fadeOnlyItem, lineReveal, listItem, scaleRevealItem, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { gradeSemOrfao } from '@/lib/grade'

const isCategoria = (v: string | null): v is Categoria => categorias.some((c) => c.id === v)

export default function Servicos() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('categoria')
  const ativa: Categoria = isCategoria(raw) ? raw : 'cabelo'
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reduce = useReducedMotion()
  // Primeira visita: cards encaixam de 1.15 para 1 em sequência. Depois de trocar de aba: entrada rápida (40ms por card).
  const trocouAba = useRef(false)

  const lista = useMemo(() => servicos.filter((s) => s.categoria === ativa), [ativa])
  const labelAtiva = categorias.find((c) => c.id === ativa)?.label ?? ''

  const select = (id: Categoria) => {
    if (id !== ativa) trocouAba.current = true
    setParams({ categoria: id }, { replace: true, preventScrollReset: true })
  }

  // Setas movem entre as abas (padrão WAI-ARIA de tabs com ativação automática)
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = categorias.length - 1
    const to =
      e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (to === null) return
    e.preventDefault()
    const cat = categorias[to]
    if (!cat) return
    select(cat.id)
    tabRefs.current[to]?.focus()
  }

  return (
    <>
      <Seo {...seo.servicos} path="/servicos" />
      <PageHeader
        crumb="Serviços"
        eyebrow="Nossos rituais"
        titleLines={[
          'Cada serviço,',
          <>
            <em className="font-accent italic text-primary-700">um cuidado</em> pensado em você.
          </>,
        ]}
        titleLabel="Cada serviço, um cuidado pensado em você."
        description="Do corte à cor, do olhar à maquiagem. Escolha o que você quer viver hoje."
        image={{
          name: 'hd-servicos-cor',
          alt: 'Mulher de perfil jogando para trás o cabelo tingido de rosa',
          caption: 'Imagem ilustrativa',
        }}
      />

      {/* Abas fixas logo abaixo do header ao rolar */}
      <div className="sticky top-[var(--header-h)] z-30 border-y border-line/70 bg-ivory/[0.92] backdrop-blur-md">
        <div className="container">
          <div
            role="tablist"
            aria-label="Categorias de serviço"
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-3"
          >
            {categorias.map((c, i) => {
              const selected = c.id === ativa
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`tab-${c.id}`}
                  type="button"
                  aria-selected={selected}
                  aria-controls="painel-servicos"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(c.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    'relative min-h-[44px] shrink-0 whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-400',
                    selected ? 'text-ivory' : 'text-ink hover:text-primary-700',
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="tab-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-primary-700"
                      transition={{ duration: 0.5, ease: easeSilk }}
                    />
                  )}
                  {!selected && <span aria-hidden="true" className="absolute inset-0 rounded-full border border-line" />}
                  <span className="relative">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <section
        id="painel-servicos"
        role="tabpanel"
        aria-labelledby={`tab-${ativa}`}
        className="container pt-10 md:pt-14"
      >
        <p className="sr-only" aria-live="polite">
          {lista.length} {lista.length === 1 ? 'serviço' : 'serviços'} em {labelAtiva}
        </p>
        <motion.ul layout className={cn('grid gap-4 lg:gap-5', gradeSemOrfao(lista.length))}>
          <AnimatePresence mode="popLayout">
            {lista.map((s, i) => (
              <motion.li
                key={s.slug}
                layout
                custom={i}
                variants={trocouAba.current ? listItem : reduce ? fadeOnlyItem : scaleRevealItem}
                initial="hidden"
                whileInView="show"
                exit="exit"
                viewport={viewportOnce}
              >
                <ServiceCard
                  slug={s.slug}
                  nome={s.nome}
                  assinatura={s.assinatura}
                  texto={s.descricao}
                  duracao={s.duracao}
                  precoDe={s.precoDe}
                  precoAte={s.precoAte}
                  orcamentoPersonalizado={s.orcamentoPersonalizado}
                  icon={s.icon}
                  imagem={fotosServicos[s.slug]}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <p className="mt-6 text-sm text-charcoal-soft">
          Durações aproximadas. O valor final depende do comprimento e do volume do cabelo e é
          confirmado antes do atendimento. Fotos ilustrativas.
        </p>
      </section>

      {/* Respiro entre os cards e as dúvidas: um fio gold que desenha do centro */}
      <motion.div
        aria-hidden="true"
        className="mx-auto mt-12 h-px w-24 origin-center bg-gold md:mt-14"
        variants={reduce ? fadeOnly : lineReveal}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      />

      <section aria-labelledby="faq-titulo" className="container mt-12 md:mt-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading
              id="faq-titulo"
              eyebrow="Dúvidas frequentes"
              titleWords={{
                text: 'Antes de você vir.',
                accentWords: 1,
                accentClassName: 'font-accent italic text-primary-700',
              }}
            />
            <div className="mt-8 rounded-panel bg-sand p-6">
              <p className="text-[0.9375rem] leading-relaxed text-charcoal-soft">
                Não encontrou sua dúvida? A gente responde rapidinho.
              </p>
              <a
                href={whatsappLink('Olá, May Salon! Tenho uma dúvida sobre os serviços.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-4"
              >
                <WhatsAppIcon size={17} />
                Perguntar no WhatsApp
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={faq} />
          </div>
        </div>
      </section>
    </>
  )
}
