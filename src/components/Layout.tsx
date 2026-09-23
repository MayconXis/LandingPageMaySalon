import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'
import { MobileBottomNav } from './MobileBottomNav'

/**
 * Estrutura global. O header é fixo e cada página cuida do próprio recuo:
 * o hero da Home fica por baixo do header; páginas internas usam <PageHeader>, que já desconta a altura.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100svh] flex-col pb-bottom-nav">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>

      <Header />

      <main
        id="conteudo"
        tabIndex={-1}
        className="flex-1 outline-none"
      >
        {children}
      </main>

      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  )
}
