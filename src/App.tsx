import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { I18nProvider, isLang, type Lang } from './i18n'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Services } from './pages/Services'
import { Gallery } from './pages/Gallery'
import { Quote } from './pages/Quote'
import { NotFound } from './pages/NotFound'

function preferredLang(): Lang {
  const browser = navigator.language.slice(0, 2)
  return isLang(browser) ? browser : 'fr'
}

function LangRoot() {
  const { lang } = useParams()
  return isLang(lang) ? (
    <I18nProvider lang={lang}>
      <Layout />
    </I18nProvider>
  ) : (
    <I18nProvider lang="fr">
      <Layout>
        <NotFound />
      </Layout>
    </I18nProvider>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to={`/${preferredLang()}`} replace />} />
        <Route path=":lang" element={<LangRoot />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="realisations" element={<Gallery />} />
          <Route path="devis" element={<Quote />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
