import { useEffect, useRef, type ReactNode } from 'react'
import { CircleDot, Disc3, Droplet, Hammer, ScanLine, Snowflake, Sparkles, SprayCan } from 'lucide-react'
import type { Category } from '../data/services'
import { useI18n } from '../i18n'

export function WhatsAppIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.04.72C5.78.72.69 5.8.69 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.01-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  )
}

const CATEGORY_ICONS = {
  maintenance: Droplet,
  brakes: Disc3,
  diagnostics: ScanLine,
  aircon: Snowflake,
  tyres: CircleDot,
  bodywork: Hammer,
  detailing: SprayCan,
  polishing: Sparkles,
}

export function CategoryIcon({ category, className = 'size-5' }: { category: Category; className?: string }) {
  const Icon = CATEGORY_ICONS[category]
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />
}

/** "À partir de 350 MAD · indicatif" or "Sur devis". Never a firm price. */
export function Price({ amount, size = 'md', className = '' }: { amount: number | null; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const { t, lang } = useI18n()
  const big = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'
  if (amount === null) {
    return (
      <span className={`block leading-tight ${className}`}>
        <span className={`font-display font-bold text-chalk uppercase ${big}`}>{t.common.onQuote}</span>
        <span className="mt-0.5 block text-xs text-fog">{t.common.afterDiagnosis}</span>
      </span>
    )
  }
  return (
    <span className={`block leading-tight ${className}`}>
      <span className="block text-xs text-fog">{t.common.from}</span>
      <span className={`font-display font-bold text-chalk ${big}`}>
        {new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR').format(amount)} {t.common.currency}
      </span>
      <span className="ms-2 inline-block border border-iron px-1.5 py-px align-middle text-[11px] font-semibold tracking-wider text-fog uppercase rtl:tracking-normal">
        {t.common.indicative}
      </span>
    </span>
  )
}

/** Fades children in once they scroll into view (disabled by prefers-reduced-motion in CSS). */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article'
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  id,
  className = '',
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  id?: string
  className?: string
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="tag">{eyebrow}</p>
      <h2 id={id} className="h-display mt-3 text-[2.4rem] leading-[0.95] text-balance sm:text-[3.4rem]">
        {title}
      </h2>
      {children}
    </div>
  )
}

/** Header band for inner pages. */
export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="bg-grid relative overflow-hidden border-b border-steel">
      <div className="stripes pointer-events-none absolute -end-10 top-0 h-full w-40 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="container-x relative pt-10 pb-10 sm:pt-16 sm:pb-14">
        <p className="tag">{eyebrow}</p>
        <h1 className="h-display animate-rise mt-3 max-w-4xl text-[2.8rem] leading-[0.92] text-balance sm:text-[4.4rem]">{title}</h1>
        {subtitle && <p className="animate-rise mt-5 max-w-2xl text-lg leading-relaxed text-fog [animation-delay:80ms]">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}

/** Large step number, e.g. "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0')
