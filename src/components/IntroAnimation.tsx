import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { easeCurtain, easeSilk } from '@/lib/motion'
import { marcarIntroVista } from '@/lib/intro'
import { Monograma } from './Monograma'

type Fase = 'espera' | 'entrada' | 'saida'

type IntroAnimationProps = {
  /** A cortina começou a abrir: os heroes podem animar */
  onAbrir: () => void
  /** A cortina terminou: pode desmontar */
  onFim: () => void
}

// Linha do tempo (ms, a partir do momento em que a fonte está pronta)
const INICIO_SAIDA = 1700
const SAIDA_CONTEUDO = 0.15
const DURACAO_CORTINA = 0.9

/**
 * Abertura editorial, uma vez por sessão (quem decide é o App, via deveMostrarIntro).
 *
 *  A · 0 → 0.8s    monograma entra (opacity 0 → 1, scale 0.85 → 1)
 *  B · 0.8 → 1.7s  linha gold desenha 0 → 80px, "May Salon" aparece e a marca respira um instante
 *  C · 1.7 → 2.75s o conteúdo some (0.15s) e o fundo se abre em duas metades,
 *                  a de cima sobe e a de baixo desce (0.9s, curva de cortina)
 *
 * Puramente decorativa (aria-hidden). O scroll fica travado enquanto ela está na tela.
 * Com "reduzir movimento" ela nem é montada.
 */
export function IntroAnimation({ onAbrir, onFim }: IntroAnimationProps) {
  const [fase, setFase] = useState<Fase>('espera')
  useBodyScrollLock(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    // A cortina já cobre a tela: o fundo verde de segurança do index.html não é mais necessário
    document.documentElement.classList.remove('intro-pendente')
    let vivo = true
    const timers: number[] = []

    // Espera a Cormorant (até 600ms) para o "MS" não trocar de fonte no meio da animação
    const fonte = document.fonts?.load("italic 36px 'Cormorant Garamond'") ?? Promise.resolve()
    const limite = new Promise((r) => window.setTimeout(r, 600))

    Promise.race([fonte, limite])
      .catch(() => undefined)
      .then(() => {
        if (!vivo) return
        setFase('entrada')
        timers.push(
          window.setTimeout(() => setFase('saida'), INICIO_SAIDA),
          window.setTimeout(onAbrir, INICIO_SAIDA + SAIDA_CONTEUDO * 1000),
          window.setTimeout(() => {
            marcarIntroVista()
            onFim()
          }, INICIO_SAIDA + (SAIDA_CONTEUDO + DURACAO_CORTINA) * 1000 + 50),
        )
      })

    return () => {
      vivo = false
      timers.forEach((t) => window.clearTimeout(t))
      marcarIntroVista()
    }
    // onAbrir/onFim vêm do App e não mudam: a linha do tempo roda uma vez
  }, [])

  const saindo = fase === 'saida'
  const cortina = { duration: DURACAO_CORTINA, ease: easeCurtain, delay: SAIDA_CONTEUDO }

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[9999] overflow-hidden">
      {/* As duas metades da cortina */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[50vh] bg-deep"
        initial={{ y: 0 }}
        animate={{ y: saindo ? '-100%' : 0 }}
        transition={cortina}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[50vh] bg-deep"
        initial={{ y: 0 }}
        animate={{ y: saindo ? '100%' : 0 }}
        transition={cortina}
      />

      {/* Marca */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={{ opacity: saindo ? 0 : 1 }}
        transition={{ duration: SAIDA_CONTEUDO }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={fase === 'espera' ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: easeSilk }}
        >
          <Monograma size={96} />
        </motion.div>

        <motion.span
          className="mt-6 block h-px bg-gold"
          initial={{ width: 0 }}
          animate={{ width: fase === 'espera' ? 0 : 80 }}
          transition={{ duration: 0.6, ease: easeSilk, delay: 0.8 }}
        />

        <motion.p
          className="mt-4 font-accent text-xl italic tracking-[4px] text-ivory"
          initial={{ opacity: 0, y: 8 }}
          animate={fase === 'espera' ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeSilk, delay: 1.1 }}
        >
          May Salon
        </motion.p>
      </motion.div>
    </div>
  )
}
