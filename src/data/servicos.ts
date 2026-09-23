import {
  Brush,
  Crown,
  Droplets,
  Eye,
  Feather,
  Palette,
  ScanEye,
  Sparkle,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import type { ImageName } from './images'

/**
 * Cardápio de serviços.
 *
 * TODO(cliente): validar a lista, as durações e os valores.
 *  - Durações são estimativas de mercado, não do salão.
 *  - Preço null = "Valor sob consulta" no site (nunca inventamos preço).
 *  - "Dia da Noiva" e "Despigmentação" vieram dos destaques do Instagram do salão.
 */

export type Categoria = 'cabelo' | 'estetica' | 'maquiagem'

export const categorias: { id: Categoria; label: string }[] = [
  { id: 'cabelo', label: 'Cabelo' },
  { id: 'estetica', label: 'Estética Facial' },
  { id: 'maquiagem', label: 'Maquiagem' },
]

export type Servico = {
  slug: string
  categoria: Categoria
  /** Nome comum, o que a cliente procura no Google */
  nome: string
  /** Nome-assinatura da casa */
  assinatura: string
  descricao: string
  duracao: string
  precoDe: number | null
  precoAte?: number | null
  /** Pacotes montados sob medida (ex.: noiva): mostra "Orçamento personalizado" no lugar do preço */
  orcamentoPersonalizado?: boolean
  icon: LucideIcon
}

export const servicos: Servico[] = [
  {
    slug: 'corte-finalizacao',
    categoria: 'cabelo',
    nome: 'Corte & Finalização',
    assinatura: 'Corte Assinatura',
    descricao: 'Corte pensado para o seu rosto e para a sua rotina, com finalização para sair pronta.',
    duracao: '1h',
    precoDe: null,
    icon: Wind,
  },
  {
    slug: 'colorimetria',
    categoria: 'cabelo',
    nome: 'Colorimetria',
    assinatura: 'Ritual de Cor',
    descricao: 'Coloração, mechas e morena iluminada, com diagnóstico de cor e cuidado com os fios.',
    duracao: '2h a 5h',
    precoDe: null,
    icon: Palette,
  },
  {
    slug: 'tratamentos-capilares',
    categoria: 'cabelo',
    nome: 'Tratamentos Capilares',
    assinatura: 'Terapia dos Fios',
    descricao: 'Hidratação, nutrição ou reconstrução, conforme o que o seu cabelo pede hoje.',
    duracao: '1h',
    precoDe: null,
    icon: Droplets,
  },
  {
    slug: 'penteados',
    categoria: 'cabelo',
    nome: 'Penteados',
    assinatura: 'Penteado de Ocasião',
    descricao: 'Do preso ao solto com ondas, para festas, formaturas e eventos especiais.',
    duracao: '1h a 1h30',
    precoDe: null,
    icon: Feather,
  },
  {
    slug: 'design-sobrancelha',
    categoria: 'estetica',
    nome: 'Design de Sobrancelha',
    assinatura: 'Olhar Emoldurado',
    descricao: 'Desenho que respeita a sua expressão natural e equilibra o rosto sem exageros.',
    duracao: '40 min',
    precoDe: null,
    icon: Eye,
  },
  {
    slug: 'cilios',
    categoria: 'estetica',
    nome: 'Cílios',
    assinatura: 'Olhar em Evidência',
    descricao: 'Técnicas para alongar e curvar os cílios, do efeito natural ao marcante.',
    duracao: '1h30 a 2h',
    precoDe: null,
    icon: ScanEye,
  },
  {
    slug: 'despigmentacao',
    categoria: 'estetica',
    nome: 'Despigmentação de Sobrancelha',
    assinatura: 'Recomeço do Olhar',
    descricao: 'Clareia a micropigmentação antiga para você recuperar um desenho leve e atual.',
    duracao: '1h',
    precoDe: null,
    icon: Sparkle,
  },
  {
    slug: 'maquiagem',
    categoria: 'maquiagem',
    nome: 'Maquiagem Profissional',
    assinatura: 'Make Autoral',
    descricao: 'Maquiagem para eventos que valoriza os seus traços e dura a noite inteira.',
    duracao: '1h',
    precoDe: null,
    icon: Brush,
  },
  {
    slug: 'dia-da-noiva',
    categoria: 'maquiagem',
    nome: 'Dia da Noiva',
    assinatura: 'Noiva May',
    descricao: 'Cabelo e maquiagem com teste prévio, para você viver o grande dia sem preocupação.',
    duracao: 'Sob medida',
    precoDe: null,
    orcamentoPersonalizado: true,
    icon: Crown,
  },
]

export const getServico = (slug: string | null | undefined) => servicos.find((s) => s.slug === slug)

/** Os 6 destaques da Home (bento). A ordem define a posição no grid. */
export type Destaque = {
  slug: string
  categoria: Categoria
  nome: string
  assinatura: string
  resumo: string
  precoDe: number | null
  icon: LucideIcon
  imagem?: { name: ImageName; alt: string }
}

export const destaques: Destaque[] = [
  {
    slug: 'colorimetria',
    categoria: 'cabelo',
    nome: 'Colorimetria',
    assinatura: 'Ritual de Cor',
    resumo: 'Mechas, coloração e morena iluminada com diagnóstico de cor.',
    precoDe: null,
    icon: Palette,
    imagem: {
      name: 'servico-cor',
      alt: 'Cliente de cabelo loiro iluminado, na altura dos ombros, com ondas soltas',
    },
  },
  {
    slug: 'corte-finalizacao',
    categoria: 'cabelo',
    nome: 'Corte & Finalização',
    assinatura: 'Corte Assinatura',
    resumo: 'Pensado para o seu rosto e para a sua rotina.',
    precoDe: null,
    icon: Wind,
  },
  {
    slug: 'tratamentos-capilares',
    categoria: 'cabelo',
    nome: 'Tratamentos Capilares',
    assinatura: 'Terapia dos Fios',
    resumo: 'O cuidado que o seu cabelo está pedindo hoje.',
    precoDe: null,
    icon: Droplets,
  },
  {
    slug: 'penteados',
    categoria: 'cabelo',
    nome: 'Penteados',
    assinatura: 'Penteado de Ocasião',
    resumo: 'Do preso ao solto com ondas, para festas e eventos especiais.',
    precoDe: null,
    icon: Feather,
  },
  {
    slug: 'maquiagem',
    categoria: 'maquiagem',
    nome: 'Maquiagem Profissional',
    assinatura: 'Make Autoral',
    resumo: 'Valoriza os seus traços e dura a noite inteira.',
    precoDe: null,
    icon: Brush,
  },
  {
    slug: 'design-sobrancelha',
    categoria: 'estetica',
    nome: 'Sobrancelha & Cílios',
    assinatura: 'Olhar Emoldurado',
    resumo: 'Desenho natural que equilibra a sua expressão.',
    precoDe: null,
    icon: Eye,
    imagem: {
      name: 'servico-olhar',
      alt: 'Profissional do May Salon sentada, mostrando no tablet a foto de um olhar com sobrancelhas desenhadas',
    },
  },
]

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/** "a partir de R$ 120", "R$ 120 a R$ 300" ou "Valor sob consulta" */
export function formatPreco(de: number | null, ate?: number | null): string {
  if (de == null) return 'Valor sob consulta'
  if (ate != null) return `${brl.format(de)} a ${brl.format(ate)}`
  return `a partir de ${brl.format(de)}`
}

/** Texto de valor de um serviço, já considerando pacotes com orçamento personalizado */
export function precoServico(s: Pick<Servico, 'precoDe' | 'precoAte' | 'orcamentoPersonalizado'>): string {
  if (s.orcamentoPersonalizado) return 'Orçamento personalizado pelo WhatsApp'
  return formatPreco(s.precoDe, s.precoAte)
}
