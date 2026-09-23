import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Filtro guardado na URL (?param=valor), para permitir link direto e botão "voltar".
 * O valor padrão não aparece na URL: /galeria em vez de /galeria?tipo=todos.
 */
export function useFilterParam<T extends string>(param: string, validos: readonly T[], padrao: T) {
  const [params, setParams] = useSearchParams()
  const bruto = params.get(param)
  const valor = (validos as readonly string[]).includes(bruto ?? '') ? (bruto as T) : padrao

  const setValor = useCallback(
    (novo: T) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (novo === padrao) next.delete(param)
          else next.set(param, novo)
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [param, padrao, setParams],
  )

  return [valor, setValor] as const
}
