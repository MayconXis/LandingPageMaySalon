import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { initSmoothScroll } from './lib/smoothScroll'
import 'lenis/dist/lenis.css'
import './styles/globals.css'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root não encontrado no index.html')

// Scroll suave (desligado automaticamente com "reduzir movimento")
initSmoothScroll()

createRoot(root).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter
        basename={import.meta.env.BASE_URL}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
