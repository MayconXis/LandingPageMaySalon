/**
 * "Aberto agora" / "Fechado · Abre segunda às 9h", sem biblioteca.
 *
 * O cálculo usa o fuso do SALÃO (Intl.DateTimeFormat com timeZone), não o do visitante:
 * quem abre o site de outro estado ou do exterior vê o status real de Inhumas.
 * Funções puras (recebem a data e o horário), fáceis de testar.
 */

export type Horario = {
  /** 0 = domingo … 6 = sábado */
  days: readonly number[]
  /** "09:00" */
  open: string
  /** "19:00" */
  close: string
  timeZone: string
}

export type StatusSalao = { aberto: true; fechaAs: string } | { aberto: false; abre: string }

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'] as const
const INDICE_DIA: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const emMinutos = (hhmm: string) => {
  const [h = '0', m = '0'] = hhmm.split(':')
  return Number(h) * 60 + Number(m)
}

/** "09:00" → "9h", "09:30" → "9h30" */
export function formatarHora(hhmm: string): string {
  const [h = '0', m = '00'] = hhmm.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

/** Dia da semana (0 a 6) e minuto do dia no fuso informado */
export function momentoNoFuso(agora: Date, timeZone: string): { dia: number; minuto: number } {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(agora)
  const parte = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value ?? '0'
  return {
    dia: INDICE_DIA[parte('weekday')] ?? 0,
    minuto: (Number(parte('hour')) % 24) * 60 + Number(parte('minute')),
  }
}

export function statusDoSalao(agora: Date, horario: Horario): StatusSalao {
  const { dia, minuto } = momentoNoFuso(agora, horario.timeZone)
  const abre = emMinutos(horario.open)
  const fecha = emMinutos(horario.close)

  if (horario.days.includes(dia) && minuto >= abre && minuto < fecha) {
    return { aberto: true, fechaAs: formatarHora(horario.close) }
  }

  // Próxima abertura: hoje (se ainda não abriu), amanhã ou o próximo dia de funcionamento
  for (let i = 0; i <= 7; i++) {
    const d = (dia + i) % 7
    if (!horario.days.includes(d)) continue
    if (i === 0 && minuto >= abre) continue
    const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : DIAS[d]
    return { aberto: false, abre: `${quando} às ${formatarHora(horario.open)}` }
  }
  return { aberto: false, abre: '' }
}
