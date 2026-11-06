import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Info, Maximize2, X } from 'lucide-react'
import { GALLERY_CATS, imageSrc, imageSrcSet, isGalleryCat, works, type Work } from '../data/services'
import { useI18n } from '../i18n'
import { BeforeAfter } from '../components/BeforeAfter'
import { PageHeader, Reveal } from '../components/ui'

function Lightbox({ items, index, onIndex, onClose }: { items: Work[]; index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  const { t, l, dir } = useI18n()
  const ref = useRef<HTMLDialogElement>(null)
  const item = index === null ? null : items[index]

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
  }, [item])

  if (index === null || !item) return <dialog ref={ref} onClose={onClose} />

  const go = (delta: number) => onIndex((index + delta + items.length) % items.length)
  const onKeyDown = (e: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    go(dir === 'rtl' ? -step : step)
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-labelledby="lightbox-title"
      className="m-auto max-h-[100svh] w-full max-w-6xl bg-transparent p-3 text-chalk sm:p-6"
    >
      <figure className="relative">
        <img
          src={imageSrc(item.image, 1200)}
          srcSet={imageSrcSet(item.image)}
          sizes="(min-width: 1200px) 1150px, 100vw"
          alt={l(item.alt)}
          width={1200}
          height={800}
          className="max-h-[78svh] w-full bg-carbon object-contain"
        />
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span>
            <span id="lightbox-title" className="font-display text-2xl font-bold uppercase italic rtl:not-italic">
              {l(item.title)}
            </span>
            <span className="ms-3 text-sm text-fog">
              {t.gallery.cats[item.category]} · {t.gallery.position(index + 1, items.length)}
            </span>
          </span>
          <span className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label={t.gallery.prev} className="btn-line size-12 px-0">
              <ChevronLeft className="size-6 rtl:rotate-180" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.gallery.next} className="btn-line size-12 px-0">
              <ChevronRight className="size-6 rtl:rotate-180" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => ref.current?.close()} aria-label={t.gallery.close} className="btn-blaze size-12 px-0" autoFocus>
              <X className="size-6" aria-hidden="true" />
            </button>
          </span>
        </figcaption>
      </figure>
    </dialog>
  )
}

export function Gallery() {
  const { t, l, path } = useI18n()
  const [params, setParams] = useSearchParams()
  const raw = params.get('cat')
  const active = isGalleryCat(raw) ? raw : null
  const list = active ? works.filter((w) => w.category === active) : works
  const comparable = list.filter((w) => w.beforeAfter)
  const [compareId, setCompareId] = useState<string | null>(null)
  const compare = comparable.find((w) => w.id === compareId) ?? comparable[0]
  const [open, setOpen] = useState<number | null>(null)

  const filter = (cat: string | null) => {
    setParams(cat ? { cat } : {}, { replace: true, preventScrollReset: true })
    setOpen(null)
  }

  return (
    <>
      <PageHeader eyebrow={t.gallery.eyebrow} title={t.gallery.title} subtitle={t.gallery.subtitle} />

      <section className="container-x py-10 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label={t.gallery.filterLabel} className="flex flex-wrap gap-2">
            {[null, ...GALLERY_CATS].map((cat) => {
              const on = cat === active
              return (
                <button
                  key={cat ?? 'all'}
                  type="button"
                  aria-pressed={on}
                  onClick={() => filter(cat)}
                  className={`cut-sm min-h-11 px-4 font-display text-[17px] font-bold tracking-wide uppercase transition rtl:tracking-normal ${
                    on ? 'bg-blaze text-coal' : 'bg-graphite text-chalk/85 hover:bg-steel'
                  }`}
                >
                  {cat ? t.gallery.cats[cat] : t.gallery.all}
                </button>
              )
            })}
          </div>
          <p className="font-display text-lg font-semibold text-fog" aria-live="polite">
            {t.gallery.count(list.length)}
          </p>
        </div>

        {compare && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <BeforeAfter key={compare.id} image={compare.image} alt={l(compare.alt)} className="cut" priority />
            <div className="flex flex-col">
              <p className="tag">{t.gallery.sliderLabel}</p>
              <h2 className="h-display mt-2 text-4xl leading-none">{l(compare.title)}</h2>
              <p className="mt-3 text-fog">{t.gallery.sliderHint}</p>
              {comparable.length > 1 && (
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {comparable.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      aria-pressed={w.id === compare.id}
                      aria-label={l(w.title)}
                      onClick={() => setCompareId(w.id)}
                      className={`overflow-hidden border-2 transition ${w.id === compare.id ? 'border-blaze' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={imageSrc(w.image)} alt="" width={640} height={427} loading="lazy" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-auto flex gap-2 pt-6 text-sm leading-relaxed text-fog">
                <Info className="mt-0.5 size-4 shrink-0 text-blaze" aria-hidden="true" />
                {t.gallery.disclaimer}
              </p>
            </div>
          </div>
        )}

        <ul className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
          {list.map((w, i) => (
            <Reveal as="li" key={w.id} delay={(i % 3) * 60} className={i % 5 === 0 ? 'col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
              <button type="button" onClick={() => setOpen(i)} className="group relative block size-full overflow-hidden bg-carbon text-start" aria-label={t.gallery.open(l(w.title))}>
                <img
                  src={imageSrc(w.image, i % 5 === 0 ? 1200 : 640)}
                  alt=""
                  width={640}
                  height={427}
                  loading="lazy"
                  decoding="async"
                  className="size-full min-h-40 object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-coal/95 to-transparent p-3 pt-10 sm:p-4 sm:pt-12">
                  <span>
                    <span className="block font-display text-xs font-bold tracking-widest text-blaze uppercase rtl:tracking-normal">{t.gallery.cats[w.category]}</span>
                    <span className="block font-display text-lg leading-tight font-bold uppercase sm:text-xl rtl:normal-case">{l(w.title)}</span>
                  </span>
                  <Maximize2 className="size-5 shrink-0 opacity-70 transition group-hover:opacity-100" aria-hidden="true" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>

        {!compare && (
          <p className="mt-6 flex gap-2 text-sm leading-relaxed text-fog">
            <Info className="mt-0.5 size-4 shrink-0 text-blaze" aria-hidden="true" />
            {t.gallery.disclaimer}
          </p>
        )}

        <div className="mt-12 flex justify-center">
          <Link to={path('/devis')} className="btn-blaze">
            {t.common.requestQuote}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Lightbox items={list} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  )
}
