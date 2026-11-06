import { useRef, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Clock, Info } from 'lucide-react'
import { CATEGORIES, categories, imageSrc, imageSrcSet, isCategory, services, type Category } from '../data/services'
import { useI18n } from '../i18n'
import { PackCards, PackTable } from '../components/Packs'
import { CategoryIcon, PageHeader, Price, SectionHeading } from '../components/ui'

export function Services() {
  const { t, l, path, dir } = useI18n()
  const [params, setParams] = useSearchParams()
  const raw = params.get('cat')
  const active: Category = isCategory(raw) ? raw : 'maintenance'
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({})
  const info = categories.find((c) => c.id === active)!
  const list = services.filter((s) => s.category === active)

  const select = (cat: Category, focus = false) => {
    setParams({ cat }, { replace: true, preventScrollReset: true })
    if (focus) tabs.current[cat]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const i = CATEGORIES.indexOf(active)
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    let next: number | null = null
    if (step) next = (i + (dir === 'rtl' ? -step : step) + CATEGORIES.length) % CATEGORIES.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = CATEGORIES.length - 1
    if (next === null) return
    e.preventDefault()
    select(CATEGORIES[next], true)
  }

  return (
    <>
      <PageHeader eyebrow={t.services.eyebrow} title={t.services.title} subtitle={t.services.subtitle} />

      <section className="container-x py-10 sm:py-14">
        <div role="tablist" aria-label={t.services.tabsLabel} onKeyDown={onKeyDown} className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => {
            const selected = c.id === active
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabs.current[c.id] = el
                }}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls="tab-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(c.id)}
                className={`cut-sm flex min-h-12 shrink-0 snap-start items-center gap-2 px-4 font-display text-[17px] font-bold tracking-wide whitespace-nowrap uppercase transition rtl:tracking-normal ${
                  selected ? 'bg-blaze text-coal' : 'bg-graphite text-chalk/85 hover:bg-steel'
                }`}
              >
                <CategoryIcon category={c.id} className="size-4" />
                {l(c.title)}
              </button>
            )
          })}
        </div>

        <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${active}`} tabIndex={0} className="mt-8 grid gap-8 focus-visible:outline-offset-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="cut relative overflow-hidden">
              <img
                key={info.image}
                src={imageSrc(info.image, 1200)}
                srcSet={imageSrcSet(info.image)}
                sizes="(min-width: 1024px) 40vw, 100vw"
                alt={l(info.imageAlt)}
                width={1200}
                height={800}
                className="animate-rise aspect-[3/2] w-full object-cover"
              />
              <span className="absolute start-0 bottom-0 grid size-14 place-items-center bg-blaze text-coal">
                <CategoryIcon category={active} className="size-7" />
              </span>
            </div>
            <h2 className="h-display mt-6 text-5xl leading-none">{l(info.title)}</h2>
            <p className="mt-4 text-lg leading-relaxed text-fog">{l(info.intro)}</p>
            <Link to={path(`/devis?cat=${active}`)} className="btn-blaze mt-6">
              {t.services.quoteCategory(l(info.title))}
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>

          <ul className="space-y-3">
            {list.map((s) => (
              <li key={s.id} className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl leading-tight font-bold uppercase rtl:normal-case">{l(s.title)}</h3>
                  <p className="mt-1 text-fog">{l(s.text)}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-fog">
                    <Clock className="size-4 text-blaze" aria-hidden="true" />
                    {t.common.duration} : {l(s.duration)}
                  </p>
                </div>
                <div className="flex shrink-0 items-end justify-between gap-4 sm:flex-col sm:items-end">
                  <Price amount={s.priceFrom} size="sm" className="sm:text-end" />
                  <Link to={path(`/devis?service=${s.id}`)} className="link-u text-sm whitespace-nowrap">
                    {t.services.quoteThis}
                  </Link>
                </div>
              </li>
            ))}
            <li className="flex gap-2 p-1 text-sm leading-relaxed text-fog">
              <Info className="mt-0.5 size-4 shrink-0 text-blaze" aria-hidden="true" />
              {t.common.priceNote}
            </li>
          </ul>
        </div>
      </section>

      <section id="packs" className="bg-grid border-y border-steel bg-carbon py-16 sm:py-20" aria-labelledby="packs-title">
        <div className="container-x">
          <SectionHeading id="packs-title" eyebrow={t.packs.eyebrow} title={t.home.packsTitle}>
            <p className="mt-4 text-lg leading-relaxed text-fog">{t.home.packsText}</p>
          </SectionHeading>
          <div className="mt-10">
            <PackCards />
          </div>
          <h3 className="h-display mt-16 text-4xl">{t.packs.title}</h3>
          <div className="mt-6">
            <PackTable />
          </div>
          <p className="mt-4 flex gap-2 text-sm text-fog">
            <Info className="mt-0.5 size-4 shrink-0 text-blaze" aria-hidden="true" />
            {t.packs.note}
          </p>
        </div>
      </section>
    </>
  )
}
