import { createContext, useContext } from 'react'

/**
 * Abertura editorial (IntroAnimation): aparece uma vez por sessão.
 *
 * O contexto diz se a abertura já liberou a página. As animações que rodam ao montar
 * (títulos dos heroes) esperam por ele: assim elas acontecem quando a cortina abre,
 * e não escondidas atrás dela.
 */
export const CHAVE_INTRO = 'may_intro_seen'

export const IntroContext = createContext(true)

/** true quando não há abertura na tela (já vista, pulada ou terminada) */
export const useIntroConcluida = () => useContext(IntroContext)

const reduzMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Decide na primeira renderização se a abertura aparece (storage bloqueado = não aparece) */
export function deveMostrarIntro(): boolean {
  try {
    if (reduzMovimento()) {
      window.sessionStorage.setItem(CHAVE_INTRO, '1')
      return false
    }
    return window.sessionStorage.getItem(CHAVE_INTRO) !== '1'
  } catch {
    return false
  }
}

export function marcarIntroVista(): void {
  try {
    window.sessionStorage.setItem(CHAVE_INTRO, '1')
  } catch {
    /* navegação privada sem storage: a abertura só não é lembrada */
  }
  document.documentElement.classList.remove('intro-pendente')
}
