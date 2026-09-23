import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { ImageName } from '@/data/images'
import { cn } from '@/lib/cn'
import { Picture } from './Picture'

type ParallaxImageProps = {
  name: ImageName
  alt: string
  /** Deslocamento máximo em px para cima e para baixo. Padrão 24 */
  strength?: number
  /** Classes da moldura (forma, tamanho). A moldura corta a imagem. */
  className?: string
  priority?: boolean
}

/**
 * Foto com parallax sutil DENTRO da moldura: a moldura acompanha a página,
 * a imagem se move um pouco mais devagar. A imagem é 16% maior que a moldura
 * para as bordas nunca aparecerem. Com "reduzir movimento": imagem parada.
 */
export function ParallaxImage({ name, alt, strength = 24, className, priority }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div className="absolute inset-[-8%]" style={reduce ? undefined : { y }}>
        <Picture name={name} alt={alt} priority={priority} className="block h-full w-full" />
      </motion.div>
    </div>
  )
}
