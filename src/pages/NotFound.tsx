import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '../i18n'

export function NotFound() {
  const { t, path } = useI18n()
  return (
    <section className="bg-grid border-b border-steel">
      <div className="container-x py-24 sm:py-32">
        <p className="font-display text-[7rem] leading-none font-extrabold text-transparent italic [-webkit-text-stroke:2px_var(--color-blaze)]" aria-hidden="true">
          404
        </p>
        <h1 className="h-display mt-4 text-5xl">{t.notFound.title}</h1>
        <p className="mt-3 text-lg text-fog">{t.notFound.text}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={path()} className="btn-line">
            {t.notFound.home}
          </Link>
          <Link to={path('/devis')} className="btn-blaze">
            {t.nav.cta}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
