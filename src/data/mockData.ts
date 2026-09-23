// TODO(cliente): substituir por dados reais
/**
 * Dados FICTÍCIOS da equipe do May Salon.
 *
 * Cada assunto tem a sua fonte própria:
 *  - serviços: src/data/servicos.ts
 *  - depoimentos: src/data/depoimentos.ts
 *  - números da Home: src/data/stats.ts
 *  - perguntas frequentes: src/data/faq.ts
 * `specialties` da equipe usa os slugs de servicos.ts.
 *
 * Nada aqui foi confirmado pelo salão. Enquanto MOCK_DATA for true, a interface:
 *  - não transforma os @ da equipe em links (podem existir perfis reais com esses nomes);
 *  - mostra avatares com a inicial no lugar das fotos (as fotos reais vêm da cliente).
 */
import { servicos, type Servico } from './servicos'

export const MOCK_DATA = true

/* ────────────────────────────────────────────
   Tipos
   ──────────────────────────────────────────── */

export type TeamMember = {
  id: string
  name: string
  role: string
  /** 2 frases pessoais, não corporativas */
  bio: string
  yearsExperience: number
  /** slugs de servicos.ts */
  specialties: string[]
  /** @ fictício. Não renderizar como link enquanto MOCK_DATA = true */
  instagram: string
  /** Vazio: a foto real vem da cliente */
  avatar: string
}

/* ────────────────────────────────────────────
   1. Equipe
   ──────────────────────────────────────────── */

export const team: TeamMember[] = [
  {
    id: 'may',
    name: 'May', // TODO(cliente): nome completo da proprietária
    role: 'Fundadora e Colorista',
    bio: 'Encontrei na cor o meu jeito de cuidar das pessoas e abri o salão para fazer isso do meu jeito. Nada me deixa mais feliz do que ver uma cliente se olhar no espelho e sorrir antes de falar qualquer coisa.',
    yearsExperience: 9,
    specialties: ['colorimetria', 'corte-finalizacao', 'tratamentos-capilares', 'dia-da-noiva'],
    instagram: '@may.colorista',
    avatar: '',
  },
  {
    id: 'carol',
    name: 'Carolina Teles',
    role: 'Hair Stylist',
    bio: 'Corto cabelo desde que minhas primas eram minhas únicas clientes. Gosto de cortes que continuam bonitos no quinto dia, não só na saída do salão.',
    yearsExperience: 7,
    specialties: ['corte-finalizacao', 'colorimetria', 'tratamentos-capilares', 'penteados', 'dia-da-noiva'],
    instagram: '@carolteles.hair',
    avatar: '',
  },
  {
    id: 'bia',
    name: 'Beatriz Moura',
    role: 'Especialista em Olhar',
    bio: 'Sou apaixonada pelos detalhes que ninguém percebe de primeira, mas todo mundo sente. Meu trabalho é deixar o seu olhar mais leve sem apagar quem você é.',
    yearsExperience: 6,
    specialties: ['design-sobrancelha', 'cilios', 'despigmentacao'],
    instagram: '@bia.olhar',
    avatar: '',
  },
  {
    id: 'lari',
    name: 'Larissa Mendes',
    role: 'Maquiadora',
    bio: 'Comecei maquiando amigas para formatura e nunca mais parei. Hoje meu momento preferido é ver a noiva se enxergar pronta pela primeira vez.',
    yearsExperience: 5,
    specialties: ['maquiagem', 'penteados', 'dia-da-noiva'],
    instagram: '@lari.make',
    avatar: '',
  },
]

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

export const getTeamMember = (id: string | null | undefined) => team.find((t) => t.id === id)

/** Quem faz um serviço (derivado de `specialties`, para não manter a relação em dois lugares) */
export const especialistasDoServico = (slug: string) => team.filter((t) => t.specialties.includes(slug))

/** Serviços que uma especialista domina, na ordem de servicos.ts */
export const servicosDaEspecialista = (member: TeamMember): Servico[] =>
  servicos.filter((s) => member.specialties.includes(s.slug))

/** Primeiro nome, para botões ("Agendar com Carolina") */
export const primeiroNome = (member: TeamMember) => member.name.split(' ')[0] ?? member.name

/** Link do Instagram: o perfil do salão enquanto os @ da equipe forem fictícios */
export function instagramDaEspecialista(member: TeamMember): { url: string; label: string } {
  if (MOCK_DATA) return { url: 'https://www.instagram.com/maysalon.oficial/', label: 'Instagram do May Salon' }
  const handle = member.instagram.replace(/^@/, '')
  return { url: `https://www.instagram.com/${handle}/`, label: `Instagram de ${member.name} (@${handle})` }
}
