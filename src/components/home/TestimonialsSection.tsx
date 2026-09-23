import { depoimentos } from '@/data/depoimentos'
import { SectionHeading } from '../SectionHeading'
import { TestimonialsCarousel } from '../TestimonialsCarousel'
import { Stagger, StaggerItem } from '../Stagger'

export function TestimonialsSection() {
  const temIlustrativo = depoimentos.some((d) => d.ilustrativo)
  return (
    <section aria-labelledby="depoimentos-titulo" className="on-dark overflow-x-clip bg-deep py-section">
      <div className="container">
        <SectionHeading
          id="depoimentos-titulo"
          tone="dark"
          align="center"
          eyebrow="Depoimentos"
          titleWords={{
            text: 'Quem vive a experiência, conta.',
            accentWords: 1,
            accentClassName: 'font-accent italic text-blush',
          }}
        />
        <Stagger className="mt-12 md:mt-16">
          <StaggerItem>
            <TestimonialsCarousel items={depoimentos} />
          </StaggerItem>
          {temIlustrativo && (
            <StaggerItem>
              <p className="mx-auto mt-8 max-w-md text-center text-sm text-ivory/60">
                Depoimentos ilustrativos. Em breve, relatos reais das nossas clientes.
              </p>
            </StaggerItem>
          )}
        </Stagger>
      </div>
    </section>
  )
}
