/**
 * Título e descrição de cada página (fonte única, usada pelo <Seo>).
 * Descrições com até ~155 caracteres para não serem cortadas no Google.
 */
export const seo = {
  home: {
    title: 'May Salon · Salão de Beleza em Inhumas (GO)',
    description:
      'Colorimetria, cortes, cílios, maquiagem e mais em Inhumas, Goiás. Agende pelo WhatsApp e viva a experiência May Salon.',
  },
  servicos: {
    title: 'Serviços · May Salon Inhumas',
    description:
      'Conheça todos os serviços do May Salon: Ritual de Cor, Olhar Emoldurado, Make Autoral, Noiva May e muito mais.',
  },
  galeria: {
    title: 'Galeria de Transformações · May Salon',
    description:
      'Veja os resultados reais do May Salon em colorimetria, cortes e estética. Cada foto conta uma história.',
  },
  agendamento: {
    title: 'Agendar · May Salon',
    description:
      'Agende seu horário no May Salon em Inhumas (GO). Escolha o serviço e fale pelo WhatsApp em menos de 1 minuto.',
  },
  equipe: {
    title: 'Nossa Equipe · May Salon',
    description:
      'Conheça as especialistas do May Salon em Inhumas (GO): cor, cortes, olhar e maquiagem, com um atendimento pensado para você.',
  },
  contato: {
    title: 'Contato · May Salon Inhumas',
    description:
      'Endereço, horário e WhatsApp do May Salon em Inhumas (GO). Venha nos visitar ou fale com a gente pelo WhatsApp.',
  },
  naoEncontrada: {
    title: 'Página não encontrada · May Salon',
    description: 'A página que você procura não existe mais ou mudou de endereço.',
  },
} as const

/**
 * Páginas públicas, na ordem do menu. Usado no build (vite.config.ts) para gerar
 * um HTML por rota com as tags certas (prévia do WhatsApp) e o sitemap.xml.
 * Rota nova no site? Acrescente aqui também.
 */
export const paginasPublicas = [
  { path: '/', ...seo.home },
  { path: '/servicos', ...seo.servicos },
  { path: '/galeria', ...seo.galeria },
  { path: '/equipe', ...seo.equipe },
  { path: '/agendamento', ...seo.agendamento },
  { path: '/contato', ...seo.contato },
] as const
