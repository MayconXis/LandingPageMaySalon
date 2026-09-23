import type { ImageName } from './images'

/**
 * Foto de capa de cada serviço na página /servicos (fotos HD ilustrativas, ver images.ts).
 * Separado de servicos.ts para trocar as fotos sem mexer nos dados dos serviços.
 *
 * TODO(cliente): trocar por fotos reais de cada atendimento.
 */
export const fotosServicos: Record<string, { name: ImageName; alt: string }> = {
  'corte-finalizacao': {
    name: 'hd-escova',
    alt: 'Cabeleireira finalizando com secador e escova redonda o cabelo ondulado de uma cliente',
  },
  colorimetria: {
    name: 'hd-ondas',
    alt: 'Cabelo longo castanho com mechas caramelo e ondas soltas, visto de costas',
  },
  'tratamentos-capilares': {
    name: 'hd-lavatorio',
    alt: 'Profissional lavando o cabelo de uma cliente no lavatório',
  },
  penteados: {
    name: 'hd-escova-curto',
    alt: 'Cabeleireira sorrindo enquanto modela o cabelo de uma cliente com prancha',
  },
  'design-sobrancelha': {
    name: 'hd-sobrancelha',
    alt: 'Profissional desenhando a sobrancelha de uma cliente deitada',
  },
  cilios: {
    name: 'hd-olhar',
    alt: 'Olho maquiado de perto, com delineado gatinho e cílios alongados',
  },
  despigmentacao: {
    name: 'hd-sobrancelha-close',
    alt: 'Mãos de profissional cuidando da sobrancelha de uma cliente, bem de perto',
  },
  maquiagem: {
    name: 'hd-make',
    alt: 'Maquiadora aplicando batom em uma cliente de olhos esfumados',
  },
  'dia-da-noiva': {
    name: 'hd-noiva',
    alt: 'Noiva de vestido branco segurando um buquê de flores claras ao lado do noivo',
  },
}
