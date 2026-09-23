import { Suspense, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { easeSilk } from '@/lib/motion'

/**
 * Transição entre rotas (AnimatePresence mode="wait" no App):
 * a página que sai some subindo 10px; a nova entra descendo de 20px para 0. 0.4s cada.
 * Com "reduzir movimento" ativo, o MotionConfig do App remove o deslocamento e mantém só o fade.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: easeSilk }}
    >
      <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>{children}</Suspense>
    </motion.div>
  )
}
