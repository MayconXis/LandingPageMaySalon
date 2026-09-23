import { Helmet } from 'react-helmet-async'
import { site } from '@/config/site'

type OgImage = { path: string; width: number; height: number; alt: string }

type SeoProps = {
  /** Título completo da aba, ex.: "Serviços · May Salon Inhumas" */
  title: string
  description: string
  /** Caminho da rota, ex.: "/servicos". Gera canonical e og:url. */
  path: string
  /** Imagem de compartilhamento. Padrão: site.ogImage (1200×630) */
  image?: OgImage
  /** Dados estruturados (schema.org) em JSON-LD */
  jsonLd?: Record<string, unknown>
  /** Páginas que não devem aparecer no Google (ex.: 404) */
  noindex?: boolean
}

/**
 * SEO por página: title, description, canonical, Open Graph, Twitter e JSON-LD.
 *
 * Importante: WhatsApp, Instagram e Facebook NÃO executam JavaScript ao gerar a prévia
 * de um link. Eles leem as tags fixas do index.html (valores da Home). Estas aqui valem
 * para o Google (que executa JS) e para a aba do navegador. O index.html marca as tags
 * fixas com data-rh="true" para o Helmet substituí-las em vez de duplicar.
 */
export function Seo({ title, description, path, image = site.ogImage, jsonLd, noindex }: SeoProps) {
  const url = new URL(path, site.url).toString()
  const imageUrl = new URL(image.path, site.url).toString()

  return (
    <Helmet prioritizeSeoTags>
      <html lang="pt-BR" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(image.width)} />
      <meta property="og:image:height" content={String(image.height)} />
      <meta property="og:image:alt" content={image.alt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={image.alt} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
