import { useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, Phone, Users } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { WizardProgress } from '@/components/WizardProgress'
import { Stagger, StaggerItem } from '@/components/Stagger'
import { Magnetic } from '@/components/Magnetic'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { categorias, getServico, precoServico, servicos, type Servico } from '@/data/servicos'
import { especialistasDoServico, getTeamMember, primeiroNome, type TeamMember } from '@/data/mockData'
import { seo } from '@/config/seo'
import { site } from '@/config/site'
import { mensagemAgendamento, whatsappLink } from '@/lib/whatsapp'
import { easeSilk } from '@/lib/motion'
import { scrollToElement } from '@/lib/smoothScroll'
import { cn } from '@/lib/cn'
import { gradeSemOrfao } from '@/lib/grade'

const ETAPAS = ['Serviço', 'Especialista', 'Confirmação'] as const
const SEM_PREFERENCIA = 'sem-preferencia'

const fazServico = (m: TeamMember, s: Servico) => m.specialties.includes(s.slug)

/**
 * Assistente de agendamento em 3 etapas, fechado pelo WhatsApp.
 *
 * URL: ?servico=<slug de servicos.ts> pré-seleciona o serviço (cards da Home e de /servicos);
 * ?especialista=<id da equipe> pré-seleciona a especialista (botão "Agendar com..." da Equipe)
 * e mostra primeiro só os serviços que ela faz.
 */
export default function Agendamento() {
  const [params, setParams] = useSearchParams()

  // Leitura única da URL ao abrir a página
  const [inicial] = useState(() => {
    const s = getServico(params.get('servico'))
    const m = getTeamMember(params.get('especialista'))
    return { servico: s, especialista: m && (!s || fazServico(m, s)) ? m : undefined }
  })

  const [etapa, setEtapa] = useState(0)
  const [direcao, setDirecao] = useState<1 | -1>(1)
  const [servicoSlug, setServicoSlug] = useState<string | null>(inicial.servico?.slug ?? null)
  const [especialistaId, setEspecialistaId] = useState<string | null>(inicial.especialista?.id ?? null)
  // Filtro da etapa 1 (quem veio da Equipe vê primeiro os serviços daquela especialista)
  const [filtroId, setFiltroId] = useState<string | null>(inicial.especialista?.id ?? null)
  const [verTodos, setVerTodos] = useState(false)
  const [aviso, setAviso] = useState('')
  const [observacao, setObservacao] = useState('')

  const topoRef = useRef<HTMLDivElement>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const focarTitulo = useRef(false)

  const servico = getServico(servicoSlug)
  const especialistas = useMemo(() => (servico ? especialistasDoServico(servico.slug) : []), [servico])
  const especialista = getTeamMember(especialistaId)
  const filtro = getTeamMember(filtroId)

  /** Mantém a URL em dia (link compartilhável e botão voltar do navegador) sem perder outros parâmetros */
  const atualizarUrl = (slug: string | null, espId: string | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (slug) next.set('servico', slug)
        else next.delete('servico')
        if (espId && espId !== SEM_PREFERENCIA) next.set('especialista', espId)
        else next.delete('especialista')
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  const escolherServico = (slug: string) => {
    const novo = getServico(slug)
    if (!novo) return
    setServicoSlug(slug)
    let espId = especialistaId
    // A especialista escolhida antes não faz este serviço? Limpa a escolha e avisa.
    if (especialista && !fazServico(especialista, novo)) {
      espId = null
      setEspecialistaId(null)
      setFiltroId(null)
      setAviso(
        `${primeiroNome(especialista)} não faz ${novo.assinatura}. Na próxima etapa, escolha quem vai te atender.`,
      )
    } else {
      setAviso('')
    }
    atualizarUrl(slug, espId)
  }

  const escolherEspecialista = (id: string) => {
    setEspecialistaId(id)
    if (filtroId && id !== filtroId) setFiltroId(null)
    atualizarUrl(servicoSlug, id)
  }

  // Ao trocar de etapa: volta ao topo do assistente e, quando a nova etapa terminar de entrar,
  // leva o foco ao título dela (leitores de tela anunciam a etapa nova)
  const irPara = (proxima: number) => {
    setDirecao(proxima > etapa ? 1 : -1)
    setEtapa(proxima)
    setAviso('')
    focarTitulo.current = true
    if (topoRef.current) scrollToElement(topoRef.current)
  }

  const podeContinuar = (etapa === 0 && !!servico) || (etapa === 1 && !!especialistaId)
  const dica =
    etapa === 0 ? 'Escolha um serviço para continuar.' : 'Escolha uma especialista ou "Sem preferência" para continuar.'

  const linkWhatsApp = servico
    ? whatsappLink(
        mensagemAgendamento({
          servico: servico.assinatura,
          servicoNome: servico.nome,
          especialista: especialista?.name ?? null,
          observacao,
        }),
      )
    : whatsappLink()

  const titulos = ['Qual serviço?', 'Com quem?', 'Tudo certo? Agora é só chamar a gente.']

  return (
    <>
      <Seo {...seo.agendamento} path="/agendamento" />
      <PageHeader
        tone="dark"
        crumb="Agendamento"
        eyebrow="Agendamento"
        titleLines={['Reserve seu', <em className="font-accent italic text-primary-200">momento.</em>]}
        titleLabel="Reserve seu momento."
        description="Escolha o serviço, a especialista e nos chame pelo WhatsApp."
      />

      <div ref={topoRef} className="container max-w-5xl pt-10 md:pt-14">
        <div className="mx-auto max-w-md">
          <WizardProgress etapas={ETAPAS} atual={etapa} />
        </div>

        <div className="mt-10 md:mt-14">
          <AnimatePresence mode="wait" initial={false} custom={direcao}>
            <motion.section
              key={etapa}
              aria-labelledby="etapa-titulo"
              custom={direcao}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: 24 * d }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: -24 * d }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: easeSilk }}
              onAnimationComplete={(def) => {
                if (def === 'center' && focarTitulo.current) {
                  focarTitulo.current = false
                  tituloRef.current?.focus({ preventScroll: true })
                }
              }}
            >
              <p className="eyebrow">
                Etapa {etapa + 1} de {ETAPAS.length}
              </p>
              <h2 id="etapa-titulo" ref={tituloRef} tabIndex={-1} className="mt-3 text-display-md outline-none">
                {titulos[etapa]}
              </h2>

              {etapa === 0 && (
                <EtapaServico
                  selecionado={servicoSlug}
                  onSelect={escolherServico}
                  filtro={filtro}
                  verTodos={verTodos}
                  onVerTodos={setVerTodos}
                />
              )}

              {etapa === 1 && servico && (
                <EtapaEspecialista
                  servico={servico}
                  especialistas={especialistas}
                  selecionado={especialistaId}
                  onSelect={escolherEspecialista}
                />
              )}

              {etapa === 2 && servico && (
                <EtapaConfirmacao
                  servico={servico}
                  especialista={especialista}
                  observacao={observacao}
                  onObservacao={setObservacao}
                  onEditar={irPara}
                />
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        {/* Navegação */}
        <div className="mt-10 border-t border-line pt-6">
          {etapa < 2 ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => irPara(etapa - 1)}
                className={cn('btn btn-ghost', etapa === 0 && 'invisible')}
                aria-hidden={etapa === 0 ? true : undefined}
                tabIndex={etapa === 0 ? -1 : undefined}
              >
                <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} />
                Voltar
              </button>
              <Magnetic disabled={!podeContinuar}>
                <button type="button" onClick={() => irPara(etapa + 1)} disabled={!podeContinuar} className="btn btn-primary">
                  Continuar
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </button>
              </Magnetic>
            </div>
          ) : (
            <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => irPara(1)} className="btn btn-ghost">
                <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} />
                Voltar
              </button>
              <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <WhatsAppIcon size={20} />
                Agendar pelo WhatsApp
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>
          )}
          <p className="mt-3 min-h-[1.5rem] text-right text-sm text-charcoal-soft" aria-live="polite">
            {aviso || (etapa < 2 && !podeContinuar ? dica : '')}
          </p>
        </div>

        {etapa === 2 && <ContatoSalao />}
      </div>
    </>
  )
}

/* ────────────────────────────────────────────
   Etapa 1 · Serviço
   ──────────────────────────────────────────── */

function EtapaServico({
  selecionado,
  onSelect,
  filtro,
  verTodos,
  onVerTodos,
}: {
  selecionado: string | null
  onSelect: (slug: string) => void
  /** Especialista que veio da página Equipe (mostra só os serviços dela até pedir "ver todos") */
  filtro: TeamMember | undefined
  verTodos: boolean
  onVerTodos: (v: boolean) => void
}) {
  const filtrando = !!filtro && !verTodos
  const lista = filtrando ? servicos.filter((s) => fazServico(filtro, s)) : servicos
  const grupos = categorias
    .map((c) => ({ ...c, itens: lista.filter((s) => s.categoria === c.id) }))
    .filter((g) => g.itens.length > 0)

  return (
    <fieldset className="mt-8">
      <legend className="sr-only">Escolha um serviço</legend>

      {filtro && (
        <div className="mb-8 flex flex-col gap-1 rounded-3xl bg-sand px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="pt-2 text-[0.9375rem] text-charcoal-soft sm:pt-0">
            {filtrando ? (
              <>
                Serviços com <strong className="font-medium text-ink">{filtro.name}</strong>
              </>
            ) : (
              <>
                Mostrando <strong className="font-medium text-ink">todos os serviços</strong>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={() => onVerTodos(filtrando)}
            className="link-underline inline-flex min-h-[44px] items-center self-start text-sm font-medium text-primary-700 sm:self-auto"
          >
            {filtrando ? 'Ver todos os serviços' : `Ver só os de ${primeiroNome(filtro)}`}
          </button>
        </div>
      )}

      {/* key: ao ligar/desligar o filtro, a lista entra de novo em stagger */}
      <div key={filtrando ? 'filtrado' : 'todos'} className="space-y-10">
        {grupos.map(({ id, label, itens }) => (
          <div key={id}>
            <p className="eyebrow" aria-hidden="true">
              {label}
            </p>
            <Stagger as="ul" stagger={0.06} className={cn('mt-4 grid gap-3', gradeSemOrfao(itens.length))}>
              {itens.map((s) => {
                const Icon = s.icon
                return (
                  <StaggerItem as="li" variant="scale" key={s.slug}>
                    <OpcaoCard
                      name="servico"
                      value={s.slug}
                      checked={selecionado === s.slug}
                      onChange={() => onSelect(s.slug)}
                      labelSr={`${s.assinatura}, ${s.nome}, ${s.duracao}, ${precoServico(s)}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary-700">
                          <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
                        </span>
                        {s.orcamentoPersonalizado && (
                          <span className="rounded-full bg-blush px-3 py-1 text-xs font-medium text-ink">Sob consulta</span>
                        )}
                      </div>
                      <p className="mt-4 font-display text-xl leading-tight text-ink">{s.assinatura}</p>
                      <p className="mt-1 text-sm text-charcoal-soft">{s.nome}</p>
                      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-charcoal-soft">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock aria-hidden="true" size={14} strokeWidth={1.5} className="text-primary-700" />
                          {s.duracao}
                        </span>
                        <span className="font-medium text-ink">{precoServico(s)}</span>
                      </p>
                    </OpcaoCard>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

/* ────────────────────────────────────────────
   Etapa 2 · Especialista
   ──────────────────────────────────────────── */

function EtapaEspecialista({
  servico,
  especialistas,
  selecionado,
  onSelect,
}: {
  servico: Servico
  especialistas: TeamMember[]
  selecionado: string | null
  onSelect: (id: string) => void
}) {
  return (
    <fieldset className="mt-8">
      <legend className="text-charcoal-soft">
        Especialistas em <strong className="font-medium text-ink">{servico.nome}</strong>:
      </legend>
      {/* +1: o card "Sem preferência" também entra na conta */}
      <Stagger as="ul" stagger={0.06} className={cn('mt-6 grid gap-3', gradeSemOrfao(especialistas.length + 1))}>
        {especialistas.map((t) => (
          <StaggerItem as="li" key={t.id}>
            <OpcaoCard
              name="especialista"
              value={t.id}
              checked={selecionado === t.id}
              onChange={() => onSelect(t.id)}
              labelSr={`${t.name}, ${t.role}, ${t.yearsExperience} anos de experiência`}
            >
              <div className="flex items-center gap-4">
                <AvatarOval nome={t.name} src={t.avatar} />
                <div className="min-w-0">
                  <p className="font-display text-xl leading-tight text-ink">{t.name}</p>
                  <p className="mt-1 text-sm text-charcoal-soft">{t.role}</p>
                  <p className="mt-2 text-sm text-charcoal-soft">{t.yearsExperience} anos de experiência</p>
                </div>
              </div>
            </OpcaoCard>
          </StaggerItem>
        ))}
        <StaggerItem as="li">
          <OpcaoCard
            name="especialista"
            value={SEM_PREFERENCIA}
            checked={selecionado === SEM_PREFERENCIA}
            onChange={() => onSelect(SEM_PREFERENCIA)}
            labelSr="Sem preferência: o salão indica a especialista com o melhor horário"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-[4.5rem] w-14 shrink-0 place-items-center rounded-full border border-dashed border-primary/60 text-primary-700">
                <Users aria-hidden="true" size={22} strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-display text-xl leading-tight text-ink">Sem preferência</p>
                <p className="mt-1 text-sm text-charcoal-soft">A gente indica quem tiver o melhor horário para você.</p>
              </div>
            </div>
          </OpcaoCard>
        </StaggerItem>
      </Stagger>
    </fieldset>
  )
}

/** Avatar no recorte de espelho oval. Sem foto: inicial sobre sage claro. */
function AvatarOval({ nome, src }: { nome: string; src: string }) {
  return (
    <span className="relative grid h-[4.5rem] w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/15 ring-1 ring-primary/40 ring-offset-2 ring-offset-ivory">
      {src ? (
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <span aria-hidden="true" className="font-display text-2xl text-primary-700">
          {nome.charAt(0)}
        </span>
      )}
    </span>
  )
}

/* ────────────────────────────────────────────
   Etapa 3 · Confirmação
   ──────────────────────────────────────────── */

function EtapaConfirmacao({
  servico,
  especialista,
  observacao,
  onObservacao,
  onEditar,
}: {
  servico: Servico
  especialista: TeamMember | undefined
  observacao: string
  onObservacao: (v: string) => void
  onEditar: (etapa: number) => void
}) {
  const LIMITE = 500
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="rounded-panel bg-sand p-6 sm:p-8">
        <p className="eyebrow">Resumo</p>
        <dl className="mt-5 divide-y divide-ink/10">
          <LinhaResumo rotulo="Serviço" onEditar={() => onEditar(0)} editarLabel="Alterar serviço">
            <span className="font-display text-xl text-ink">{servico.assinatura}</span>
            <span className="block text-sm text-charcoal-soft">
              {servico.nome} · {servico.duracao} · {precoServico(servico)}
            </span>
          </LinhaResumo>
          <LinhaResumo rotulo="Especialista" onEditar={() => onEditar(1)} editarLabel="Alterar especialista">
            <span className="font-display text-xl text-ink">{especialista?.name ?? 'Sem preferência'}</span>
            {especialista && <span className="block text-sm text-charcoal-soft">{especialista.role}</span>}
          </LinhaResumo>
          <LinhaResumo rotulo="Horário">
            <span className="text-ink">A combinar pelo WhatsApp</span>
          </LinhaResumo>
        </dl>
      </div>

      <div>
        <label htmlFor="observacao" className="font-display text-xl text-ink">
          Tem alguma preferência ou dúvida?
        </label>
        <p id="observacao-dica" className="mt-1 text-sm text-charcoal-soft">
          Opcional. Ex.: prefiro sábado de manhã, ou quero clarear sem perder o comprimento.
        </p>
        <textarea
          id="observacao"
          rows={4}
          maxLength={LIMITE}
          value={observacao}
          onChange={(e) => onObservacao(e.target.value)}
          aria-describedby="observacao-dica observacao-contador"
          className="mt-4 w-full resize-y rounded-panel border border-line bg-ivory px-5 py-4 text-base text-ink placeholder:text-muted-strong focus:border-primary-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          placeholder="Escreva aqui, se quiser"
        />
        <p id="observacao-contador" className="mt-2 text-right text-xs text-charcoal-soft">
          {observacao.length}/{LIMITE}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
          Ao tocar em <strong className="font-medium text-ink">Agendar pelo WhatsApp</strong>, abrimos a conversa com
          essas informações já escritas. Você só precisa enviar.
        </p>
      </div>
    </div>
  )
}

function LinhaResumo({
  rotulo,
  children,
  onEditar,
  editarLabel,
}: {
  rotulo: string
  children: ReactNode
  onEditar?: () => void
  editarLabel?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <dt className="text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-primary-700">{rotulo}</dt>
        <dd className="mt-1">{children}</dd>
      </div>
      {onEditar && (
        <button
          type="button"
          onClick={onEditar}
          aria-label={editarLabel}
          className="link-underline inline-flex min-h-[44px] shrink-0 items-center text-sm font-medium text-primary-700"
        >
          Alterar
        </button>
      )}
    </div>
  )
}

/** Endereço, horário e telefone (fonte: config/site.ts) */
function ContatoSalao() {
  return (
    <ul className="mt-8 grid gap-3 text-sm text-charcoal-soft sm:grid-cols-3">
      <li className="flex items-start gap-2">
        <MapPin aria-hidden="true" size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-primary-700" />
        <span>
          {site.address.confirmed && `${site.address.street}, `}
          {site.address.city}, {site.address.state}
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Clock aria-hidden="true" size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-primary-700" />
        <span>{site.hours.label}</span>
      </li>
      <li>
        <a href={site.phoneHref} className="inline-flex min-h-[44px] items-start gap-2 hover:text-ink sm:min-h-0">
          <Phone aria-hidden="true" size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-primary-700" />
          {site.phoneDisplay}
        </a>
      </li>
    </ul>
  )
}

/* ────────────────────────────────────────────
   Card de opção (radio nativo = setas do teclado funcionam dentro do grupo)
   ──────────────────────────────────────────── */

function OpcaoCard({
  name,
  value,
  checked,
  onChange,
  labelSr,
  children,
}: {
  name: string
  value: string
  checked: boolean
  onChange: () => void
  labelSr: string
  children: ReactNode
}) {
  return (
    <label className="relative block h-full cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        aria-label={labelSr}
        className="peer sr-only"
      />
      <span
        className={cn(
          'block h-full rounded-panel border-2 p-5 transition-[border-color,background-color,box-shadow] duration-400 ease-silk sm:p-6',
          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-700',
          checked ? 'border-gold bg-sand' : 'border-line bg-ivory hover:border-primary/60',
        )}
      >
        {children}
      </span>
      {/* Selo de selecionado: não depende só da cor da borda (sage escuro + ✓ ivory, 7.6:1) */}
      {checked && (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 grid h-7 w-7 place-items-center rounded-full bg-primary-700 text-ivory ring-4 ring-ivory"
        >
          <Check size={14} strokeWidth={2.5} />
        </span>
      )}
    </label>
  )
}
