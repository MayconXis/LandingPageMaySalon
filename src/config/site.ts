/**
 * Fonte única de verdade para os dados do negócio.
 * Tudo que o cliente precisa confirmar está marcado com TODO(cliente).
 */

export const site = {
  name: 'May Salon',
  tagline: 'Beleza que transforma.',
  url: 'https://maysalon.com.br', // TODO(cliente): domínio definitivo

  // TODO(cliente): número real do WhatsApp, só dígitos com DDI + DDD (ex.: 5562999999999)
  whatsappNumber: '5562900000000',
  whatsappDefaultMessage: 'Olá, May Salon! Gostaria de agendar um horário.',

  // TODO(cliente): telefone fixo ou celular exibido no site
  phoneDisplay: '(62) 90000-0000',
  phoneHref: 'tel:+5562900000000',

  instagram: {
    handle: '@maysalon.oficial',
    url: 'https://www.instagram.com/maysalon.oficial/',
  },

  // TODO(cliente): endereço completo; depois mude `confirmed` para true
  address: {
    street: 'Endereço a confirmar',
    city: 'Inhumas',
    state: 'GO',
    country: 'BR',
    /** false = o mapa e o JSON-LD usam só a cidade (nada de rua inventada) */
    confirmed: false,
  },

  /** 0 = domingo … 6 = sábado. Usado no indicador "Aberto agora" (fuso do salão, não do visitante). */
  hours: {
    days: [1, 2, 3, 4, 5, 6],
    open: '09:00',
    close: '19:00',
    timeZone: 'America/Sao_Paulo',
    label: 'Segunda a sábado, das 9h às 19h',
    short: 'Seg a Sáb · 9h às 19h',
    /** Formato schema.org para o JSON-LD */
    schema: 'Mo-Sa 09:00-19:00',
  },

  /**
   * Imagem de compartilhamento (WhatsApp, Instagram, Facebook): 1200×630 em /public.
   * TODO(cliente): substituir o placeholder por uma foto profissional do salão (mesmo tamanho).
   */
  ogImage: {
    path: '/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'May Salon, salão de beleza em Inhumas (GO): cabelo castanho com mechas caramelo em um espelho oval, sobre fundo verde escuro',
  },
} as const

export type NavItem = {
  label: string
  to: string
}

export const mainNav: NavItem[] = [
  { label: 'Início', to: '/' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Galeria', to: '/galeria' },
  { label: 'Equipe', to: '/equipe' },
  { label: 'Agendamento', to: '/agendamento' },
  { label: 'Contato', to: '/contato' },
]

/** Lista do rodapé. Cada item abre a aba certa em /servicos. */
export const footerServices: NavItem[] = [
  { label: 'Corte & Finalização', to: '/servicos?categoria=cabelo' },
  { label: 'Colorimetria', to: '/servicos?categoria=cabelo' },
  { label: 'Tratamentos Capilares', to: '/servicos?categoria=cabelo' },
  { label: 'Sobrancelha & Cílios', to: '/servicos?categoria=estetica' },
  { label: 'Maquiagem Profissional', to: '/servicos?categoria=maquiagem' },
  { label: 'Dia da Noiva', to: '/servicos?categoria=maquiagem' },
]
