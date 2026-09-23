import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { easeSilk, staggerContainer, staggerItem, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/cn'

type AccordionItem = { pergunta: string; resposta: string }

/**
 * Acordeão acessível (padrão WAI-ARIA): botão com aria-expanded + região rotulada.
 * Vários itens podem ficar abertos ao mesmo tempo. As perguntas entram em stagger ao aparecer na tela.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const baseId = useId()
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <motion.ul
      className="divide-y divide-line border-y border-line"
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {items.map((item, i) => {
        const isOpen = open.has(i)
        const btnId = `${baseId}-btn-${i}`
        const panelId = `${baseId}-panel-${i}`
        return (
          <motion.li key={item.pergunta} variants={staggerItem}>
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.25rem] leading-snug text-ink transition-colors duration-400 hover:text-primary-700 md:text-[1.375rem]"
              >
                {item.pergunta}
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/40 text-primary-700 transition-transform duration-500 ease-silk',
                    isOpen && 'rotate-45 border-primary-700',
                  )}
                >
                  <Plus size={18} strokeWidth={1.5} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: easeSilk }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pr-14 text-[1.0625rem] leading-relaxed text-charcoal-soft">
                    {item.resposta}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
