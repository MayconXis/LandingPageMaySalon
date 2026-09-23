import type { CSSProperties } from 'react'
import { imagePath, images, srcSetDe, type ImageName } from '@/data/images'
import { cn } from '@/lib/cn'

type PictureProps = {
  name: ImageName
  alt: string
  className?: string
  imgClassName?: string
  /** true para a imagem principal da página (carrega antes, sem lazy) */
  priority?: boolean
  /**
   * Largura em que a foto aparece, para o navegador escolher o arquivo certo (fotos HD).
   * Ex.: "(min-width: 1024px) 400px, 90vw". Padrão: "100vw".
   */
  sizes?: string
  style?: CSSProperties
}

/**
 * <picture> com WebP e fallback JPG, lazy por padrão e dimensões reais (sem CLS).
 * Fotos HD têm várias larguras (srcset): o celular baixa a menor, a tela retina a maior.
 */
export function Picture({ name, alt, className, imgClassName, priority, sizes = '100vw', style }: PictureProps) {
  const { w, h } = images[name]
  const webp = srcSetDe(name, 'webp')
  const jpg = srcSetDe(name, 'jpg')
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={webp ?? imagePath(name, 'webp')} sizes={webp ? sizes : undefined} />
      <img
        src={imagePath(name, 'jpg')}
        srcSet={jpg}
        sizes={jpg ? sizes : undefined}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-expect-error fetchpriority ainda não está nos tipos do React 18
        fetchpriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', imgClassName)}
        style={style}
      />
    </picture>
  )
}
