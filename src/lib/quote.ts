import { findPack, findService, isCategory, packs, services, type Category } from '../data/services'
import { pick, type Lang } from '../i18n'
import type { Dict } from '../i18n/fr'

export const FUELS = ['petrol', 'diesel', 'hybrid', 'electric', 'lpg'] as const
export const SLOTS = ['asap', 'morning', 'afternoon', 'saturday'] as const
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const
export const PHOTO_MAX = 5 * 1024 * 1024
export const PROBLEM_MAX = 800
export const MIN_YEAR = 1980

export type Fuel = (typeof FUELS)[number]
export type Slot = (typeof SLOTS)[number]

/** What we keep about the optional photo (the File itself stays in the page). */
export interface PhotoMeta {
  name: string
  type: string
  size: number
}

export interface Quote {
  services: string[]
  brand: string
  model: string
  year: string
  mileage: string
  fuel: Fuel | ''
  problem: string
  photo: PhotoMeta | null
  slot: Slot | ''
  name: string
  phone: string
  consent: boolean
}

export type ErrorKey = keyof Dict['quote']['errors']
export type Errors = Partial<Record<keyof Quote, ErrorKey>>

export const emptyQuote: Quote = {
  services: [],
  brand: '',
  model: '',
  year: '',
  mileage: '',
  fuel: '',
  problem: '',
  photo: null,
  slot: '',
  name: '',
  phone: '',
  consent: false,
}

/** Fields validated at each of the 4 short steps. */
export const STEP_FIELDS: Array<Array<keyof Quote>> = [
  ['services'],
  ['brand', 'model', 'year', 'mileage', 'fuel'],
  ['problem', 'photo', 'slot'],
  ['name', 'phone', 'consent'],
]

const PACK_IDS = packs.map((p) => p.serviceId)
const KNOWN_IDS = new Set([...services.map((s) => s.id), ...PACK_IDS])

/** Cosmetic-only requests (detailing, polishing, packs) don't need a problem description. */
export function needsDescription(ids: string[]) {
  return ids.some((id) => {
    const s = findService(id)
    return s ? s.category !== 'detailing' && s.category !== 'polishing' : false
  })
}

export const digits = (v: string) => v.replace(/\D/g, '')
const validPhone = (v: string) => /^\+?[\d\s().-]+$/.test(v.trim()) && digits(v).length >= 9 && digits(v).length <= 15

export function validatePhoto(photo: PhotoMeta | null): ErrorKey | undefined {
  if (!photo) return undefined
  if (!(PHOTO_TYPES as readonly string[]).includes(photo.type.toLowerCase())) return 'photoType'
  if (photo.size > PHOTO_MAX) return 'photoSize'
  return undefined
}

export function validate(q: Quote, fields: Array<keyof Quote> = STEP_FIELDS.flat(), now: Date = new Date()): Errors {
  const all: Errors = {}

  if (!q.services.length || q.services.some((id) => !KNOWN_IDS.has(id))) all.services = 'services'

  if (q.brand.trim().length < 2 || q.brand.trim().length > 40) all.brand = 'brand'
  if (!q.model.trim() || q.model.trim().length > 40) all.model = 'model'
  const year = /^\d{4}$/.test(q.year.trim()) ? Number(q.year) : NaN
  if (!(year >= MIN_YEAR && year <= now.getFullYear() + 1)) all.year = 'year'
  const km = digits(q.mileage)
  if (!km || km.length > 7 || Number(km) > 1_500_000 || /[^\d\s.]/.test(q.mileage)) all.mileage = 'mileage'
  if (!q.fuel) all.fuel = 'fuel'

  const problem = q.problem.trim()
  if (problem.length > PROBLEM_MAX) all.problem = 'problemMax'
  else if (needsDescription(q.services) && problem.length < 10) all.problem = 'problem'
  const photo = validatePhoto(q.photo)
  if (photo) all.photo = photo
  if (!q.slot) all.slot = 'slot'

  if (q.name.trim().length < 2) all.name = 'name'
  if (!validPhone(q.phone)) all.phone = 'phone'
  if (!q.consent) all.consent = 'consent'

  const errors: Errors = {}
  for (const f of fields) if (all[f]) errors[f] = all[f]
  return errors
}

/** First step (0-3) holding an error, or -1. */
export function firstInvalidStep(errors: Errors) {
  return STEP_FIELDS.findIndex((fields) => fields.some((f) => errors[f]))
}

/** Pre-selection from the URL: ?service=a,b · ?pack=comfort · ?cat=brakes (opens that group). */
export function prefill(params: URLSearchParams): { services: string[]; cat: Category | null } {
  const ids = (params.get('service') ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter((id) => KNOWN_IDS.has(id))
  const pack = findPack(params.get('pack'))
  if (pack) ids.push(pack.serviceId)
  const raw = params.get('cat')
  const cat = isCategory(raw) ? raw : (findService(ids[0])?.category ?? (pack ? 'detailing' : null))
  return { services: [...new Set(ids)], cat }
}

export function serviceLabel(id: string, t: Dict, lang: Lang) {
  const s = findService(id)
  if (s) return pick(s.title, lang)
  const pack = findPack(id)
  return pack ? `${t.packs.pack} ${t.packs.items[pack.id].name}` : id
}

export function vehicleLabel(q: Quote, t: Dict, lang: Lang) {
  const km = digits(q.mileage)
  const parts = [`${q.brand.trim()} ${q.model.trim()}`.trim(), q.year.trim(), km ? `${new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR').format(Number(km))} km` : '', q.fuel ? t.quote.fuels[q.fuel] : '']
  return parts.filter(Boolean).join(' · ')
}

/** Label/value pairs for the recap screen and the WhatsApp message. */
export function summaryRows(q: Quote, t: Dict, lang: Lang): Array<[string, string]> {
  const w = t.wa
  const rows: Array<[string, string]> = [
    [w.services, q.services.map((id) => serviceLabel(id, t, lang)).join(', ')],
    [w.vehicle, vehicleLabel(q, t, lang)],
  ]
  if (q.problem.trim()) rows.push([w.problem, q.problem.trim()])
  if (q.photo) rows.push([w.photo, w.photoYes])
  rows.push([w.slot, q.slot ? t.quote.slots[q.slot] : ''])
  rows.push([w.name, q.name.trim()])
  rows.push([w.phone, q.phone.trim()])
  return rows
}

export function buildMessage(q: Quote, t: Dict, lang: Lang) {
  const sep = lang === 'fr' ? ' : ' : ': '
  return [t.wa.greeting, t.wa.intro, '', ...summaryRows(q, t, lang).map(([label, value]) => `• ${label}${sep}${value}`), '', t.wa.outro].join('\n')
}
