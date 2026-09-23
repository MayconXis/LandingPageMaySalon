import { useCallback, useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Check, ChevronDown, Loader2 } from 'lucide-react'
import { categorias, servicos } from '@/data/servicos'
import { enviarContato, envioSimulado, type MensagemContato } from '@/lib/contato'
import { whatsappLink } from '@/lib/whatsapp'
import { easeSilk } from '@/lib/motion'
import { Magnetic } from '../Magnetic'

type Campo = keyof MensagemContato
type Controle = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
type Estado = 'editando' | 'enviando' | 'enviado' | 'falhou'

const VAZIO: MensagemContato = { nome: '', email: '', servico: '', mensagem: '' }
const MIN_MENSAGEM = 10

const FALTANDO: Partial<Record<Campo, string>> = {
  nome: 'Informe seu nome.',
  email: 'Informe seu e-mail para podermos responder.',
  mensagem: 'Escreva sua mensagem.',
}

const ehControle = (el: Element): el is Controle =>
  el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement

/**
 * Mensagem em português a partir da validação nativa do HTML5 (required, type="email", minLength).
 * Espaços em branco não contam como preenchido.
 */
function erroDoCampo(el: Controle): string {
  const campo = el.name as Campo
  if (el.required && el.value.trim() === '') return FALTANDO[campo] ?? 'Preencha este campo.'
  const v = el.validity
  if (v.valid) return ''
  if (v.typeMismatch) return 'Confira o e-mail. Exemplo: nome@email.com'
  if (v.tooShort) return `Conte um pouco mais: pelo menos ${MIN_MENSAGEM} caracteres.`
  return 'Confira este campo.'
}

/**
 * Formulário de contato.
 * Validação: atributos HTML5 + mensagens próprias (borda sage no foco, blush no erro, texto explicando).
 * Envio: lib/contato.ts (simulado em 1.2s enquanto VITE_CONTACT_ENDPOINT não estiver configurado).
 * Sucesso aparece no lugar do formulário, sem trocar de página.
 */
export function ContatoForm() {
  const uid = useId()
  const idDe = (c: Campo) => `${uid}-${c}`
  const erroId = (c: Campo) => `${uid}-${c}-erro`

  const [valores, setValores] = useState<MensagemContato>(VAZIO)
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({})
  const [estado, setEstado] = useState<Estado>('editando')

  const focarNome = useRef(false)
  const enviando = estado === 'enviando'

  // Foco no momento em que cada bloco entra na página (refs de callback, estáveis):
  // a mensagem de sucesso recebe o foco (leitores de tela a anunciam) e, ao reiniciar, o foco volta ao Nome.
  const focarSucesso = useCallback((el: HTMLDivElement | null) => el?.focus(), [])
  const refNome = useCallback((el: HTMLInputElement | null) => {
    if (el && focarNome.current) {
      focarNome.current = false
      el.focus()
    }
  }, [])

  const onChange = (e: ChangeEvent<Controle>) => {
    const campo = e.target.name as Campo
    const valor = e.target.value
    setValores((v) => ({ ...v, [campo]: valor }))
    // Erro já à vista? Some assim que o campo fica certo.
    if (erros[campo]) {
      const msg = erroDoCampo(e.target)
      setErros((er) => ({ ...er, [campo]: msg }))
    }
  }

  // Ao sair do campo, só aponta erro do que foi digitado (campo vazio é cobrado ao enviar)
  const onBlur = (e: FocusEvent<Controle>) => {
    if (!e.target.value.trim()) return
    const campo = e.target.name as Campo
    const msg = erroDoCampo(e.target)
    setErros((er) => ({ ...er, [campo]: msg }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return

    const controles = Array.from(e.currentTarget.elements).filter(ehControle).filter((el) => el.name)
    const novos: Partial<Record<Campo, string>> = {}
    for (const el of controles) {
      const msg = erroDoCampo(el)
      if (msg) novos[el.name as Campo] = msg
    }
    setErros(novos)

    const primeiroInvalido = controles.find((el) => novos[el.name as Campo])
    if (primeiroInvalido) {
      primeiroInvalido.focus()
      return
    }

    setEstado('enviando')
    try {
      await enviarContato(valores)
      setEstado('enviado')
    } catch {
      setEstado('falhou')
    }
  }

  const reiniciar = () => {
    setValores(VAZIO)
    setErros({})
    focarNome.current = true
    setEstado('editando')
  }

  /** Atributos de acessibilidade de cada campo (erro ligado ao campo por aria-describedby) */
  const aria = (c: Campo) => ({
    'aria-invalid': erros[c] ? true : undefined,
    'aria-describedby': erros[c] ? erroId(c) : undefined,
  })

  const mensagemErro = (campo: Campo) =>
    erros[campo] ? (
      <p id={erroId(campo)} className="mt-2 flex items-start gap-1.5 text-sm text-ink">
        <AlertCircle aria-hidden="true" size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
        {erros[campo]}
      </p>
    ) : null

  return (
    <div className="relative rounded-panel bg-sand p-6 sm:p-8 lg:p-10">
      <AnimatePresence mode="popLayout" initial={false}>
        {estado === 'enviado' ? (
          <motion.div
            key="sucesso"
            ref={focarSucesso}
            tabIndex={-1}
            role="status"
            className="flex flex-col items-center rounded-panel bg-ivory px-6 py-12 text-center outline-none sm:py-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeSilk }}
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-700 text-ivory">
              <Check aria-hidden="true" size={24} strokeWidth={2} />
            </span>
            <p className="mt-6 font-display text-2xl leading-snug text-ink">Mensagem enviada! Retornaremos em breve.</p>
            <p className="mt-3 max-w-sm text-charcoal-soft">
              Obrigada por escrever{valores.nome.trim() ? `, ${valores.nome.trim().split(/\s+/)[0]}` : ''}. Se for
              urgente, chame a gente no WhatsApp.
            </p>
            <button type="button" onClick={reiniciar} className="btn btn-ghost mt-8">
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            aria-labelledby="mensagem-titulo"
            aria-busy={enviando}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easeSilk }}
          >
            <h2 id="mensagem-titulo" className="text-display-md">
              Mande uma mensagem
            </h2>
            <p className="mt-2 text-charcoal-soft">Dúvidas, orçamentos ou sugestões. A gente responde em breve.</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={idDe('nome')} className="text-sm font-medium text-ink">
                  Nome
                </label>
                <input
                  ref={refNome}
                  id={idDe('nome')}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  value={valores.nome}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="field"
                  {...aria('nome')}
                />
                {mensagemErro('nome')}
              </div>

              <div>
                <label htmlFor={idDe('email')} className="text-sm font-medium text-ink">
                  E-mail
                </label>
                <input
                  id={idDe('email')}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={valores.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="field"
                  {...aria('email')}
                />
                {mensagemErro('email')}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={idDe('servico')} className="text-sm font-medium text-ink">
                  Serviço <span className="font-normal text-charcoal-soft">(opcional)</span>
                </label>
                <div className="relative mt-2">
                  <select
                    id={idDe('servico')}
                    name="servico"
                    value={valores.servico}
                    onChange={onChange}
                    className="field !mt-0 cursor-pointer appearance-none pr-12"
                  >
                    <option value="">Ainda não sei</option>
                    {categorias.map((c) => (
                      <optgroup key={c.id} label={c.label}>
                        {servicos
                          .filter((s) => s.categoria === c.id)
                          .map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.nome}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                    <option value="outro">Outro assunto</option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-primary-700"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={idDe('mensagem')} className="text-sm font-medium text-ink">
                  Mensagem
                </label>
                <textarea
                  id={idDe('mensagem')}
                  name="mensagem"
                  rows={5}
                  required
                  minLength={MIN_MENSAGEM}
                  maxLength={1500}
                  value={valores.mensagem}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="field resize-y"
                  {...aria('mensagem')}
                />
                {mensagemErro('mensagem')}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Magnetic disabled={enviando}>
                <button type="submit" aria-disabled={enviando || undefined} className="btn btn-primary btn-lg">
                  {enviando ? (
                    <>
                      <Loader2 aria-hidden="true" size={18} strokeWidth={1.75} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar mensagem'
                  )}
                </button>
              </Magnetic>
              <a
                href={whatsappLink('Olá, May Salon! Vim pelo site e queria tirar uma dúvida.')}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block self-start py-2.5 text-[0.9375rem] font-medium leading-6 text-primary-700 sm:self-auto"
              >
                {/* Texto primary-700 com sublinhado gold (gold como texto no claro não passa no contraste) */}
                <span className="underline decoration-gold decoration-2 underline-offset-[6px] transition-colors duration-400 group-hover:decoration-primary-700">
                  Ou nos chame diretamente pelo WhatsApp
                </span>
                <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} className="ml-1.5 inline-block align-[-3px]" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>

            {/* Status do envio para leitores de tela; a falha também aparece na tela */}
            <p className="sr-only" aria-live="polite">
              {enviando ? 'Enviando sua mensagem.' : ''}
            </p>
            {estado === 'falhou' && (
              <p role="alert" className="mt-5 flex items-start gap-2 rounded-2xl bg-ivory px-4 py-3 text-sm text-ink">
                <AlertCircle aria-hidden="true" size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                Não foi possível enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.
              </p>
            )}
            {envioSimulado && import.meta.env.DEV && (
              <p className="mt-5 text-xs text-charcoal-soft">
                Modo de demonstração: sem VITE_CONTACT_ENDPOINT, o envio é simulado (veja o README).
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
