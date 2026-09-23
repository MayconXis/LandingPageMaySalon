import { site } from '@/config/site'

/**
 * Monta o deeplink do WhatsApp com mensagem pré-preenchida.
 * wa.me funciona no app (mobile) e no WhatsApp Web (desktop).
 */
export function whatsappLink(message: string = site.whatsappDefaultMessage): string {
  const number = site.whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

type MensagemAgendamento = {
  /** Nome-assinatura, ex.: "Ritual de Cor" */
  servico: string
  /** Nome comum, ex.: "Colorimetria / Balayage" (ajuda a recepção a identificar) */
  servicoNome?: string
  /** Nome da especialista ou null para "Sem preferência" */
  especialista: string | null
  observacao?: string
}

/**
 * Mensagem do assistente de agendamento. O whatsappLink() cuida do encode
 * (quebras de linha viram %0A e o emoji segue intacto).
 */
export function mensagemAgendamento({ servico, servicoNome, especialista, observacao }: MensagemAgendamento): string {
  const linhas = [
    'Olá, May Salon! Gostaria de agendar:',
    `✦ Serviço: ${servico}${servicoNome && servicoNome !== servico ? ` (${servicoNome})` : ''}`,
    `✦ Especialista: ${especialista ?? 'Sem preferência'}`,
  ]
  const obs = observacao?.trim()
  if (obs) linhas.push(`✦ Observação: ${obs}`)
  linhas.push('Qual a disponibilidade? 😊')
  return linhas.join('\n')
}
