/**
 * Perguntas frequentes — /servicos.
 * TODO(cliente): revisar respostas. Política de cancelamento e formas de pagamento
 * precisam refletir as regras reais do salão.
 */
export type Pergunta = { pergunta: string; resposta: string }

export const faq: Pergunta[] = [
  {
    pergunta: 'Precisa agendar com antecedência?',
    resposta:
      'Sim. Trabalhamos com hora marcada para que cada cliente tenha o tempo e a atenção que merece. Para cor e mechas, que levam mais tempo, vale reservar com uma ou duas semanas. Se precisar de um encaixe, chame a gente no WhatsApp: sempre tentamos ajudar.',
  },
  {
    pergunta: 'Posso ir com o cabelo sujo para colorir?',
    resposta:
      'Pode, e muitas vezes é até melhor. O ideal é lavar um ou dois dias antes e evitar óleos e finalizadores pesados no dia. A oleosidade natural ajuda a proteger o couro cabeludo durante a química. Na dúvida, pergunte na hora de agendar.',
  },
  {
    pergunta: 'Quanto tempo dura uma colorimetria?',
    resposta:
      'No salão, de 2 a 5 horas, dependendo da técnica, do comprimento e da cor de partida. Em casa, a cor costuma se manter bonita por 6 a 8 semanas com shampoo para cabelos coloridos e protetor térmico. No balayage, como a raiz cresce suave, dá para espaçar ainda mais os retoques.',
  },
  {
    pergunta: 'Vocês atendem noivas no dia do casamento?',
    resposta:
      'Sim, e com muito carinho. A Noiva May inclui teste de cabelo e maquiagem antes do grande dia e uma equipe dedicada a você na data. Madrinhas e mãe da noiva também podem ser incluídas. O orçamento é personalizado pelo WhatsApp.',
  },
  {
    pergunta: 'Como é o processo de despigmentação?',
    resposta:
      'Começa com uma avaliação do seu desenho atual. Depois clareamos a micropigmentação antiga aos poucos, com um intervalo entre as sessões para a pele se recuperar. O número de sessões depende da cor e da profundidade do pigmento, e a gente te explica tudo antes de começar.',
  },
  {
    pergunta: 'Aceitam cartão de crédito?',
    resposta:
      'Aceitamos, sim: crédito, débito, Pix e dinheiro. Se quiser parcelar um serviço maior, como cor ou pacote de noiva, consulte as condições pelo WhatsApp antes do atendimento.',
  },
]
