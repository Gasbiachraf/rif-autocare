import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, Minus } from 'lucide-react'
import { PACK_FEATURES, packs } from '../data/services'
import { useI18n } from '../i18n'
import { Price, Reveal } from './ui'

export function PackCards() {
  const { t, l, path } = useI18n()
  const p = t.packs
  return (
    <ul className="grid gap-5 lg:grid-cols-3">
      {packs.map((pack, i) => {
        const item = p.items[pack.id]
        return (
          <Reveal as="li" key={pack.id} delay={i * 80} className="flex">
            <article
              className={`cut relative flex w-full flex-col p-6 sm:p-7 ${pack.highlight ? 'bg-chalk text-coal' : 'panel'}`}
              aria-labelledby={`pack-${pack.id}`}
            >
              {pack.highlight && (
                <span className="absolute end-6 top-6 bg-blaze px-2 py-0.5 font-display text-xs font-bold tracking-wider text-coal uppercase">{p.popular}</span>
              )}
              <p className={`font-display text-sm font-bold tracking-[0.2em] uppercase ${pack.highlight ? 'text-[#b33a0c]' : 'text-blaze'}`}>{p.pack}</p>
              <h3 id={`pack-${pack.id}`} className="h-display text-5xl leading-none">
                {item.name}
              </h3>
              <p className={`mt-3 text-[15px] ${pack.highlight ? 'text-coal/75' : 'text-fog'}`}>{item.tagline}</p>

              <div className={`mt-6 border-y py-4 ${pack.highlight ? 'border-coal/15 [&_*]:!text-coal [&_span.border]:!border-coal/30' : 'border-steel'}`}>
                <Price amount={pack.priceFrom} size="lg" />
                <p className="mt-2 flex items-center gap-1.5 text-sm opacity-80">
                  <Clock className="size-4" aria-hidden="true" />
                  {t.common.duration} : {l(pack.duration)}
                </p>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5 text-[15px]">
                {PACK_FEATURES.map((f) => {
                  const on = pack.features.includes(f)
                  return (
                    <li key={f} className={`flex items-start gap-2.5 ${on ? '' : 'opacity-45'}`}>
                      {on ? (
                        <Check className={`mt-0.5 size-4 shrink-0 ${pack.highlight ? 'text-[#b33a0c]' : 'text-blaze'}`} strokeWidth={3} aria-hidden="true" />
                      ) : (
                        <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      )}
                      <span>
                        <span className="sr-only">{on ? p.included : p.notIncluded} : </span>
                        {p.features[f]}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <Link to={path(`/devis?pack=${pack.id}`)} className={`mt-7 w-full ${pack.highlight ? 'btn-dark' : 'btn-blaze'}`}>
                {p.choose}
                <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </article>
          </Reveal>
        )
      })}
    </ul>
  )
}

/** Side-by-side comparison table (desktop-friendly, scrolls horizontally on small screens). */
export function PackTable() {
  const { t } = useI18n()
  const p = t.packs
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-start text-[15px]">
        <caption className="sr-only">{p.title}</caption>
        <thead>
          <tr className="border-b border-steel">
            <th scope="col" className="p-4 text-start font-display text-sm font-bold tracking-wider text-fog uppercase">
              {p.feature}
            </th>
            {packs.map((pack) => (
              <th key={pack.id} scope="col" className={`p-4 text-center font-display text-xl font-bold uppercase italic ${pack.highlight ? 'text-blaze' : ''}`}>
                {p.items[pack.id].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PACK_FEATURES.map((f) => (
            <tr key={f} className="border-b border-steel/60 last:border-0">
              <th scope="row" className="p-4 text-start font-medium text-chalk/90">
                {p.features[f]}
              </th>
              {packs.map((pack) => (
                <td key={pack.id} className="p-4 text-center">
                  {pack.features.includes(f) ? (
                    <>
                      <Check className="mx-auto size-5 text-blaze" strokeWidth={3} aria-hidden="true" />
                      <span className="sr-only">{p.included}</span>
                    </>
                  ) : (
                    <>
                      <Minus className="mx-auto size-5 text-iron" aria-hidden="true" />
                      <span className="sr-only">{p.notIncluded}</span>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-carbon">
            <th scope="row" className="p-4 text-start font-display text-sm font-bold tracking-wider text-fog uppercase">
              {t.common.from}
            </th>
            {packs.map((pack) => (
              <td key={pack.id} className="p-4 text-center">
                <Price amount={pack.priceFrom} size="sm" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
