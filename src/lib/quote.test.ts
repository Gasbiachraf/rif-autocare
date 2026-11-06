import { describe, expect, it } from 'vitest'
import { fr } from '../i18n/fr'
import { en } from '../i18n/en'
import { ar } from '../i18n/ar'
import { CATEGORIES, categories, packs, services, works } from '../data/services'
import { PHOTO_MAX, STEP_FIELDS, buildMessage, emptyQuote, firstInvalidStep, needsDescription, prefill, summaryRows, validate, type Quote } from './quote'

const NOW = new Date(2026, 10, 6)

const complete: Quote = {
  services: ['brake-pads', 'obd-scan'],
  brand: 'Marque X',
  model: 'Berline 1.5',
  year: '2016',
  mileage: '128 500',
  fuel: 'diesel',
  problem: 'Bruit métallique au freinage depuis une semaine.',
  photo: null,
  slot: 'saturday',
  name: 'Yassine B.',
  phone: '+212 6 00 00 00 00',
  consent: true,
}

describe('validate', () => {
  it('accepts a complete request', () => {
    expect(validate(complete, undefined, NOW)).toEqual({})
  })

  it('only reports the fields of the current step', () => {
    expect(Object.keys(validate(emptyQuote, STEP_FIELDS[0], NOW))).toEqual(['services'])
    expect(Object.keys(validate(emptyQuote, STEP_FIELDS[1], NOW))).toEqual(['brand', 'model', 'year', 'mileage', 'fuel'])
    expect(Object.keys(validate(emptyQuote, STEP_FIELDS[2], NOW))).toEqual(['slot'])
    expect(Object.keys(validate(emptyQuote, STEP_FIELDS[3], NOW))).toEqual(['name', 'phone', 'consent'])
  })

  it('rejects unknown services', () => {
    expect(validate({ ...complete, services: ['teleportation'] }, ['services'], NOW).services).toBe('services')
  })

  it('checks the year and mileage', () => {
    expect(validate({ ...complete, year: '1975' }, ['year'], NOW).year).toBe('year')
    expect(validate({ ...complete, year: '2028' }, ['year'], NOW).year).toBe('year')
    expect(validate({ ...complete, year: '2027' }, ['year'], NOW)).toEqual({})
    expect(validate({ ...complete, mileage: '' }, ['mileage'], NOW).mileage).toBe('mileage')
    expect(validate({ ...complete, mileage: 'beaucoup' }, ['mileage'], NOW).mileage).toBe('mileage')
    expect(validate({ ...complete, mileage: '99999999' }, ['mileage'], NOW).mileage).toBe('mileage')
  })

  it('requires a description for mechanical work only', () => {
    expect(needsDescription(['brake-pads'])).toBe(true)
    expect(needsDescription(['interior', 'pack-comfort', 'ceramic'])).toBe(false)
    expect(validate({ ...complete, problem: 'bruit' }, ['problem'], NOW).problem).toBe('problem')
    expect(validate({ ...complete, services: ['pack-premium'], problem: '' }, ['problem'], NOW)).toEqual({})
    expect(validate({ ...complete, problem: 'x'.repeat(801) }, ['problem'], NOW).problem).toBe('problemMax')
  })

  it('validates the optional photo: image type and 5 MB max', () => {
    expect(validate({ ...complete, photo: { name: 'a.jpg', type: 'image/jpeg', size: 2_000_000 } }, ['photo'], NOW)).toEqual({})
    expect(validate({ ...complete, photo: { name: 'a.heic', type: 'image/heic', size: PHOTO_MAX } }, ['photo'], NOW)).toEqual({})
    expect(validate({ ...complete, photo: { name: 'a.pdf', type: 'application/pdf', size: 1000 } }, ['photo'], NOW).photo).toBe('photoType')
    expect(validate({ ...complete, photo: { name: 'a.png', type: 'image/png', size: PHOTO_MAX + 1 } }, ['photo'], NOW).photo).toBe('photoSize')
  })

  it('checks name, phone and consent', () => {
    expect(validate({ ...complete, phone: '0600' }, undefined, NOW).phone).toBe('phone')
    expect(validate({ ...complete, consent: false }, undefined, NOW).consent).toBe('consent')
    expect(validate({ ...complete, name: ' ' }, undefined, NOW).name).toBe('name')
  })

  it('finds the first step with an error', () => {
    expect(firstInvalidStep(validate({ ...complete, fuel: '' }, undefined, NOW))).toBe(1)
    expect(firstInvalidStep(validate(complete, undefined, NOW))).toBe(-1)
  })
})

describe('prefill', () => {
  it('reads services, packs and category from the URL', () => {
    expect(prefill(new URLSearchParams('service=brake-pads,nope'))).toEqual({ services: ['brake-pads'], cat: 'brakes' })
    expect(prefill(new URLSearchParams('pack=comfort'))).toEqual({ services: ['pack-comfort'], cat: 'detailing' })
    expect(prefill(new URLSearchParams('cat=aircon'))).toEqual({ services: [], cat: 'aircon' })
    expect(prefill(new URLSearchParams('cat=rockets'))).toEqual({ services: [], cat: null })
  })
})

describe('WhatsApp message', () => {
  it('summarises services, vehicle and problem in French', () => {
    const text = buildMessage({ ...complete, services: ['brake-pads', 'pack-comfort'] }, fr, 'fr')
    expect(text.startsWith('Bonjour Rif AutoCare,')).toBe(true)
    expect(text).toContain('• Services : Plaquettes de frein (par essieu), Pack Confort')
    expect(text).toMatch(/• Véhicule : Marque X Berline 1\.5 · 2016 · 128\s500 km · Diesel/)
    expect(text).toContain('• Problème : Bruit métallique au freinage')
    expect(text).toContain('• Créneau : Samedi')
    expect(text).not.toContain('Photo')
    expect(text).toContain('Merci de me répondre avec un devis indicatif.')
  })

  it('mentions the photo, and omits an empty problem', () => {
    const rows = summaryRows({ ...complete, problem: '', photo: { name: 'a.jpg', type: 'image/jpeg', size: 10 } }, fr, 'fr')
    expect(rows.map(([k]) => k)).toEqual(['Services', 'Véhicule', 'Photo', 'Créneau', 'Nom', 'Téléphone'])
  })

  it('is localised in English and Arabic', () => {
    expect(buildMessage(complete, en, 'en')).toContain('• Services: Brake pads (per axle), Fault code reading')
    expect(buildMessage(complete, ar, 'ar')).toContain('وسادات الفرامل')
  })
})

describe('content rules', () => {
  it('has 8 service tabs, each with services, and 3 comparable packs', () => {
    expect(categories.map((c) => c.id)).toEqual([...CATEGORIES])
    for (const c of CATEGORIES) expect(services.filter((s) => s.category === c).length).toBeGreaterThan(0)
    expect(packs.map((p) => p.id)).toEqual(['essential', 'comfort', 'premium'])
    expect(new Set(services.map((s) => s.id)).size).toBe(services.length)
  })

  it('every gallery category has at least one photo', () => {
    for (const cat of ['mechanics', 'tyres', 'bodywork', 'detailing']) expect(works.some((w) => w.category === cat)).toBe(true)
  })

  it('never claims firm prices, manufacturer warranty or partnerships', () => {
    const text = JSON.stringify({ services, categories, fr, en }).toLowerCase()
    for (const banned of ['prix fixe', 'prix ferme', 'garantie constructeur incluse', 'partenaire officiel', 'garage agréé', 'concessionnaire officiel', 'avis client :', '★']) {
      expect(text).not.toContain(banned)
    }
  })

  it('has the same dictionary shape in every language, with no empty string', () => {
    const keys = (o: object): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v).map((s) => `${k}.${s}`) : [k]))
    expect(keys(en).sort()).toEqual(keys(fr).sort())
    expect(keys(ar).sort()).toEqual(keys(fr).sort())
    for (const s of [...services, ...categories]) for (const v of Object.values(s.title)) expect(v.trim()).not.toBe('')
  })
})
