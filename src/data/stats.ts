import { servicos } from './servicos'

/**
 * Números da faixa de prova social (Home). Só entram números verificáveis.
 * Os dois primeiros vêm do perfil @maysalon.oficial; o terceiro é contado do cardápio.
 *
 * TODO(cliente): atualizar seguidores e publicações de tempos em tempos.
 * Se o salão tiver nota no Google, ela pode substituir o terceiro item:
 * { value: 4.9, decimals: 1, suffix: '★', label: 'nota média no Google' }
 */
export type Stat = { value: number; decimals?: number; prefix?: string; suffix?: string; label: string }

export const stats: Stat[] = [
  { value: 4100, suffix: '+', label: 'pessoas acompanham o May Salon no Instagram' },
  { value: 569, label: 'publicações com o nosso trabalho' },
  { value: servicos.length, label: 'serviços de beleza em um só lugar' },
  // TODO(cliente): confirmar o ano de abertura do salão antes de publicar
  { value: 8, suffix: '+', label: 'anos transformando Inhumas' },
]
