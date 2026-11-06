import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Clock, MapPin, Phone, Plus } from 'lucide-react'
import { categories, imageSrc, works, type Category } from '../data/services'
import { useI18n } from '../i18n'
import { phoneLink, whatsappLink } from '../lib/contact'
import { BeforeAfter } from '../components/BeforeAfter'
import { PackCards } from '../components/Packs'
import { CategoryIcon, Reveal, SectionHeading, WhatsAppIcon, pad2 } from '../components/ui'

function QuickQuote() {
  const { t, l, path } = useI18n()
  const navigate = useNavigate()
  const [cat, setCat] = useState<Category>('maintenance')
  const h = t.home.hero

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate(path(`/devis?cat=${cat}`))
  }

  return (
    <form onSubmit={onSubmit} className="cut animate-rise border border-steel bg-coal/80 p-5 backdrop-blur-md [animation-delay:200ms] sm:p-6">
      <fieldset>
        <legend className="w-full">
          <span className="tag">{h.quickTitle}</span>
          <span className="mt-1.5 block font-display text-2xl font-bold uppercase italic rtl:not-italic">{h.quickText}</span>
        </legend>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <label key={c.id} className="chip min-h-12 px-3 text-sm">
              <input type="radio" name="quick-cat" value={c.id} checked={cat === c.id} onChange={() => setCat(c.id)} className="sr-only" />
              <CategoryIcon category={c.id} className="size-4 shrink-0 text-blaze" />
              <span className="leading-tight">{l(c.title)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn-blaze mt-4 w-full">
        {h.quickGo}
        <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
      </button>
    </form>
  )
}

function Hero() {
  const { t, path } = useI18n()
  const h = t.home.hero
  return (
    <section className="relative isolate overflow-hidden border-b border-steel">
      <img
        src="/images/hero-800.webp"
        srcSet="/images/hero-800.webp 800w, /images/hero-1600.webp 1600w"
        sizes="100vw"
        alt=""
        width={1600}
        height={1000}
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-coal via-coal/80 to-coal/30 lg:bg-gradient-to-r rtl:lg:bg-gradient-to-l" aria-hidden="true" />
      <div className="stripes absolute start-0 top-0 -z-10 h-1.5 w-1/3" aria-hidden="true" />

      <div className="container-x grid min-h-[calc(100svh-6.5rem)] items-end gap-10 pt-24 pb-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:py-20">
        <div>
          <p className="tag animate-rise">{h.eyebrow}</p>
          <h1 className="h-display animate-rise mt-4 text-[3.6rem] leading-[0.86] [animation-delay:60ms] sm:text-[5.6rem] lg:text-[6.6rem]">
            <span className="block">{h.title1}</span>
            <span className="block">{h.title2}</span>
            <span className="block text-blaze">{h.title3}</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-chalk/85 [animation-delay:120ms]">{h.text}</p>
          <div className="animate-rise mt-8 flex flex-col gap-3 [animation-delay:160ms] sm:flex-row">
            <Link to={path('/devis')} className="btn-blaze">
              {h.cta}
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link to={path('/services')} className="btn-line">
              {h.secondary}
            </Link>
          </div>
          <ul className="mt-8 grid gap-2.5 text-[15px] text-chalk/85 sm:grid-cols-3 sm:gap-4">
            {h.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-blaze" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <QuickQuote />
      </div>
    </section>
  )
}

function Categories() {
  const { t, l, path } = useI18n()
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="cat-title">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading id="cat-title" eyebrow={t.home.categoriesEyebrow} title={t.home.categoriesTitle}>
          <p className="mt-4 text-lg leading-relaxed text-fog">{t.home.categoriesText}</p>
        </SectionHeading>
        <Link to={path('/services')} className="btn-line shrink-0 self-start lg:self-auto">
          {t.common.seeServices}
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-10 grid gap-px border border-steel bg-steel sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal as="li" key={c.id} delay={(i % 4) * 60} className="bg-coal">
            <Link to={path(`/services?cat=${c.id}`)} className="group relative flex h-full flex-col overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={imageSrc(c.image)}
                  alt=""
                  width={640}
                  height={427}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover opacity-70 grayscale-[35%] transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
                <span className="absolute start-0 bottom-0 grid size-11 place-items-center bg-blaze text-coal">
                  <CategoryIcon category={c.id} className="size-5" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="font-display text-sm font-bold text-fog">{pad2(i + 1)}</span>
                <span className="mt-1 font-display text-2xl leading-tight font-bold uppercase italic rtl:not-italic">{l(c.title)}</span>
                <span className="mt-1.5 text-sm text-fog">{l(c.short)}</span>
                <ArrowRight className="mt-4 size-5 text-blaze transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function Packs() {
  const { t, path } = useI18n()
  return (
    <section id="packs" className="bg-grid border-y border-steel bg-carbon py-16 sm:py-24" aria-labelledby="packs-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading id="packs-title" eyebrow={t.home.packsEyebrow} title={t.home.packsTitle}>
            <p className="mt-4 text-lg leading-relaxed text-fog">{t.home.packsText}</p>
          </SectionHeading>
          <Link to={path('/services#packs')} className="link-u shrink-0">
            {t.home.packsCompare}
          </Link>
        </div>
        <div className="mt-10">
          <PackCards />
        </div>
      </div>
    </section>
  )
}

function GalleryPreview() {
  const { t, l, path } = useI18n()
  const featured = works.find((w) => w.id === 'gloss')!
  const thumbs = works.filter((w) => ['engine', 'tyres', 'foam'].includes(w.id))
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="gallery-title">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <SectionHeading id="gallery-title" eyebrow={t.home.galleryEyebrow} title={t.home.galleryTitle}>
            <p className="mt-4 leading-relaxed text-fog">{t.home.galleryText}</p>
          </SectionHeading>
          <ul className="mt-8 grid grid-cols-3 gap-2">
            {thumbs.map((w) => (
              <li key={w.id}>
                <Link to={path(`/realisations?cat=${w.category}`)} className="group block overflow-hidden" aria-label={l(w.title)}>
                  <img src={imageSrc(w.image)} alt="" width={640} height={427} loading="lazy" decoding="async" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
                </Link>
              </li>
            ))}
          </ul>
          <Link to={path('/realisations')} className="btn-line mt-6">
            {t.home.galleryCta}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
        <Reveal>
          <BeforeAfter image={featured.image} alt={l(featured.alt)} className="cut" />
        </Reveal>
      </div>
    </section>
  )
}

function Process() {
  const { t } = useI18n()
  return (
    <section id="methode" className="relative border-y border-steel bg-carbon py-16 sm:py-24" aria-labelledby="process-title">
      <div className="container-x">
        <SectionHeading id="process-title" eyebrow={t.home.processEyebrow} title={t.home.processTitle} />
        <ol className="mt-12 grid gap-px bg-steel sm:grid-cols-2 lg:grid-cols-4">
          {t.home.process.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90} className="relative bg-carbon p-6 sm:p-7">
              <span className="font-display text-7xl leading-none font-extrabold text-transparent italic [-webkit-text-stroke:1.5px_var(--color-blaze)]" aria-hidden="true">
                {pad2(i + 1)}
              </span>
              <h3 className="mt-4 font-display text-3xl font-bold uppercase italic rtl:not-italic">
                <span className="sr-only">{i + 1}. </span>
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-fog">{step.text}</p>
              {i < 3 && (
                <ArrowRight className="absolute end-5 top-7 hidden size-6 text-iron lg:block rtl:rotate-180" aria-hidden="true" />
              )}
            </Reveal>
          ))}
        </ol>
        <div className="mt-6 h-1 overflow-hidden bg-steel" aria-hidden="true">
          <div className="animate-scan h-full w-1/3 bg-blaze" />
        </div>
      </div>
    </section>
  )
}

export function Faq({ items, title, eyebrow }: { items: { q: string; a: string }[]; title: string; eyebrow: string }) {
  return (
    <div>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-10 border-t border-steel">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-steel">
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-start text-lg font-semibold">
              {item.q}
              <span className="chev grid size-9 shrink-0 place-items-center border border-steel text-blaze transition group-open:border-blaze">
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </summary>
            <p className="max-w-3xl pb-6 leading-relaxed text-fog">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

function Contact() {
  const { t } = useI18n()
  const c = t.contact
  const tel = phoneLink()
  return (
    <section id="contact" className="container-x pb-10" aria-labelledby="contact-title">
      <div className="grid border border-steel lg:grid-cols-2">
        <div className="bg-graphite p-7 sm:p-10">
          <SectionHeading id="contact-title" eyebrow={c.eyebrow} title={c.title} />
          <dl className="mt-8 space-y-6">
            <div className="flex gap-4">
              <dt className="grid size-11 shrink-0 place-items-center bg-blaze text-coal">
                <MapPin className="size-5" aria-hidden="true" />
                <span className="sr-only">{c.addressLabel}</span>
              </dt>
              <dd>
                <p className="font-semibold">
                  {c.address}{' '}
                  <span className="ms-1 border border-blaze px-1.5 py-px align-middle text-[11px] font-bold tracking-wider text-blaze uppercase rtl:tracking-normal">
                    {c.exampleTag}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-fog">{c.addressNote}</p>
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="grid size-11 shrink-0 place-items-center border border-steel text-blaze">
                <Clock className="size-5" aria-hidden="true" />
                <span className="sr-only">{c.hoursLabel}</span>
              </dt>
              <dd className="space-y-0.5">
                {c.hours.map((h) => (
                  <p key={h}>{h}</p>
                ))}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink(c.hello)} target="_blank" rel="noopener noreferrer" className="btn-wa">
              <WhatsAppIcon />
              {c.whatsappCta}
            </a>
            {tel && (
              <a href={tel} className="btn-line">
                <Phone className="size-5" aria-hidden="true" />
                {c.callCta}
              </a>
            )}
          </div>
        </div>
        <iframe
          title={c.mapTitle}
          src="https://www.openstreetmap.org/export/embed.html?bbox=-3.9560%2C35.2260%2C-3.9160%2C35.2500&layer=mapnik&marker=35.2370%2C-3.9370"
          loading="lazy"
          className="min-h-80 w-full border-0 grayscale-[60%] invert-[0.9] hue-rotate-180 lg:min-h-full"
        />
      </div>
    </section>
  )
}

export function Home() {
  const { t } = useI18n()
  return (
    <>
      <Hero />
      <Categories />
      <Packs />
      <GalleryPreview />
      <Process />
      <section id="faq" className="container-x max-w-5xl py-16 sm:py-24">
        <Faq items={t.home.faq} title={t.home.faqTitle} eyebrow={t.home.faqEyebrow} />
      </section>
      <Contact />
    </>
  )
}
