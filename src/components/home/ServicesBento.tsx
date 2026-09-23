import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { destaques } from '@/data/servicos'
import { cn } from '@/lib/cn'
import { SectionHeading } from '../SectionHeading'
import { Stagger, StaggerItem } from '../Stagger'
import { ServiceCard } from '../ServiceCard'

/**
 * Posição de cada card no bento (desktop, grid de 4 colunas × 3 linhas):
 * [ Cor 2×2      ][ Corte ][ Trat. ]
 * [              ][ Penteados 2×1  ]
 * [ Make 2×1     ][ Olhar 2×1      ]
 */
const layout = [
  'sm:col-span-2 lg:col-span-2 lg:row-span-2',
  'lg:col-span-1',
  'lg:col-span-1',
  'sm:col-span-2 lg:col-span-2',
  'lg:col-span-2',
  'sm:col-span-2 lg:col-span-2',
]

export function ServicesBento() {
  return (
    <section aria-labelledby="servicos-titulo" className="bg-ivory py-section">
      <div className="container">
        <SectionHeading
          id="servicos-titulo"
          eyebrow="Serviços em destaque"
          title={
            <>
              Cuidado para <em className="font-accent italic text-primary-700">cada parte de você.</em>
            </>
          }
          description="Do cabelo ao olhar, cada atendimento começa com uma conversa sobre como você quer se ver no espelho."
          action={
            <Link
              to="/servicos"
              className="link-underline inline-flex min-h-[44px] items-center gap-2 font-medium text-primary-700"
            >
              Ver todos os serviços
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
          }
        />

        <Stagger
          as="ul"
          className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:auto-rows-[minmax(15rem,auto)] lg:grid-cols-4 lg:gap-5"
        >
          {destaques.map((d, i) => (
            <StaggerItem as="li" variant="scale" key={d.slug + d.nome} className={cn(layout[i])}>
              <ServiceCard
                variant="bento"
                slug={d.slug}
                nome={d.nome}
                assinatura={d.assinatura}
                texto={d.resumo}
                precoDe={d.precoDe}
                icon={d.icon}
                imagem={d.imagem}
                imagemPosicao={i === 0 ? 'topo' : 'lado'}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
