import { Clock, Phone } from 'lucide-react'
import { site } from '@/config/site'
import { whatsappLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from '../icons/BrandIcons'
import { Magnetic } from '../Magnetic'
import { Reveal } from '../Reveal'
import { TextRevealWords } from '../TextRevealWords'

/** CTA final: painel bg-deep dentro do ivory, para não emendar com o carrossel escuro. */
export function BookingCta() {
  return (
    <section aria-labelledby="cta-titulo" className="bg-ivory pt-section">
      <div className="container">
        <Reveal className="on-dark relative overflow-hidden rounded-panel bg-deep px-6 py-16 text-center sm:px-12 md:py-24">
          {/* Eco do espelho cápsula, só em contorno */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 hidden h-[26rem] w-52 rounded-full border border-primary/30 md:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-10 hidden h-[22rem] w-44 rounded-full border border-primary/20 md:block"
          />

          <p className="eyebrow-light">Agendamento</p>
          <TextRevealWords
            as="h2"
            id="cta-titulo"
            text="Já separamos seu lugar no espelho dourado."
            accentWords={1}
            accentClassName="font-accent italic"
            delay={0.2}
            stagger={0.06}
            className="mx-auto mt-5 max-w-3xl text-display-xl !text-ivory"
          />
          <p className="mx-auto mt-6 max-w-md text-lg text-ivory/75">
            É rápido: bastam algumas mensagens no WhatsApp para reservar o seu.
          </p>

          <Magnetic className="mt-10">
            <a
              href={whatsappLink('Olá, May Salon! Quero agendar um horário. Qual a disponibilidade?')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <WhatsAppIcon size={20} />
              Agendar pelo WhatsApp
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </Magnetic>

          <ul className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-ivory/75 sm:flex-row sm:gap-8">
            <li>
              <a href={site.phoneHref} className="inline-flex min-h-[44px] items-center gap-2 hover:text-ivory">
                <Phone aria-hidden="true" size={16} strokeWidth={1.5} className="text-primary-300" />
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock aria-hidden="true" size={16} strokeWidth={1.5} className="text-primary-300" />
              {site.hours.label}
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
