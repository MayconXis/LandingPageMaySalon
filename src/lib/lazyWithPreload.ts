import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

type Preloadable<T extends ComponentType<object>> = LazyExoticComponent<T> & {
  preload: () => Promise<{ default: T }>
}

/**
 * React.lazy com método preload(). Carregamos as páginas em segundo plano
 * depois da primeira pintura, então a troca de rota não mostra tela vazia.
 */
export function lazyWithPreload<T extends ComponentType<object>>(
  factory: () => Promise<{ default: T }>,
): Preloadable<T> {
  let promise: Promise<{ default: T }> | undefined
  const load = () => (promise ??= factory())
  const Component = lazy(load) as Preloadable<T>
  Component.preload = load
  return Component
}
