import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ArrowRight, Camera, Car, CheckCircle2, ChevronDown, Pencil, RotateCcw, ShieldCheck, Trash2, X } from 'lucide-react'
import { categories, packs, services } from '../data/services'
import { useI18n } from '../i18n'
import {
  FUELS,
  PHOTO_TYPES,
  PROBLEM_MAX,
  SLOTS,
  STEP_FIELDS,
  buildMessage,
  emptyQuote,
  firstInvalidStep,
  needsDescription,
  prefill,
  serviceLabel,
  summaryRows,
  validate,
  type Errors,
  type Quote as QuoteData,
} from '../lib/quote'
import { whatsappLink } from '../lib/contact'
import { CategoryIcon, Price, WhatsAppIcon } from '../components/ui'

function Field({ id, label, error, hint, children }: { id: string; label: ReactNode; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-fog">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  return children ? (
    <p id={id} tabIndex={-1} className="field-error focus:outline-none">
      {children}
    </p>
  ) : null
}

function Progress({ step }: { step: number }) {
  const { t } = useI18n()
  const q = t.quote
  const total = q.steps.length
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-lg font-bold tracking-wide uppercase rtl:tracking-normal">
          <span className="text-blaze">{q.progress(step + 1, total)}</span> · {q.steps[step]}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-valuetext={`${q.progress(step + 1, total)} : ${q.steps[step]}`}>
        {q.steps.map((label, i) => (
          <div key={label}>
            <div className={`h-1.5 -skew-x-[30deg] transition-colors ${i <= step ? 'bg-blaze' : 'bg-steel'}`} />
            <p className={`mt-2 hidden font-display text-sm font-semibold uppercase sm:block ${i === step ? 'text-chalk' : 'text-fog'}`}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Quote() {
  const { t, l, lang, path } = useI18n()
  const [params] = useSearchParams()
  const [initial] = useState(() => prefill(params))
  const [data, setData] = useState<QuoteData>(() => ({ ...emptyQuote, services: initial.services }))
  const [errors, setErrors] = useState<Errors>({})
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const lastView = useRef('0-false')
  const q = t.quote

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Move focus to the step title when the step changes (not on first load).
  useEffect(() => {
    const view = `${step}-${done}`
    if (view === lastView.current) return
    lastView.current = view
    headingRef.current?.focus()
  }, [step, done])

  const set = <K extends keyof QuoteData>(key: K, value: QuoteData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleService = (id: string) => set('services', data.services.includes(id) ? data.services.filter((s) => s !== id) : [...data.services, id])

  const err = (key: keyof QuoteData) => (errors[key] ? q.errors[errors[key]!] : undefined)
  const aria = (key: keyof QuoteData, hint = false) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : hint ? `${key}-hint` : undefined,
  })

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    e.target.value = ''
    if (!f) return
    const meta = { name: f.name, type: f.type, size: f.size }
    const problem = validate({ ...data, photo: meta }, ['photo']).photo
    setErrors((prev) => ({ ...prev, photo: problem }))
    if (problem) return
    setFile(f)
    set('photo', meta)
  }

  const removePhoto = () => {
    setFile(null)
    set('photo', null)
    fileRef.current?.focus()
  }

  const focusFirst = (found: Errors) => {
    const key = STEP_FIELDS[step].find((k) => found[k]) ?? STEP_FIELDS.flat().find((k) => found[k])
    if (key) requestAnimationFrame(() => (formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`) ?? document.getElementById(`${key}-error`))?.focus())
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(data, STEP_FIELDS[step])
    setErrors(found)
    if (Object.values(found).some(Boolean)) return focusFirst(found)
    if (step < STEP_FIELDS.length - 1) {
      setStep(step + 1)
      return
    }
    // Final check across all steps (e.g. after "Edit").
    const all = validate(data)
    const bad = firstInvalidStep(all)
    if (bad >= 0) {
      setErrors(all)
      setStep(bad)
      return
    }
    setDone(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const restart = () => {
    setData(emptyQuote)
    setFile(null)
    setErrors({})
    setStep(0)
    setDone(false)
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const describe = needsDescription(data.services)

  if (done) {
    const message = buildMessage(data, t, lang)
    return (
      <section className="container-x grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="tag">{t.done.eyebrow}</p>
          <h1 ref={headingRef} tabIndex={-1} className="h-display mt-3 text-[2.8rem] leading-[0.92] text-balance focus:outline-none sm:text-6xl">
            {t.done.title}
          </h1>
          <p className="mt-4 max-w-2xl border-s-4 border-blaze ps-4 text-lg leading-relaxed text-chalk/90">{t.done.text}</p>

          <div className="cut mt-8 bg-[#0f2a1a] p-5 ring-1 ring-[#1f6b3d] sm:p-7">
            <div className="flex items-start gap-4">
              <WhatsAppIcon className="mt-1 size-8 shrink-0 text-[#4cd384]" />
              <div className="flex-1">
                <p className="font-display text-2xl font-bold uppercase rtl:normal-case">{t.done.whatsappTitle}</p>
                <p className="mt-1 text-chalk/80">{t.done.whatsappText}</p>
                {data.photo && <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#9ce8b9]"><Camera className="size-4" aria-hidden="true" />{t.done.photoReminder}</p>}
                <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn-wa mt-5 w-full sm:w-auto">
                  <WhatsAppIcon />
                  {t.done.openWhatsApp}
                </a>
              </div>
            </div>
          </div>

          <h2 className="mt-10 flex items-center gap-2 font-display text-2xl font-bold uppercase rtl:normal-case">
            <CheckCircle2 className="size-6 text-blaze" aria-hidden="true" />
            {t.done.recap}
          </h2>
          <dl className="panel mt-4 divide-y divide-steel px-5">
            {summaryRows(data, t, lang).map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 py-3.5 sm:flex-row sm:gap-6">
                <dt className="w-32 shrink-0 text-sm text-fog">{label}</dt>
                <dd className="font-semibold break-words">{value}</dd>
              </div>
            ))}
          </dl>
          {preview && <img src={preview} alt={q.photo} className="mt-4 h-40 w-auto border border-steel object-cover" />}

          <details className="mt-6 text-sm">
            <summary className="link-u cursor-pointer">{t.done.preview}</summary>
            <pre className="mt-3 border border-steel bg-carbon p-5 font-sans text-sm leading-relaxed whitespace-pre-wrap text-chalk/90">{message}</pre>
          </details>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setDone(false)} className="btn-line">
              <Pencil className="size-4" aria-hidden="true" />
              {t.done.edit}
            </button>
            <button type="button" onClick={restart} className="btn-line">
              <RotateCcw className="size-4" aria-hidden="true" />
              {t.done.restart}
            </button>
          </div>
        </div>

        <aside className="cut h-fit bg-graphite p-7 lg:sticky lg:top-24">
          <p className="tag">{t.done.nextTitle}</p>
          <ol className="mt-5 space-y-5">
            {t.done.next.map((s, i) => (
              <li key={s} className="flex gap-3 leading-relaxed text-chalk/85">
                <span className="font-display text-3xl leading-none font-extrabold text-blaze italic">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-6 border-t border-steel pt-5 text-xs leading-relaxed text-fog">{t.legal.pricing}</p>
        </aside>
      </section>
    )
  }

  return (
    <section className="container-x py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <p className="tag">{q.eyebrow}</p>
        <h1 className="h-display mt-3 text-[2.5rem] leading-[0.92] text-balance sm:text-6xl">{q.title}</h1>
        <p className="mt-3 text-fog">{q.subtitle}</p>
        <div className="mt-8">
          <Progress step={step} />
        </div>

        <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8">
          <h2 ref={headingRef} tabIndex={-1} className="sr-only">
            {q.progress(step + 1, q.steps.length)} : {q.steps[step]}
          </h2>

          {hasErrors && (
            <div role="alert" className="mb-5 flex items-center gap-3 border border-[#ff6b6b]/50 bg-[#ff6b6b]/10 p-4 text-sm font-semibold text-[#ffb3b3]">
              <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
              {q.errors.summary}
            </div>
          )}

          {step === 0 && (
            <fieldset aria-describedby={errors.services ? 'services-error' : 'services-hint'}>
              <legend className="font-display text-3xl font-bold uppercase italic rtl:not-italic">{q.servicesLabel}</legend>
              <p id="services-hint" className="mt-1 text-sm text-fog">
                {q.servicesHint}
              </p>
              <ErrorText id="services-error">{err('services')}</ErrorText>

              <div className="mt-4 flex min-h-11 flex-wrap items-center gap-2" aria-live="polite">
                <span className="font-display text-sm font-bold tracking-wider text-fog uppercase rtl:tracking-normal">{q.selected(data.services.length)}</span>
                {data.services.map((id) => (
                  <button key={id} type="button" onClick={() => toggleService(id)} className="inline-flex min-h-9 items-center gap-1.5 bg-blaze-soft px-3 text-sm font-semibold ring-1 ring-blaze/60 hover:bg-blaze/25">
                    {serviceLabel(id, t, lang)}
                    <X className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">({q.remove})</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {categories.map((c, ci) => {
                  const list = services.filter((s) => s.category === c.id)
                  const count = list.filter((s) => data.services.includes(s.id)).length
                  return (
                    <details key={c.id} open={initial.cat ? initial.cat === c.id : ci === 0} className="group panel">
                      <summary className="flex min-h-14 cursor-pointer items-center gap-3 px-4">
                        <span className="grid size-8 shrink-0 place-items-center bg-carbon text-blaze">
                          <CategoryIcon category={c.id} className="size-4" />
                        </span>
                        <span className="flex-1 font-display text-xl font-bold uppercase rtl:normal-case">{l(c.title)}</span>
                        {count > 0 && <span className="bg-blaze px-2 font-display text-sm font-bold text-coal">{count}</span>}
                        <ChevronDown className="size-5 text-fog transition group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2">
                        {list.map((s) => (
                          <label key={s.id} className="chip min-h-14 items-start justify-between py-2.5">
                            <span className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                                                checked={data.services.includes(s.id)}
                                onChange={() => toggleService(s.id)}
                                className="mt-1 size-4 shrink-0 accent-[#ff5a1f]"
                              />
                              <span className="leading-snug">{l(s.title)}</span>
                            </span>
                            <span className="shrink-0 text-xs text-fog">{s.priceFrom === null ? t.common.onQuote : `${t.common.from} ${s.priceFrom} ${t.common.currency}`}</span>
                          </label>
                        ))}
                      </div>
                    </details>
                  )
                })}
                <details open={initial.services.some((id) => id.startsWith('pack-'))} className="group panel">
                  <summary className="flex min-h-14 cursor-pointer items-center gap-3 px-4">
                    <span className="grid size-8 shrink-0 place-items-center bg-blaze text-coal">
                      <CategoryIcon category="detailing" className="size-4" />
                    </span>
                    <span className="flex-1 font-display text-xl font-bold uppercase rtl:normal-case">{q.packsGroup}</span>
                    <ChevronDown className="size-5 text-fog transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="grid gap-2 px-4 pb-4 sm:grid-cols-3">
                    {packs.map((p) => (
                      <label key={p.id} className="chip min-h-20 flex-col items-start justify-center gap-1 py-2.5">
                        <span className="flex items-center gap-2.5">
                          <input type="checkbox" checked={data.services.includes(p.serviceId)} onChange={() => toggleService(p.serviceId)} className="size-4 accent-[#ff5a1f]" />
                          <span className="font-display text-lg font-bold uppercase">{t.packs.items[p.id].name}</span>
                        </span>
                        <Price amount={p.priceFrom} size="sm" className="[&_.text-lg]:text-base" />
                      </label>
                    ))}
                  </div>
                </details>
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="space-y-5">
              <legend className="flex items-center gap-3 font-display text-3xl font-bold uppercase italic rtl:not-italic">
                <Car className="size-7 text-blaze" aria-hidden="true" />
                {q.steps[1]}
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="brand" label={q.brand} error={err('brand')}>
                  <input id="brand" name="brand" autoComplete="off" placeholder={q.brandPlaceholder} value={data.brand} onChange={(e) => set('brand', e.target.value)} className="field" {...aria('brand')} />
                </Field>
                <Field id="model" label={q.model} error={err('model')}>
                  <input id="model" name="model" autoComplete="off" placeholder={q.modelPlaceholder} value={data.model} onChange={(e) => set('model', e.target.value)} className="field" {...aria('model')} />
                </Field>
                <Field id="year" label={q.year} error={err('year')}>
                  <input id="year" name="year" inputMode="numeric" maxLength={4} placeholder="2016" dir="ltr" value={data.year} onChange={(e) => set('year', e.target.value.replace(/\D/g, ''))} className="field rtl:text-end" {...aria('year')} />
                </Field>
                <Field id="mileage" label={`${q.mileage} (${q.mileageUnit})`} error={err('mileage')}>
                  <input id="mileage" name="mileage" inputMode="numeric" maxLength={9} placeholder="120 000" dir="ltr" value={data.mileage} onChange={(e) => set('mileage', e.target.value.replace(/[^\d\s]/g, ''))} className="field rtl:text-end" {...aria('mileage')} />
                </Field>
              </div>
              <fieldset aria-describedby={errors.fuel ? 'fuel-error' : undefined}>
                <legend className="field-label">{q.fuel}</legend>
                <div className="flex flex-wrap gap-2">
                  {FUELS.map((f) => (
                    <label key={f} className="chip">
                      <input type="radio" name="fuel" value={f} checked={data.fuel === f} onChange={() => set('fuel', f)} className="sr-only" />
                      {q.fuels[f]}
                    </label>
                  ))}
                </div>
                <ErrorText id="fuel-error">{err('fuel')}</ErrorText>
              </fieldset>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-6">
              <legend className="font-display text-3xl font-bold uppercase italic rtl:not-italic">{q.steps[2]}</legend>
              <Field id="problem" label={describe ? q.problem : q.problemOptional} error={err('problem')} hint={q.problemHint}>
                <textarea id="problem" name="problem" rows={4} placeholder={q.problemPlaceholder} value={data.problem} onChange={(e) => set('problem', e.target.value)} className="field resize-y" {...aria('problem', true)} />
                <p className="mt-1 text-end text-xs text-fog" aria-hidden="true">
                  {data.problem.length}/{PROBLEM_MAX}
                </p>
              </Field>

              <div>
                <p className="field-label" id="photo-label">
                  {q.photo} <span className="font-normal text-fog">({q.optional})</span>
                </p>
                <input
                  ref={fileRef}
                  id="photo"
                  name="photo"
                  type="file"
                  accept={PHOTO_TYPES.join(',')}
                  onChange={onPhoto}
                  className="sr-only"
                  aria-labelledby="photo-label"
                  aria-describedby={errors.photo ? 'photo-error' : 'photo-hint'}
                />
                {preview && data.photo ? (
                  <div className="panel flex items-center gap-4 p-3">
                    <img src={preview} alt="" className="size-20 shrink-0 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{data.photo.name}</p>
                      <p className="text-sm text-fog">{(data.photo.size / 1024 / 1024).toFixed(1)} Mo</p>
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()} className="link-u text-sm">
                      {q.photoChange}
                    </button>
                    <button type="button" onClick={removePhoto} aria-label={q.photoRemove} className="grid size-11 place-items-center border border-steel text-fog hover:text-chalk">
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="photo" className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-iron bg-carbon p-4 text-center transition hover:border-blaze">
                    <Camera className="size-6 text-blaze" aria-hidden="true" />
                    <span className="font-display text-lg font-bold uppercase">{q.photoAdd}</span>
                  </label>
                )}
                {errors.photo ? (
                  <ErrorText id="photo-error">{err('photo')}</ErrorText>
                ) : (
                  <p id="photo-hint" className="mt-1.5 text-xs text-fog">
                    {q.photoHint} {q.photoNote}
                  </p>
                )}
              </div>

              <fieldset aria-describedby={errors.slot ? 'slot-error' : undefined}>
                <legend className="field-label">{q.slot}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {SLOTS.map((s) => (
                    <label key={s} className="chip">
                      <input type="radio" name="slot" value={s} checked={data.slot === s} onChange={() => set('slot', s)} className="sr-only" />
                      {q.slots[s]}
                    </label>
                  ))}
                </div>
                <ErrorText id="slot-error">{err('slot')}</ErrorText>
              </fieldset>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-5">
              <legend className="font-display text-3xl font-bold uppercase italic rtl:not-italic">{q.steps[3]}</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label={q.name} error={err('name')}>
                  <input id="name" name="name" autoComplete="name" value={data.name} onChange={(e) => set('name', e.target.value)} className="field" {...aria('name')} />
                </Field>
                <Field id="phone" label={q.phone} hint={q.phoneHint} error={err('phone')}>
                  <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={data.phone} onChange={(e) => set('phone', e.target.value)} className="field rtl:text-end" {...aria('phone', true)} />
                </Field>
              </div>
              <div>
                <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-chalk/85">
                  <input type="checkbox" name="consent" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#ff5a1f]" {...aria('consent')} />
                  {q.consent}
                </label>
                <ErrorText id="consent-error">{err('consent')}</ErrorText>
              </div>
              <p className="flex gap-2 text-xs leading-relaxed text-fog">
                <ShieldCheck className="size-4 shrink-0 text-blaze" aria-hidden="true" />
                {q.privacy}
              </p>
            </fieldset>
          )}

          <div className="sticky bottom-0 z-30 -mx-4 mt-8 flex gap-3 border-t border-steel bg-coal/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-line px-4">
                <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{q.back}</span>
              </button>
            ) : (
              <Link to={path('/services')} className="btn-line px-4">
                <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{t.nav.services}</span>
              </Link>
            )}
            <button type="submit" className="btn-blaze flex-1 sm:flex-none sm:px-10">
              {step === STEP_FIELDS.length - 1 ? q.submit : q.next}
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
