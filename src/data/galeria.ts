import type { ImageName } from './images'

/**
 * Fotos da Galeria (/galeria).
 *
 * Dois tipos misturados na grade:
 *  - recortes dos posts do Instagram do salão (post_10 a post_18), sem os textos das artes;
 *  - fotos HD ilustrativas (imagens "hd-", de banco de imagens). A página marca essas com o selo
 *    "Ilustrativa" automaticamente (ehIlustrativa em images.ts), então não precisam de flag aqui.
 *
 * TODO(cliente): trocar pelas fotos originais em alta resolução, tirar as ilustrativas
 * e ampliar o acervo por categoria.
 */

/** Filtros da galeria. O id vai para a URL: /galeria?tipo=colorimetria */
export const filtrosGaleria = [
  { id: 'todos', label: 'Todos' },
  { id: 'colorimetria', label: 'Colorimetria' },
  { id: 'corte', label: 'Corte' },
  { id: 'cilios-sobrancelha', label: 'Cílios & Sobrancelha' },
  { id: 'antes-depois', label: 'Antes & Depois' },
] as const

export type FiltroGaleria = (typeof filtrosGaleria)[number]['id']

/** Tags de cada foto. "noiva" e "espaco" só aparecem em "Todos". */
export type TagGaleria = 'colorimetria' | 'corte' | 'cilios-sobrancelha' | 'noiva' | 'espaco'

export type FotoGaleria = {
  id: string
  imagem: ImageName
  alt: string
  /** Legenda curta mostrada no lightbox */
  legenda: string
  tags: TagGaleria[]
}

export const fotosGaleria: FotoGaleria[] = [
  {
    id: 'balayage',
    imagem: 'galeria-balayage',
    alt: 'Cabelo castanho longo com mechas em tons de caramelo e ondas nas pontas',
    legenda: 'Morena iluminada',
    tags: ['colorimetria'],
  },
  {
    id: 'hd-escova',
    imagem: 'hd-escova',
    alt: 'Cabeleireira finalizando com secador e escova redonda o cabelo ondulado de uma cliente',
    legenda: 'Escova com ondas',
    tags: ['corte'],
  },
  {
    id: 'noiva-tiara',
    imagem: 'galeria-noiva-tiara',
    alt: 'Noiva sorrindo com tiara e ondas longas, com a especialista ao fundo, diante de um espelho de moldura dourada',
    legenda: 'Noiva com ondas e tiara',
    tags: ['noiva'],
  },
  {
    id: 'hd-sobrancelha',
    imagem: 'hd-sobrancelha',
    alt: 'Profissional desenhando a sobrancelha de uma cliente deitada',
    legenda: 'Design de sobrancelha',
    tags: ['cilios-sobrancelha'],
  },
  {
    id: 'olhar',
    imagem: 'galeria-olhar',
    alt: 'Profissional do May Salon sentada, mostrando no tablet a foto de um olhar com sobrancelhas desenhadas',
    legenda: 'Design de olhar',
    tags: ['cilios-sobrancelha'],
  },
  {
    id: 'hd-ondas',
    imagem: 'hd-ondas',
    alt: 'Cabelo longo castanho com mechas caramelo e ondas soltas, visto de costas',
    legenda: 'Mechas em tons de caramelo',
    tags: ['colorimetria'],
  },
  {
    id: 'salao',
    imagem: 'galeria-salao',
    alt: 'Interior do May Salon com linhas de luz no teto, espelhos ovais com moldura dourada e cadeiras de atendimento',
    legenda: 'Nosso espaço',
    tags: ['espaco'],
  },
  {
    id: 'iluminado',
    imagem: 'galeria-iluminado',
    alt: 'Cliente de cabelo loiro iluminado na altura dos ombros, com ondas soltas',
    legenda: 'Loiro iluminado com corte na altura dos ombros',
    tags: ['colorimetria', 'corte'],
  },
  {
    id: 'hd-olhar',
    imagem: 'hd-olhar',
    alt: 'Olho maquiado de perto, com delineado gatinho e cílios alongados',
    legenda: 'Olhar com delineado',
    tags: ['cilios-sobrancelha'],
  },
  {
    id: 'noiva-make',
    imagem: 'galeria-noiva-make',
    alt: 'Rosto de noiva com maquiagem iluminada, cílios marcados e tiara de cristais',
    legenda: 'Make de noiva',
    tags: ['noiva'],
  },
  {
    id: 'hd-loira',
    imagem: 'hd-hero-loira',
    alt: 'Mulher sorrindo, com cabelo loiro iluminado e ondulado',
    legenda: 'Loiro iluminado com ondas',
    tags: ['colorimetria'],
  },
  {
    id: 'noiva-penteado',
    imagem: 'galeria-noiva-penteado',
    alt: 'Especialista finalizando o penteado semipreso de uma noiva de cabelo escuro e vestido branco',
    legenda: 'Penteado semipreso',
    tags: ['noiva'],
  },
  {
    id: 'liso',
    imagem: 'galeria-liso',
    alt: 'Pontas de um cabelo escuro, longo e liso, com corte reto e alinhado',
    legenda: 'Corte reto no cabelo longo',
    tags: ['corte'],
  },
  {
    id: 'hd-escova-curto',
    imagem: 'hd-escova-curto',
    alt: 'Cabeleireira sorrindo enquanto modela o cabelo de uma cliente com prancha',
    legenda: 'Modelagem com prancha',
    tags: ['corte'],
  },
  {
    id: 'dia-cliente',
    imagem: 'galeria-dia-cliente',
    alt: 'Recepção do salão com flores sobre a bancada e espelhos ovais de moldura dourada',
    legenda: 'Detalhes do salão',
    tags: ['espaco'],
  },
]

/** Quais transformações (de data/transformacoes.ts) aparecem na seção Antes & Depois */
export const transformacoesGaleria = ['mechas', 'iluminado', 'noiva-penteado'] as const
