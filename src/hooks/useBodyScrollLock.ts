import { useEffect } from 'react'
import { setSmoothScrollPaused } from '@/lib/smoothScroll'

/**
 * Trava o scroll do body enquanto `locked` for true (ex.: drawer aberto).
 * Compensa a largura da barra de rolagem para o layout não "pular" no desktop.
 * Também pausa o scroll suave (Lenis), que não respeita overflow do body sozinho.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    setSmoothScrollPaused(true)

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      setSmoothScrollPaused(false)
    }
  }, [locked])
}
