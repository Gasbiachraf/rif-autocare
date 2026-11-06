import { useId, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { imageSrc, imageSrcSet } from '../data/services'
import { useI18n } from '../i18n'

/**
 * Before/after comparison. The "before" is an illustrative visual simulation of the same photo
 * (dull, dusty filter), clearly labelled as such. A native range input drives it: drag, tap,
 * or use the arrow keys / Home / End.
 */
export function BeforeAfter({ image, alt, className = '', priority = false }: { image: string; alt: string; className?: string; priority?: boolean }) {
  const { t } = useI18n()
  const [pos, setPos] = useState(50)
  const hintId = useId()
  const loading = priority ? 'eager' : 'lazy'

  return (
    <figure className={`relative isolate overflow-hidden bg-carbon select-none ${className}`} dir="ltr">
      <img src={imageSrc(image, 1200)} srcSet={imageSrcSet(image)} sizes="(min-width: 1024px) 60vw, 100vw" alt={alt} width={1200} height={800} loading={loading} decoding="async" className="aspect-[3/2] w-full object-cover" />

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden="true">
        <img src={imageSrc(image, 1200)} srcSet={imageSrcSet(image)} sizes="(min-width: 1024px) 60vw, 100vw" alt="" width={1200} height={800} loading={loading} decoding="async" className="look-before aspect-[3/2] w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgb(120_90_60/0.35),transparent_60%),radial-gradient(circle_at_75%_30%,rgb(90_80_70/0.3),transparent_55%)]" />
      </div>

      <span className="pointer-events-none absolute start-3 top-3 bg-coal/85 px-2.5 py-1 font-display text-sm font-bold tracking-wider uppercase" aria-hidden="true">
        {t.gallery.before} <span className="text-fog">· {t.gallery.simulated}</span>
      </span>
      <span className="pointer-events-none absolute end-3 top-3 bg-blaze px-2.5 py-1 font-display text-sm font-bold tracking-wider text-coal uppercase" aria-hidden="true">
        {t.gallery.after}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t.gallery.sliderLabel}
        aria-describedby={hintId}
        aria-valuetext={`${t.gallery.before} ${pos} % · ${t.gallery.after} ${100 - pos} %`}
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
      />
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-chalk" style={{ left: `${pos}%` }} aria-hidden="true" />
      <span
        className="pointer-events-none absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-chalk text-coal shadow-deep ring-blaze ring-offset-2 ring-offset-coal peer-focus-visible:ring-3"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      >
        <ChevronsLeftRight className="size-6" />
      </span>
      <figcaption id={hintId} className="sr-only">
        {t.gallery.sliderHint}
      </figcaption>
    </figure>
  )
}
