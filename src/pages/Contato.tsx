import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Magnetic } from '@/components/Magnetic'
import { Reveal } from '@/components/Reveal'
import { Stagger, StaggerItem } from '@/components/Stagger'
import { ContatoForm } from '@/components/contato/ContatoForm'
import { StatusFuncionamento } from '@/components/contato/StatusFuncionamento'
import { InstagramIcon, WhatsAppIcon } from '@/components/icons/BrandIcons'
import { site } from '@/config/site'
import { seo } from '@/config/seo'
import { beautySalonJsonLd } from '@/config/schema'
import { mapaEmbedUrl, mapaLinkUrl } from '@/lib/mapa'
import { whatsappLink } from '@/lib/whatsapp'

/** Nome do estado por extenso, a partir da sigla de site.address.state */
const ESTADOS: Record<string, string> = { GO: 'Goiás' }

const linkClasse =
  'link-underline inline-flex min-h-[44px] items-center gap-1 font-medium text-ink transition-colors duration-400 hover:text-primary-700'

export default function Contato() {
  const { address } = site

  return (
    <>
      <Seo {...seo.contato} path="/contato" jsonLd={beautySalonJsonLd()} />
      <PageHeader
        tone="dark"
        compact
        crumb="Contato"
        eyebrow="Contato"
        titleLines={['Estamos aqui', <em className="font-accent italic text-primary-200">por você.</em>]}
        titleLabel="Estamos aqui por você."
        description="Venha nos visitar ou fale pelo WhatsApp."
      />

      <div className="container pt-12 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Informações */}
          <section aria-labelledby="visite-titulo" className="lg:col-span-5">
            <h2 id="visite-titulo" className="text-display-md">
              Visite o salão
            </h2>

            <Stagger as="ul" className="mt-8 space-y-7">
              <Info icone={<MapPin aria-hidden="true" size={20} strokeWidth={1.5} />} titulo="Endereço">
                {address.confirmed ? (
                  <p>
                    {address.street}
                    <br />
                    {address.city} ({address.state})
                  </p>
                ) : (
                  // TODO(cliente): com o endereço confirmado em site.ts, a rua aparece aqui, no mapa e no JSON-LD
                  <p>
                    {address.city} ({address.state})
                    <span className="block text-[0.9375rem] text-charcoal-soft">Endereço completo pelo WhatsApp</span>
                  </p>
                )}
                <a href={mapaLinkUrl} target="_blank" rel="noopener noreferrer" className={linkClasse}>
                  Como chegar
                  <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                  <span className="sr-only">(abre o Google Maps em nova aba)</span>
                </a>
              </Info>

              <Info icone={<Clock aria-hidden="true" size={20} strokeWidth={1.5} />} titulo="Horários">
                <p>{site.hours.label}</p>
                <StatusFuncionamento className="mt-3" />
              </Info>

              <Info icone={<WhatsAppIcon size={19} />} titulo="WhatsApp">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClasse}>
                  {site.phoneDisplay}
                  <span className="sr-only">(abre o WhatsApp em nova aba)</span>
                </a>
              </Info>

              <Info icone={<InstagramIcon size={20} />} titulo="Instagram">
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className={linkClasse}>
                  {site.instagram.handle}
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </Info>
            </Stagger>

            <Reveal className="mt-10">
              <Magnetic>
                <a
                  href={whatsappLink('Olá, May Salon! Vim pelo site e gostaria de falar com vocês.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <WhatsAppIcon size={20} />
                  Falar pelo WhatsApp
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </Magnetic>
            </Reveal>
          </section>

          {/* Formulário */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <ContatoForm />
          </Reveal>
        </div>
      </div>

      {/* Mapa */}
      <section aria-labelledby="mapa-titulo" className="container mt-section">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="eyebrow">Localização</p>
            <h2 id="mapa-titulo" className="mt-3 text-display-md">
              Como chegar
            </h2>
          </div>
          <a href={mapaLinkUrl} target="_blank" rel="noopener noreferrer" className={linkClasse}>
            Abrir no Google Maps
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </Reveal>
        {address.confirmed ? (
          <Reveal className="mt-8 overflow-hidden rounded-panel border border-line bg-sand">
            <iframe
              title="Localização do May Salon em Inhumas"
              src={mapaEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-60 w-full border-0 md:h-[360px]"
            />
          </Reveal>
        ) : (
          // Sem endereço confirmado, um mapa da cidade inteira não ajuda ninguém a chegar:
          // no lugar dele, um cartão que leva ao WhatsApp. TODO(cliente): confirmar o endereço em site.ts.
          <Reveal className="mt-8 flex h-60 flex-col items-center justify-center rounded-panel border border-dashed border-primary bg-sand px-6 text-center md:h-[360px]">
            <MapPin aria-hidden="true" size={32} strokeWidth={1.5} className="text-primary" />
            <p className="mt-4 font-display text-2xl text-charcoal">
              {address.city}, {ESTADOS[address.state] ?? address.state}
            </p>
            <p className="mt-2 font-sans text-[0.9375rem] text-muted-strong">Endereço completo pelo WhatsApp</p>
            <a
              href={whatsappLink('Olá, May Salon! Pode me passar o endereço completo do salão?')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 font-medium text-primary-700 underline decoration-1 underline-offset-4 transition-colors duration-400 hover:text-ink"
            >
              Como chegar pelo WhatsApp
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
              <span className="sr-only">(abre o WhatsApp em nova aba)</span>
            </a>
          </Reveal>
        )}
      </section>
    </>
  )
}

/** Um bloco de informação: ícone no círculo sage + título + conteúdo. Entra destampando da esquerda. */
function Info({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <StaggerItem as="li" variant="clipLeft" className="flex gap-4">
      <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary-700">
        {icone}
      </span>
      <div className="min-w-0 pt-0.5">
        <h3 className="font-sans text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-primary-700">{titulo}</h3>
        <div className="mt-1.5 space-y-1 text-[1.0625rem] leading-relaxed text-ink">{children}</div>
      </div>
    </StaggerItem>
  )
}
