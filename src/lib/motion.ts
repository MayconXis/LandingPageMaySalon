import type { Transition, Variants } from 'framer-motion'

/**
 * Linguagem de movimento do May Salon.
 *
 * Regras (valem para o site inteiro):
 *  - Nada passa de 0.8s (exceção combinada: o contador da faixa de números, 1.8s).
 *  - Transform só sem "reduzir movimento". O <MotionConfig reducedMotion="user"> do App
 *    zera transforms das animações; parallax e cursor magnético checam useReducedMotion().
 *  - A animação-assinatura é o text reveal linha a linha, e ela só aparece nos títulos de hero.
 *    Todo o resto usa o stagger padrão abaixo.
 */

/** Curva padrão: rápida no início, pousa devagar. */
export const easeSilk = [0.22, 1, 0.36, 1] as const

export const silk = (duration = 0.6, delay = 0): Transition => ({ duration, delay, ease: easeSilk })

/** Mola dos hovers de card (serviço e equipe) */
export const springHover: Transition = { type: 'spring', stiffness: 300, damping: 20 }

/**
 * Gatilho padrão ao entrar na tela: uma vez, 80px depois da borda de cima/baixo.
 * Só na vertical ('-80px 0px'): com '-80px' nos quatro lados, algo colado na lateral da tela
 * (ex.: o número da faixa de prova social no celular) nunca contava como visível.
 */
export const viewportOnce = { once: true, margin: '-80px 0px' } as const

/* ── Stagger reveal ─────────────────────────────────────────── */

/** Container: não anima nada sozinho, só escalona os filhos */
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Item: fade + 32px de subida */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeSilk } },
}

/** Alias para blocos soltos (títulos de seção, parágrafos) */
export const fadeUp = staggerItem

/**
 * Stagger reveal por índice, para listas que também têm AnimatePresence (abas, filtros).
 * Aqui cada item cuida da própria entrada, porque um container com whileInView não anima
 * filhos que chegam depois dele ter disparado. O atraso para no 5º item: quem rola até
 * o fim da lista não fica esperando.
 * Uso: custom={index}, initial="hidden", whileInView="show", exit="exit".
 */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeSilk, delay: Math.min(i, 4) * 0.12 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
}

/**
 * Item de lista dinâmica (filtros): entra com atraso pelo índice e sai rápido.
 * Uso: custom={index}, initial="hidden", animate="show", exit="exit".
 */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeSilk, delay: i * 0.04 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
}

/* ── Text reveal (assinatura, só em heroes) ─────────────────── */

export const textRevealContainer = (delayChildren = 0.05): Variants => staggerContainer(0.1, delayChildren)

/** Cada linha sobe de baixo da própria "janela" (overflow hidden no pai) */
export const textRevealLine: Variants = {
  hidden: { y: '100%', opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: easeSilk } },
}

/* ── Fase 5: revelações cinematográficas ─────────────────────── */

/** Curva da cortina da abertura: acelera e freia forte */
export const easeCurtain = [0.76, 0, 0.24, 1] as const

/** Fallback de "reduzir movimento": só opacidade, sem deslocar, recortar ou desfocar */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeSilk } },
}

/**
 * Reveal com clip-path: a imagem "destampa" de baixo para cima.
 * Ao terminar, o recorte é removido (transitionEnd) para não cortar anéis de foco nem sombras.
 */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
    transitionEnd: { clipPath: 'none' },
  },
}

/** Reveal lateral: destampa da esquerda para a direita */
export const clipRevealLeft: Variants = {
  hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
    transitionEnd: { clipPath: 'none' },
  },
}

/** Scale suave: imagem começa 1.15x e encaixa em 1.0 */
export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 1.15 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Texto que aparece palavra por palavra */
export const wordRevealContainer = (stagger = 0.04): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
})

export const wordRevealItem: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Linha decorativa que "desenha" ao entrar na tela (use origin-left) */
export const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

/** A mesma linha, na vertical (divisórias entre colunas; use origin-top) */
export const lineRevealY: Variants = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Soma um atraso à transição de "show" de um conjunto de variants */
export function comAtraso(variants: Variants, delay: number): Variants {
  if (!delay) return variants
  const show = variants.show
  if (!show || typeof show === 'function') return variants
  return { ...variants, show: { ...show, transition: { ...show.transition, delay } } }
}

/**
 * Versões por índice (custom={i}) para listas que também têm AnimatePresence:
 * mesma entrada do clipReveal / scaleReveal, com o atraso parando no 5º item, e saída rápida.
 */
export const clipRevealItem: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: (i: number = 0) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.0, ease: easeSilk, delay: Math.min(i, 4) * 0.12 },
    transitionEnd: { clipPath: 'none' },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
}

export const scaleRevealItem: Variants = {
  hidden: { opacity: 0, scale: 1.15 },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: easeSilk, delay: Math.min(i, 4) * 0.12 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
}

/** Fallback por índice de "reduzir movimento" */
export const fadeOnlyItem: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({ opacity: 1, transition: { duration: 0.5, delay: Math.min(i, 4) * 0.06 } }),
  exit: { opacity: 0, transition: { duration: 0.1 } },
}
