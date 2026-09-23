import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { ImageName } from '@/data/images'
import { cn } from '@/lib/cn'
import { Picture } from './Picture'

type ParallaxSectionProps = {
  children?: ReactNode
  /** 0.1 a 0.5: quanto o fundo se desloca (speed × 100px para cada lado) */
  speed?: number
  /** Foto de fundo (cobre a seção) */
  backgroundImage?: { name: ImageName; alt: string; sizes?: string }
  /** Fundo desenhado (camadas, gradientes, contornos) */
  background?: ReactNode
  /** Classe de cor de fundo, ex.: "bg-deep" */
  bgColor?: string
  className?: string
  as?: 'section' | 'div'
  'aria-labelledby'?: string
}

/**
 * Seção cujo fundo anda em outra velocidade que a página (parallax com mola).
 * Só o fundo se move; o conteúdo fica parado. Com "reduzir movimento": tudo parado.
 */
export function ParallaxSection({
  children,
  speed = 0.2,
  backgroundImage,
  background,
  bgColor,
  className,
  as = 'section',
  ...rest
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-speed * 100, speed * 100])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const folga = `${-speed * 100}px`
  const Tag = as

  return (
    <Tag ref={ref as never} className={cn('relative overflow-hidden', bgColor, className)} {...rest}>
      <motion.div
        aria-hidden={backgroundImage ? undefined : true}
        className="pointer-events-none absolute inset-x-0"
        style={{ top: folga, bottom: folga, ...(reduce ? {} : { y: smoothY }) }}
      >
        {backgroundImage && (
          <Picture
            name={backgroundImage.name}
            alt={backgroundImage.alt}
            sizes={backgroundImage.sizes ?? '100vw'}
            className="block h-full w-full"
          />
        )}
        {background}
      </motion.div>
      {children && <div className="relative">{children}</div>}
    </Tag>
  )
}
