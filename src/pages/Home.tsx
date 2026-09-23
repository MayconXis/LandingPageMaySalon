import { Seo } from '@/components/Seo'
import { seo } from '@/config/seo'
import { HomeHero } from '@/components/home/HomeHero'
import { ProofBar } from '@/components/home/ProofBar'
import { ServicesBento } from '@/components/home/ServicesBento'
import { TransformationsStrip } from '@/components/home/TransformationsStrip'
import { OurStory } from '@/components/home/OurStory'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { BookingCta } from '@/components/home/BookingCta'
import { HorizontalMarquee } from '@/components/HorizontalMarquee'
import { servicos } from '@/data/servicos'

/**
 * Ritmo de fundos: deep (hero + números) → faixa sand com os nomes dos serviços
 * → ivory (serviços) → sand (antes e depois)
 * → ivory (história) → deep (depoimentos) → ivory com painel deep (CTA final).
 */
export default function Home() {
  return (
    <>
      <Seo {...seo.home} path="/" />
      <HomeHero />
      <ProofBar />
      <HorizontalMarquee items={servicos.map((s) => s.nome)} />
      <ServicesBento />
      <TransformationsStrip />
      <OurStory />
      <TestimonialsSection />
      <BookingCta />
    </>
  )
}
