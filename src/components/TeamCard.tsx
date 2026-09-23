import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { instagramDaEspecialista, primeiroNome, servicosDaEspecialista, type TeamMember } from '@/data/mockData'
import { springHover } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { InstagramIcon } from './icons/BrandIcons'
import { MirrorFrame } from './MirrorFrame'

/**
 * Card da equipe com duas faces (CSS 3D).
 *  - Frente (ivory): foto oval, especialidade, nome e Instagram.
 *  - Verso (sand): bio, serviços e "Agendar com [Nome]".
 *
 * Como vira: com mouse, ao passar por cima; no toque, tocando no card ou no botão +;
 * no teclado, pelo botão + (aria-expanded). A face escondida fica `inert`: sai da ordem
 * de Tab e da leitura de tela. Com "reduzir movimento", a troca é instantânea, sem giro.
 */
export function TeamCard({ member }: { member: TeamMember }) {
  const id = useId()
  const nomeId = `${id}-nome`
  const versoId = `${id}-verso`
  const [virado, setVirado] = useState(false)
  const frenteRef = useRef<HTMLDivElement>(null)
  const versoRef = useRef<HTMLDivElement>(null)
  const ultimoPonteiro = useRef<string>('mouse')
  const reduce = useReducedMotion()

  const nome = primeiroNome(member)
  const insta = instagramDaEspecialista(member)
  const servicosDela = servicosDaEspecialista(member)

  useEffect(() => {
    if (frenteRef.current) frenteRef.current.inert = virado
    if (versoRef.current) versoRef.current.inert = !virado
  }, [virado])

  // Toque em qualquer parte do card (fora de links e botões) também vira
  const onCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (ultimoPonteiro.current === 'mouse') return
    if ((e.target as HTMLElement).closest('a, button')) return
    setVirado((v) => !v)
  }

  return (
    // O hover é detectado neste wrapper parado e o card (dentro) é que sobe:
    // assim o cursor na borda de baixo não faz o card "quicar" entre hover e não hover.
    <motion.div
      className="h-full"
      whileHover={reduce ? undefined : 'hover'}
      onPointerDown={(e) => (ultimoPonteiro.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setVirado(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setVirado(false)}
    >
      <motion.article
        aria-labelledby={nomeId}
        className="flip-card relative h-full"
        variants={{ hover: { y: -8, scale: 1.02 } }}
        transition={springHover}
      >
        <button
          type="button"
          aria-expanded={virado}
          aria-controls={versoId}
          onClick={() => setVirado((v) => !v)}
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-primary/50 bg-ivory text-primary-700 transition-colors duration-400 [@media(hover:hover)]:hover:border-primary-700 [@media(hover:hover)]:hover:bg-primary-700 [@media(hover:hover)]:hover:text-ivory"
        >
          <span className="sr-only">Ver bio e serviços de {member.name}</span>
          <Plus
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className={cn('transition-transform duration-500 ease-silk', virado && 'rotate-45')}
          />
        </button>

        <div className={cn('flip-inner', virado && 'is-flipped')} onClick={onCardClick}>
          {/* Frente */}
          <div
            ref={frenteRef}
            aria-hidden={virado}
            className="flip-face flip-front flex flex-col items-center justify-center rounded-panel border border-primary/70 bg-ivory px-6 pb-9 pt-12 text-center sm:px-8"
          >
            <MirrorFrame className="h-56 w-44">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                // TODO(cliente): foto da especialista. Enquanto não chega, monograma no espelho oval.
                <span aria-hidden="true" className="grid h-full w-full place-items-center bg-gradient-to-b from-sand to-sand/40">
                  <span className="font-accent text-7xl italic text-primary-700">{member.name.charAt(0)}</span>
                </span>
              )}
            </MirrorFrame>

            <p className="eyebrow mt-8">{member.role}</p>
            <h3 id={nomeId} className="mt-3 text-[1.75rem] leading-tight">
              {member.name}
            </h3>

            <a
              href={insta.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${insta.label} (abre em nova aba)`}
              className="mt-6 grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors duration-400 hover:border-primary hover:text-primary-700"
            >
              <InstagramIcon size={20} />
            </a>
          </div>

          {/* Verso */}
          <div
            ref={versoRef}
            id={versoId}
            aria-hidden={!virado}
            className="flip-face flip-back flex flex-col rounded-panel border border-primary/70 bg-sand px-6 pb-7 pt-7 sm:px-8"
          >
            <p className="eyebrow pr-14">{member.role}</p>
            <p className="mt-2 pr-14 font-display text-2xl leading-tight text-ink">{member.name}</p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-charcoal-soft">{member.bio}</p>

            <p className="mt-6 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-primary-700">Serviços</p>
            <ul className="mt-3 space-y-2">
              {servicosDela.map((s) => {
                const Icon = s.icon
                return (
                  <li key={s.slug} className="flex items-center gap-3 text-[0.9375rem] text-ink">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivory/70 text-primary-700">
                      <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
                    </span>
                    {s.nome}
                  </li>
                )
              })}
            </ul>

            <div className="mt-auto pt-7">
              <Link to={`/agendamento?especialista=${member.id}`} className="btn btn-primary w-full sm:w-auto">
                Agendar com {nome}
                <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
