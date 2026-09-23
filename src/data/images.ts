/**
 * Imagens em /public/images, cada uma em .webp + .jpg.
 * Largura e altura reais evitam "pulo" de layout (CLS) enquanto carregam.
 *
 * Dois grupos:
 *  - fotos do Instagram do salão (reais, máx. 640px): um arquivo por formato;
 *  - fotos HD ilustrativas (Unsplash, prefixo "hd-"): `larguras` gera o srcset
 *    (hd-x-480.webp, hd-x-960.webp...) e `ilustrativa: true` faz o site avisar onde
 *    elas poderiam ser lidas como trabalho ou espaço do salão.
 *
 * TODO(cliente): trocar as fotos "hd-" pelas fotos reais do salão antes do lançamento
 * e pedir os originais em alta resolução das fotos do Instagram.
 */
type Imagem = { w: number; h: number; larguras?: readonly number[]; ilustrativa?: true }

export const images = {
  'hero-desktop': { w: 427, h: 640 },
  'hero-mobile': { w: 512, h: 640 },
  'servico-cor': { w: 360, h: 640 },
  'servico-olhar': { w: 360, h: 450 },
  'transformacao-mechas': { w: 512, h: 640 },
  'transformacao-iluminado': { w: 360, h: 450 },
  'transformacao-noiva-penteado': { w: 482, h: 602 },
  'transformacao-noiva-ondas': { w: 368, h: 460 },
  'transformacao-noiva-solto': { w: 256, h: 320 },
  'historia-salao': { w: 480, h: 640 },
  'historia-atendimento': { w: 482, h: 482 },
  'insta-1': { w: 512, h: 640 },
  'insta-2': { w: 512, h: 640 },
  'insta-3': { w: 512, h: 640 },
  'insta-4': { w: 512, h: 640 },
  'insta-5': { w: 482, h: 602 },
  'insta-6': { w: 512, h: 640 },
  'galeria-balayage': { w: 586, h: 640 },
  'galeria-iluminado': { w: 360, h: 640 },
  'galeria-olhar': { w: 360, h: 640 },
  'galeria-noiva-tiara': { w: 518, h: 455 },
  'galeria-noiva-penteado': { w: 482, h: 640 },
  'galeria-salao': { w: 480, h: 640 },
  'galeria-dia-cliente': { w: 512, h: 440 },
  'galeria-noiva-make': { w: 512, h: 350 },
  'galeria-liso': { w: 512, h: 240 },
  // Fotos HD ilustrativas (recortes feitos a partir de MaySalon/fotos_hd)
  'hd-hero-cachos': { w: 960, h: 1440, larguras: [480, 960], ilustrativa: true },
  'hd-hero-ondas': { w: 960, h: 1440, larguras: [480, 960], ilustrativa: true },
  'hd-hero-loira': { w: 960, h: 1440, larguras: [480, 960], ilustrativa: true },
  'hd-servicos-cor': { w: 960, h: 1440, larguras: [480, 960], ilustrativa: true },
  'hd-ondas': { w: 960, h: 1200, larguras: [480, 960], ilustrativa: true },
  'hd-escova': { w: 960, h: 1200, larguras: [480, 960], ilustrativa: true },
  'hd-escova-curto': { w: 960, h: 1200, larguras: [480, 960], ilustrativa: true },
  'hd-sobrancelha': { w: 960, h: 1200, larguras: [480, 960], ilustrativa: true },
  'hd-make': { w: 960, h: 1200, larguras: [480, 960], ilustrativa: true },
  'hd-noiva': { w: 960, h: 720, larguras: [480, 960], ilustrativa: true },
  'hd-lavatorio': { w: 960, h: 720, larguras: [480, 960], ilustrativa: true },
  'hd-olhar': { w: 960, h: 720, larguras: [480, 960], ilustrativa: true },
  'hd-sobrancelha-close': { w: 960, h: 720, larguras: [480, 960], ilustrativa: true },
  'hd-salao': { w: 1920, h: 840, larguras: [768, 1280, 1920], ilustrativa: true },
} as const satisfies Record<string, Imagem>

export type ImageName = keyof typeof images

const catalogo: Record<ImageName, Imagem> = images

/** Larguras disponíveis (fotos HD); vazio para as fotos de arquivo único */
export const largurasDe = (name: ImageName): readonly number[] => catalogo[name].larguras ?? []

/** A foto é ilustrativa (banco de imagens), não do salão */
export const ehIlustrativa = (name: ImageName): boolean => catalogo[name].ilustrativa === true

/**
 * Caminho público de uma imagem do catálogo (sem strings soltas nos componentes).
 * Fotos HD: sem largura, usa a maior.
 *
 * Prefixado com import.meta.env.BASE_URL (não só "/"): na Vercel isso é a raiz mesmo,
 * mas no GitHub Pages o site vive num subcaminho (/LandingPageMaySalon/) e uma foto
 * apontando direto pra "/images/..." ia dar 404 lá.
 */
function comBase(caminho: string): string {
  return `${import.meta.env.BASE_URL}${caminho}`
}

export function imagePath(name: ImageName, ext: 'webp' | 'jpg', largura?: number): string {
  const larguras = largurasDe(name)
  if (larguras.length === 0) return comBase(`images/${name}.${ext}`)
  const L = largura ?? larguras[larguras.length - 1]
  return comBase(`images/${name}-${L}.${ext}`)
}

/** srcset "a-480.webp 480w, a-960.webp 960w" (undefined para foto de arquivo único) */
export function srcSetDe(name: ImageName, ext: 'webp' | 'jpg'): string | undefined {
  const larguras = largurasDe(name)
  if (larguras.length === 0) return undefined
  return larguras.map((L) => `${imagePath(name, ext, L)} ${L}w`).join(', ')
}
