import type { ImageName } from './images'

/**
 * Pares de antes e depois.
 *
 * TODO(cliente): hoje só temos as fotos de "depois" (do Instagram). Com `ilustrativo: true`,
 * o "antes" é a mesma foto em preto e branco, só para demonstrar o slider, e o card
 * mostra a etiqueta "Imagem ilustrativa". Trocar por pares reais antes de publicar.
 */
export type Transformacao = {
  id: string
  servico: string
  titulo: string
  antes: { name: ImageName; alt: string }
  depois: { name: ImageName; alt: string }
  /** Descrição do resultado, lida por leitores de tela no comparador */
  descricao: string
  ilustrativo: boolean
}

const par = (name: ImageName, depois: string) => ({
  antes: { name, alt: `Antes: ${depois.charAt(0).toLowerCase()}${depois.slice(1)}` },
  depois: { name, alt: `Depois: ${depois.charAt(0).toLowerCase()}${depois.slice(1)}` },
  descricao: `Resultado: ${depois.charAt(0).toLowerCase()}${depois.slice(1)}.`,
})

export const transformacoes: Transformacao[] = [
  {
    id: 'mechas',
    servico: 'Colorimetria',
    titulo: 'Morena iluminada',
    ...par('transformacao-mechas', 'Cabelo castanho longo com mechas em tons de caramelo e ondas nas pontas'),
    ilustrativo: true,
  },
  {
    id: 'iluminado',
    servico: 'Colorimetria',
    titulo: 'Loiro iluminado',
    ...par('transformacao-iluminado', 'Cliente de cabelo loiro iluminado na altura dos ombros, com ondas soltas'),
    ilustrativo: true,
  },
  {
    id: 'noiva-penteado',
    servico: 'Dia da Noiva',
    titulo: 'Semipreso com ondas',
    ...par('transformacao-noiva-penteado', 'Especialista finalizando o penteado semipreso de uma noiva de cabelo escuro'),
    ilustrativo: true,
  },
  {
    id: 'noiva-ondas',
    servico: 'Dia da Noiva',
    titulo: 'Ondas com tiara',
    ...par('transformacao-noiva-ondas', 'Noiva sorrindo com ondas longas e tiara, ao lado da especialista'),
    ilustrativo: true,
  },
  {
    id: 'noiva-make',
    servico: 'Maquiagem',
    titulo: 'Make de noiva',
    ...par('transformacao-noiva-solto', 'Rosto de noiva com maquiagem iluminada e tiara de cristais'),
    ilustrativo: true,
  },
]
