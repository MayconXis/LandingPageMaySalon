/**
 * Envio do formulário de contato (/contato).
 *
 * ⚠️ ANTES DE PUBLICAR: defina VITE_CONTACT_ENDPOINT (na Vercel: Settings → Environment Variables).
 * Sem ele o envio é SIMULADO (1.2s e mensagem de sucesso) e a mensagem não chega a ninguém.
 * Qualquer serviço que aceite POST com JSON serve (Formspree, Web3Forms, função própria).
 */

export type MensagemContato = {
  nome: string
  email: string
  /** slug de servicos.ts, "outro" ou vazio */
  servico: string
  mensagem: string
}

const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() ?? ''

/** true enquanto o formulário não estiver ligado a um serviço de envio */
export const envioSimulado = endpoint === ''

const esperar = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export async function enviarContato(dados: MensagemContato): Promise<void> {
  if (envioSimulado) {
    await esperar(1200)
    return
  }
  const resposta = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...dados, origem: 'site maysalon.com.br /contato' }),
  })
  if (!resposta.ok) throw new Error(`Envio recusado (HTTP ${resposta.status})`)
}
