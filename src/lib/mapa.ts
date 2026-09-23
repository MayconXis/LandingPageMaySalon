import { site } from '../config/site' // relativo: usado também no build (vite.config.ts)

/**
 * Links do Google Maps (sem chave de API).
 * Enquanto o endereço não for confirmado, o mapa mostra só a cidade: nada de rua inventada.
 */
const consulta = site.address.confirmed
  ? `${site.name}, ${site.address.street}, ${site.address.city} - ${site.address.state}`
  : `${site.address.city}, ${site.address.state}`

/** Para o <iframe> */
export const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`

/** Abre o app ou o site do Google Maps (rotas, compartilhar) */
export const mapaLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`
