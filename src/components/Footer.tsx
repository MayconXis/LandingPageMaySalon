import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react'
import { footerServices, mainNav, site } from '@/config/site'
import { whatsappLink } from '@/lib/whatsapp'
import { InstagramIcon, WhatsAppIcon } from './icons/BrandIcons'
import { Logo } from './Logo'

const linkClass =
  'link-underline inline-flex min-h-[44px] min-w-[44px] items-center text-[0.9375rem] text-ivory/75 transition-colors duration-400 hover:text-ivory md:min-h-[36px]'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark relative mt-section text-ivory">
      {/* Divisor em curva suave: a página "repousa" sobre o rodapé */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="block h-8 w-full text-deep md:h-14"
      >
        <path d="M0 64C360 8 1080 8 1440 64Z" fill="currentColor" />
      </svg>

      <div className="bg-deep">
        <div className="container grid gap-14 pb-12 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-16">
          {/* Marca */}
          <div className="lg:col-span-4">
            <Logo mode="full" tom="escuro" tamanho="lg" className="text-[2.25rem] text-ivory md:text-[2.75rem]" />
            <p className="mt-4 font-accent text-accent-lg italic text-primary-200">
              {site.tagline}
            </p>
            <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/70">
              Um espaço pensado para você desacelerar, se cuidar e sair se reconhecendo no espelho.
            </p>

            <div className="mt-8 flex gap-3">
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${site.instagram.handle} (abre em nova aba)`}
                className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors duration-400 hover:border-primary-300 hover:text-primary-300"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp do May Salon (abre em nova aba)"
                className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors duration-400 hover:border-primary-300 hover:text-primary-300"
              >
                <WhatsAppIcon size={19} />
              </a>
            </div>
          </div>

          {/* Colunas */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="eyebrow-light">Navegação</h2>
              <ul className="mt-5 space-y-1 md:space-y-2">
                {mainNav.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="eyebrow-light">Serviços</h2>
              <ul className="mt-5 space-y-1 md:space-y-2">
                {footerServices.map((service) => (
                  <li key={service.label}>
                    <Link to={service.to} className={linkClass}>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <h2 className="eyebrow-light">
                Contato &amp; Redes Sociais
              </h2>
              <ul className="mt-5 space-y-3 text-[0.9375rem] text-ivory/75">
                <li>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[44px] items-center gap-3 transition-colors duration-400 hover:text-ivory md:min-h-[36px]"
                  >
                    <WhatsAppIcon size={17} className="shrink-0 text-primary-300" />
                    <span className="link-underline">WhatsApp</span>
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={site.phoneHref}
                    className="inline-flex min-h-[44px] items-center gap-3 transition-colors duration-400 hover:text-ivory md:min-h-[36px]"
                  >
                    <Phone aria-hidden="true" size={17} strokeWidth={1.5} className="shrink-0 text-primary-300" />
                    <span className="link-underline">{site.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={site.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-3 transition-colors duration-400 hover:text-ivory md:min-h-[36px]"
                  >
                    <InstagramIcon size={17} className="shrink-0 text-primary-300" />
                    <span className="link-underline">{site.instagram.handle}</span>
                    <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 pt-1">
                  <MapPin aria-hidden="true" size={17} strokeWidth={1.5} className="mt-1 shrink-0 text-primary-300" />
                  <span>
                    {site.address.city}, {site.address.state === 'GO' ? 'Goiás' : site.address.state}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock aria-hidden="true" size={17} strokeWidth={1.5} className="mt-1 shrink-0 text-primary-300" />
                  <span>{site.hours.label}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra inferior. No mobile, respiro extra para o botão flutuante não cobrir o texto. */}
        <div className="border-t border-ivory/10">
          <div className="container flex flex-col gap-2 pb-24 pt-6 text-[0.8125rem] text-ivory/60 sm:flex-row sm:items-center sm:justify-between md:pb-8 md:pr-24 lg:pr-28">
            <p>© {year} May Salon. Todos os direitos reservados.</p>
            <p className="font-accent text-base italic text-ivory/70">Feito com cuidado em Inhumas, Goiás.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
