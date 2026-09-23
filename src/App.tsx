import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PageTransition } from '@/components/PageTransition'
import { lazyWithPreload } from '@/lib/lazyWithPreload'
import { scrollToTop } from '@/lib/smoothScroll'
import { IntroContext, deveMostrarIntro, marcarIntroVista } from '@/lib/intro'
import { IntroAnimation } from '@/components/IntroAnimation'
import { ScrollProgress } from '@/components/ScrollProgress'
import { CustomCursor } from '@/components/CustomCursor'

const Home = lazyWithPreload(() => import('@/pages/Home'))
const Servicos = lazyWithPreload(() => import('@/pages/Servicos'))
const Galeria = lazyWithPreload(() => import('@/pages/Galeria'))
const Equipe = lazyWithPreload(() => import('@/pages/Equipe'))
const Agendamento = lazyWithPreload(() => import('@/pages/Agendamento'))
const Contato = lazyWithPreload(() => import('@/pages/Contato'))
const NotFound = lazyWithPreload(() => import('@/pages/NotFound'))

const allPages = [Home, Servicos, Galeria, Equipe, Agendamento, Contato, NotFound]

function AnimatedRoutes() {
  const location = useLocation()
  // Depois da primeira pintura, baixa as outras páginas em segundo plano
  useEffect(() => {
    const preload = () => allPages.forEach((page) => void page.preload())
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(preload, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Após a página antiga sair: volta ao topo e move o foco para o conteúdo (leitores de tela)
  const handleExitComplete = () => {
    scrollToTop()
    document.getElementById('conteudo')?.focus({ preventScroll: true })
  }

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/servicos" element={<PageTransition><Servicos /></PageTransition>} />
        <Route path="/galeria" element={<PageTransition><Galeria /></PageTransition>} />
        <Route path="/equipe" element={<PageTransition><Equipe /></PageTransition>} />
        <Route path="/agendamento" element={<PageTransition><Agendamento /></PageTransition>} />
        <Route path="/contato" element={<PageTransition><Contato /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  // Abertura: uma vez por sessão; nunca com "reduzir movimento" ou sem sessionStorage
  const [mostrarIntro, setMostrarIntro] = useState(deveMostrarIntro)
  const [introConcluida, setIntroConcluida] = useState(!mostrarIntro)
  const abrir = useCallback(() => setIntroConcluida(true), [])
  const encerrar = useCallback(() => setMostrarIntro(false), [])

  useEffect(() => {
    if (!mostrarIntro) marcarIntroVista()
  }, [mostrarIntro])

  return (
    // reducedMotion="user": respeita prefers-reduced-motion em TODAS as animações do Framer Motion
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introConcluida}>
        <Layout>
          <AnimatedRoutes />
        </Layout>
        <AnimatePresence>
          {mostrarIntro && <IntroAnimation key="intro" onAbrir={abrir} onFim={encerrar} />}
        </AnimatePresence>
        <ScrollProgress />
        <CustomCursor />
      </IntroContext.Provider>
    </MotionConfig>
  )
}
