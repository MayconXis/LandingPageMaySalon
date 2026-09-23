import { motion, useReducedMotion } from 'framer-motion'
import { stats } from '@/data/stats'
import { cn } from '@/lib/cn'
import { fadeOnly, lineReveal, lineRevealY, viewportOnce } from '@/lib/motion'
import { AnimatedCounter } from '../AnimatedCounter'
import { Stagger, StaggerItem } from '../Stagger'

/**
 * Onde cada número tem divisória, conforme a grade:
 * 1 coluna no celular (linha em cima), 2×2 no tablet, 4 lado a lado no desktop (linha à esquerda).
 * As divisórias são linhas que "desenham" quando o número aparece.
 */
const linhaTopo = (i: number) => cn(i === 0 ? 'hidden' : 'block', i < 2 ? 'sm:hidden' : 'sm:block', 'lg:hidden')
const linhaLado = (i: number) => cn('hidden', i % 2 === 1 && 'sm:block', i > 0 ? 'lg:block' : 'lg:hidden')
const espacamento = (i: number) => cn(i % 2 === 1 ? 'sm:pl-8' : 'sm:pr-8', 'lg:pr-8', i > 0 ? 'lg:pl-8' : 'lg:pl-0')

/**
 * Faixa de prova social, colada ao hero (mesmo bg-deep, separada por uma linha fina).
 * Os números entram em stagger e contam de 0 até o valor, um pouco depois do anterior.
 */
export function ProofBar() {
  const reduce = useReducedMotion()
  return (
    <section aria-label="O May Salon em números" className="on-dark bg-deep">
      <div className="container">
        <motion.div
          aria-hidden="true"
          className="h-px origin-left bg-ivory/10"
          variants={reduce ? fadeOnly : lineReveal}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        />
        <Stagger as="ul" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StaggerItem
              as="li"
              key={s.label}
              className={cn('relative flex items-baseline gap-4 py-7 sm:flex-col sm:gap-2 sm:py-10 lg:py-12', espacamento(i))}
            >
              <motion.span
                aria-hidden="true"
                className={cn('absolute inset-x-0 top-0 h-px origin-left bg-ivory/10', linhaTopo(i))}
                variants={reduce ? fadeOnly : lineReveal}
              />
              <motion.span
                aria-hidden="true"
                className={cn('absolute inset-y-0 left-0 w-px origin-top bg-ivory/10', linhaLado(i))}
                variants={reduce ? fadeOnly : lineRevealY}
              />
              <AnimatedCounter
                value={s.value}
                decimals={s.decimals}
                prefix={s.prefix}
                suffix={s.suffix}
                delay={i * 0.15}
                className="shrink-0 font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] leading-none text-gold"
              />
              <span className="text-[0.9375rem] leading-snug text-ivory/75">{s.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
