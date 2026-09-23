/**
 * Depoimentos do May Salon.
 *
 * TODO(cliente): substituir pelo conteúdo real (destaque "Feedbacks" do Instagram
 * ou avaliações do Google), com autorização de cada cliente.
 * Enquanto `ilustrativo: true`, o site mostra um aviso abaixo do carrossel.
 */
export type Depoimento = {
  id: string
  nome: string
  servico: string
  texto: string
  nota: 1 | 2 | 3 | 4 | 5
  data: string
  ilustrativo: boolean
}

export const depoimentos: Depoimento[] = [
  {
    id: 'dep-01',
    nome: 'Camila R.',
    servico: 'Colorimetria',
    texto: 'Fiz o balayage e saí amando. Três meses depois a raiz cresceu e continua bonito, sem aquela marca feia.',
    nota: 5,
    data: 'Agosto 2026',
    ilustrativo: true,
  },
  {
    id: 'dep-02',
    nome: 'Fernanda L.',
    servico: 'Corte & Finalização',
    texto: 'A Carol me perguntou até quanto tempo eu gasto secando o cabelo de manhã. Fiquei com um corte que eu consigo arrumar sozinha.',
    nota: 5,
    data: 'Julho 2026',
    ilustrativo: true,
  },
  {
    id: 'dep-03',
    nome: 'Juliana M.',
    servico: 'Colorimetria',
    texto: 'Eu tinha medo de ficar loira demais. Fomos clareando com calma e o resultado ficou do jeitinho que eu tinha mostrado na foto.',
    nota: 5,
    data: 'Junho 2026',
    ilustrativo: true,
  },
  {
    id: 'dep-04',
    nome: 'Patrícia S.',
    servico: 'Design de Sobrancelha',
    texto: 'Minha sobrancelha ficou perfeita, bem natural. Meu marido nem percebeu o que eu tinha feito, só disse que eu estava com uma cara descansada.',
    nota: 5,
    data: 'Maio 2026',
    ilustrativo: true,
  },
  {
    id: 'dep-05',
    nome: 'Aline C.',
    servico: 'Dia da Noiva',
    texto: 'No dia do casamento eu só precisei chegar. O teste antes me deixou tranquila, e o penteado aguentou a festa inteira, inclusive a pista de dança.',
    nota: 5,
    data: 'Abril 2026',
    ilustrativo: true,
  },
  {
    id: 'dep-06',
    nome: 'Renata O.',
    servico: 'Cílios',
    texto: 'Pedi um efeito natural e foi exatamente isso. Acordo arrumada e economizo um tempão com rímel.',
    nota: 5,
    data: 'Março 2026',
    ilustrativo: true,
  },
  {
    id: 'dep-07',
    nome: 'Gabriela P.',
    servico: 'Tratamentos Capilares',
    texto: 'Meu cabelo vivia armado com o calor daqui. Depois da selagem ele ficou alinhado e com brilho, e eu continuo com as minhas ondas.',
    nota: 5,
    data: 'Janeiro 2026',
    ilustrativo: true,
  },
  {
    id: 'dep-08',
    nome: 'Tatiane F.',
    servico: 'Colorimetria',
    texto: 'Eu achava que ia ter que cortar tudo para sair do preto. Foram duas sessões, com muito cuidado, e hoje estou com o castanho claro que eu queria. O ambiente é muito aconchegante.',
    nota: 5,
    data: 'Novembro 2025',
    ilustrativo: true,
  },
]
