import { motion } from 'framer-motion'
import { whatsappLink } from '@/lib/whatsapp'
import { easeSilk } from '@/lib/motion'
import { WhatsAppIcon } from './icons/BrandIcons'

/**
 * Botão flutuante do WhatsApp, visível em todas as páginas.
 * No mobile ele sobe para ficar acima da barra de navegação inferior (nunca a cobre).
 *
 * Cor: fundo primary-600 (#526754, sage escuro) com ícone branco = 6.1:1.
 * O anel pulsante usa o sage da marca com transparência.
 */
export function WhatsAppButton() {
  return (
    <motion.div
      className="fixed right-4 z-fab bottom-[calc(var(--bottom-nav-h)+var(--safe-bottom)+1rem)] md:bottom-6 md:right-6 lg:bottom-8 lg:right-8"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      // Entra logo depois do hero: é o atalho de contato mais usado, não pode demorar
      transition={{ duration: 0.6, delay: 0.5, ease: easeSilk }}
    >
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp (abre em nova aba)"
        className="fab group relative grid h-14 w-14 place-items-center rounded-full bg-primary-600 text-white shadow-lift transition-transform duration-400 ease-silk hover:scale-105 active:scale-95"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-pulse-ring"
        />
        <WhatsAppIcon size={27} className="relative" />

        <span role="tooltip" className="fab-tooltip">
          Fale conosco!
        </span>
      </a>
    </motion.div>
  )
}
