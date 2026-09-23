import { useEffect, useState } from 'react'

/** Colunas da galeria: 1 no celular, 2 a partir de 640px, 3 a partir de 1024px. */
export function useColumnCount(): number {
  const get = () => {
    if (typeof window === 'undefined') return 3
    if (window.matchMedia('(min-width: 1024px)').matches) return 3
    if (window.matchMedia('(min-width: 640px)').matches) return 2
    return 1
  }
  const [cols, setCols] = useState(get)

  useEffect(() => {
    const queries = ['(min-width: 640px)', '(min-width: 1024px)'].map((q) => window.matchMedia(q))
    const update = () => setCols(get())
    queries.forEach((mq) => mq.addEventListener('change', update))
    return () => queries.forEach((mq) => mq.removeEventListener('change', update))
  }, [])

  return cols
}
