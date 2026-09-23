import { site } from './site'
import { seo } from './seo'
import { mapaLinkUrl } from '../lib/mapa' // relativo: este arquivo também é lido pelo vite.config.ts

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

/**
 * Dados estruturados do salão (schema.org BeautySalon), usados na página /contato.
 * Ajudam o Google a mostrar endereço, horário e contato na busca local.
 * A rua só entra quando `site.address.confirmed` for true.
 */
export function beautySalonJsonLd(): Record<string, unknown> {
  const { address, hours } = site
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${site.url}/#salao`,
    name: site.name,
    description: seo.home.description,
    url: `${site.url}/`,
    image: new URL(site.ogImage.path, site.url).toString(),
    telephone: site.phoneHref.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      ...(address.confirmed ? { streetAddress: address.street } : {}),
      addressLocality: address.city,
      addressRegion: address.state,
      addressCountry: address.country,
    },
    areaServed: { '@type': 'City', name: address.city },
    hasMap: mapaLinkUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.days.map((d) => DIAS_SCHEMA[d]),
        opens: hours.open,
        closes: hours.close,
      },
    ],
    sameAs: [site.instagram.url],
  }
}
