import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { LANGS, LANG_LABELS, useI18n, type Lang } from '../i18n'
import { categories } from '../data/services'
import { phoneLink, whatsappLink } from '../lib/contact'
import { WhatsAppIcon } from './ui'

function Mark() {
  return (
    <svg viewBox="0 0 40 40" className="size-10 shrink-0" aria-hidden="true">
      <rect width="40" height="40" fill="#ff5a1f" />
      <path d="M7 31 19 9h6L13 31z" fill="#0d0e10" />
      <path d="M19 31 31 9h4L23 31z" fill="#0d0e10" />
    </svg>
  )
}

function Logo() {
  const { t, path } = useI18n()
  return (
    <Link to={path()} aria-label={t.nav.home} className="flex items-center gap-2.5" dir="ltr">
      <Mark />
      <span className="leading-none">
        <span className="block font-['Barlow_Condensed'] text-[1.55rem] font-extrabold tracking-wide text-chalk uppercase italic">
          Rif <span className="text-blaze">AutoCare</span>
        </span>
        <span className="mt-0.5 block font-['Barlow_Condensed'] text-[11px] font-semibold tracking-[0.25em] text-fog uppercase">Garage · Detailing · Al Hoceima</span>
      </span>
    </Link>
  )
}

function LangSwitcher({ onPick }: { onPick?: () => void }) {
  const { lang, t } = useI18n()
  const { pathname, search, hash } = useLocation()
  const swap = (to: Lang) => pathname.replace(/^\/(fr|ar|en)(?=\/|$)/, `/${to}`) + search + hash
  return (
    <nav aria-label={t.nav.language} className="flex items-center border border-steel">
      {LANGS.map((code) => (
        <Link
          key={code}
          to={swap(code)}
          onClick={onPick}
          lang={code}
          hrefLang={code}
          aria-current={code === lang ? 'true' : undefined}
          title={LANG_LABELS[code].name}
          className={`grid h-9 min-w-10 place-items-center px-2 font-display text-sm font-bold transition ${
            code === lang ? 'bg-chalk text-coal' : 'text-fog hover:text-chalk'
          }`}
        >
          {LANG_LABELS[code].short}
        </Link>
      ))}
    </nav>
  )
}

function DemoBanner() {
  const { t } = useI18n()
  return (
    <div className="relative overflow-hidden border-b border-steel bg-carbon">
      <p className="container-x flex min-h-8 items-center justify-center gap-2 py-1.5 text-center text-xs font-medium text-fog">
        <span className="stripes inline-block h-3 w-6 shrink-0" aria-hidden="true" />
        {t.banner}
      </p>
    </div>
  )
}

function Header() {
  const { t, path } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { to: path('/services'), label: t.nav.services, page: true },
    { to: path('/services#packs'), label: t.nav.packs },
    { to: path('/realisations'), label: t.nav.gallery, page: true },
    { to: path('/#methode'), label: t.nav.process },
    { to: path('/#faq'), label: t.nav.faq },
    { to: path('/#contact'), label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-coal/90 backdrop-blur-md">
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-3">
        <Logo />

        <nav aria-label={t.nav.main} className="hidden items-center xl:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `relative px-3.5 py-2 font-display text-[17px] font-semibold tracking-wide uppercase transition rtl:tracking-normal ${
                  isActive && link.page ? 'text-blaze' : 'text-chalk/85 hover:text-chalk'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden xl:block">
            <LangSwitcher />
          </div>
          <Link to={path('/devis')} className="btn-blaze hidden min-h-11 px-5 sm:inline-flex">
            {t.nav.cta}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="grid size-11 place-items-center border border-steel text-chalk xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-steel bg-coal xl:hidden">
          <nav aria-label={t.nav.main} className="container-x flex flex-col py-2">
            {links.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-steel/60 py-3.5 font-display text-2xl font-bold text-chalk uppercase italic last:border-0 rtl:not-italic"
              >
                <span>
                  <span className="me-3 text-sm text-blaze not-italic">{String(i + 1).padStart(2, '0')}</span>
                  {link.label}
                </span>
                <ArrowRight className="size-5 text-blaze rtl:rotate-180" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="container-x flex flex-wrap items-center justify-between gap-3 pb-5">
            <LangSwitcher onPick={() => setOpen(false)} />
            <Link to={path('/devis')} className="btn-blaze min-h-11 px-5 sm:hidden">
              {t.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function MobileBar() {
  const { t, path } = useI18n()
  const { pathname } = useLocation()
  const tel = phoneLink()
  if (pathname.endsWith('/devis')) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-steel bg-coal/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <Link to={path('/devis')} className="btn-blaze min-h-12 flex-1">
          {t.nav.cta}
        </Link>
        <a href={whatsappLink(t.contact.hello)} target="_blank" rel="noopener noreferrer" aria-label={t.contact.whatsappCta} className="btn-wa size-12 px-0">
          <WhatsAppIcon className="size-6" />
        </a>
        {tel && (
          <a href={tel} aria-label={t.contact.callCta} className="btn-line size-12 px-0">
            <Phone className="size-5" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  )
}

function Footer() {
  const { t, l, path } = useI18n()
  const tel = phoneLink()
  return (
    <footer className="relative mt-10 border-t border-steel bg-carbon pt-14 pb-28 text-fog md:pb-10">
      <div className="stripes absolute inset-x-0 top-0 h-1.5 opacity-80" aria-hidden="true" />
      <div className="container-x">
        <div className="cut flex flex-col gap-6 bg-blaze p-7 text-coal sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="h-display text-[2.3rem] leading-[0.95] text-balance sm:text-5xl">{t.home.ctaTitle}</p>
            <p className="mt-3 max-w-xl font-medium text-coal/80">{t.home.ctaText}</p>
          </div>
          <Link to={path('/devis')} className="btn-dark shrink-0">
            {t.nav.cta}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>
          <div>
            <p className="tag">{t.nav.services}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm md:grid-cols-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={path(`/services?cat=${c.id}`)} className="hover:text-chalk">
                    {l(c.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="tag">{t.footer.explore}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to={path('/devis')} className="hover:text-chalk">
                  {t.nav.cta}
                </Link>
              </li>
              <li>
                <Link to={path('/realisations')} className="hover:text-chalk">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <a href={whatsappLink(t.contact.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-chalk">
                  <WhatsAppIcon className="size-4" />
                  {t.contact.whatsappCta}
                </a>
              </li>
              {tel && (
                <li>
                  <a href={tel} className="inline-flex items-center gap-2 hover:text-chalk">
                    <Phone className="size-4" aria-hidden="true" />
                    {t.contact.callCta}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-2 border-t border-steel pt-6 text-xs leading-relaxed">
          <p className="font-semibold text-chalk">{t.legal.disclaimer}</p>
          <p>{t.legal.pricing}</p>
          <p className="max-w-3xl">{t.footer.concept}</p>
          <div className="flex flex-wrap justify-between gap-3 pt-3">
            <p>© {new Date().getFullYear()} Rif AutoCare — Concept Demo · {t.footer.photos}</p>
            <p>
              {t.footer.madeBy}{' '}
              <a href="https://innovatechs.vercel.app/" className="font-semibold text-chalk hover:text-blaze">
                Innovatechs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

/** Scrolls to the hash target, or to the top when the page changes. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export function Layout({ children }: { children?: ReactNode }) {
  const { t } = useI18n()
  return (
    <>
      <ScrollManager />
      <a href="#main" className="sr-only z-50 bg-blaze px-4 py-2 font-semibold text-coal focus:not-sr-only focus:fixed focus:start-3 focus:top-3">
        {t.nav.skip}
      </a>
      <DemoBanner />
      <Header />
      <main id="main">{children ?? <Outlet />}</main>
      <Footer />
      <MobileBar />
    </>
  )
}
