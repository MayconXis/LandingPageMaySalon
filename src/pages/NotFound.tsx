import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Magnetic } from '@/components/Magnetic'
import { seo } from '@/config/seo'

export default function NotFound() {
  return (
    <>
      <Seo {...seo.naoEncontrada} path="/404" noindex />
      <PageHeader
        crumb="Página não encontrada"
        eyebrow="Erro 404"
        titleLines={[
          'Essa página saiu para',
          <em className="font-accent italic text-primary-700">um retoque.</em>,
        ]}
        titleLabel="Essa página saiu para um retoque."
        description="O endereço pode ter mudado. Que tal voltar ao início ou ver nossos serviços?"
      />
      <div className="container flex flex-wrap gap-3">
        <Magnetic>
          <Link to="/" className="btn btn-primary">
            Voltar ao início
          </Link>
        </Magnetic>
        <Link to="/servicos" className="btn btn-ghost">
          Ver serviços
        </Link>
      </div>
    </>
  )
}
