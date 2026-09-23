import Lenis from 'lenis'
import { cancelFrame, frame, type FrameData } from 'framer-motion'

/**
 * Scroll suave (Lenis) integrado ao loop de quadros do Framer Motion.
 *
 * - Um único requestAnimationFrame para os dois: o Lenis anda no mesmo `frame.update`
 *   que o Framer usa, então useScroll/useTransform (parallax) leem sempre o valor certo.
 * - Com "reduzir movimento" o Lenis nem é criado (e é destruído se a preferência mudar
 *   com a página aberta): o scroll volta a ser o nativo do sistema.
 * - Scroll de toque continua nativo (syncTouch desligado): no celular, o gesto do sistema
 *   é mais fluido e economiza bateria.
 */

let lenis: Lenis | null = null

function onFrame({ timestamp }: FrameData) {
  lenis?.raf(timestamp)
}

function start() {
  if (lenis) return
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    // rolagem dentro de elementos que rolam sozinhos (faixa horizontal, textarea) continua nativa
    allowNestedScroll: true,
    // clicou em um link interno durante a inércia? para a inércia na hora
    stopInertiaOnNavigate: true,
  })
  frame.update(onFrame, true)
}

function stop() {
  cancelFrame(onFrame)
  lenis?.destroy()
  lenis = null
}

export function initSmoothScroll(): void {
  if (typeof window === 'undefined') return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (!reduce.matches) start()
  reduce.addEventListener('change', (e) => (e.matches ? stop() : start()))
}

/** Instância atual (null com "reduzir movimento") */
export const getLenis = () => lenis

/** Volta ao topo sem animação (troca de rota) */
export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
}

/** Leva um elemento ao topo da área visível, descontando o header fixo */
export function scrollToElement(el: HTMLElement): void {
  const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 4
  const offset = -(header * 16 + 16)
  if (lenis) lenis.scrollTo(el, { offset, duration: 0.6 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'instant' as ScrollBehavior })
}

/** Pausa o scroll suave enquanto um modal (menu, lightbox) está aberto */
export function setSmoothScrollPaused(paused: boolean): void {
  if (!lenis) return
  if (paused) lenis.stop()
  else lenis.start()
}
