import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { fr, type Dict } from './fr'
import { en } from './en'
import { ar } from './ar'

export const LANGS = ['fr', 'ar', 'en'] as const
export type Lang = (typeof LANGS)[number]
export type Localized = Record<Lang, string>

export const LANG_LABELS: Record<Lang, { short: string; name: string }> = {
  fr: { short: 'FR', name: 'Français' },
  ar: { short: 'ع', name: 'العربية' },
  en: { short: 'EN', name: 'English' },
}

export const DICTS: Record<Lang, Dict> = { fr, ar, en }

export function isLang(value: string | undefined): value is Lang {
  return LANGS.includes(value as Lang)
}

const I18nContext = createContext<Lang>('fr')

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = DICTS[lang].meta.title
  }, [lang])

  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>
}

/** Falls back to French if a localized value is empty: never shows a blank or a raw key. */
export const pick = (value: Localized, lang: Lang) => value[lang] || value.fr

export function useI18n() {
  const lang = useContext(I18nContext)
  return {
    lang,
    t: DICTS[lang],
    dir: lang === 'ar' ? ('rtl' as const) : ('ltr' as const),
    l: (value: Localized) => pick(value, lang),
    path: (to = '') => `/${lang}${to}`,
  }
}
