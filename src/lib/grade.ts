import { cn } from './cn'

/**
 * Colunas de uma grade de cards sem card "órfão" (um card sozinho numa linha,
 * embaixo de uma linha com 2 ou mais). Base: 1 coluna no celular, 2 no tablet, 3 no desktop.
 * - 4 cards: 2 × 2 no tablet e 4 lado a lado no desktop.
 * - Se ainda sobrar um último card sozinho, ele ocupa a linha inteira
 *   (tablet com total ímpar; desktop com 7, 10…).
 * Os filhos precisam ser os itens diretos da grade (ex.: <li> do <ul>).
 */
export function gradeSemOrfao(total: number): string {
  if (total === 4) return 'sm:grid-cols-2 lg:grid-cols-4'
  const sobraNoTablet = total > 1 && total % 2 === 1
  const sobraNoDesktop = total > 3 && total % 3 === 1
  return cn(
    'sm:grid-cols-2 lg:grid-cols-3',
    sobraNoTablet && 'sm:[&>*:last-child]:col-span-2',
    sobraNoDesktop ? 'lg:[&>*:last-child]:col-span-3' : sobraNoTablet && 'lg:[&>*:last-child]:col-span-1',
  )
}
