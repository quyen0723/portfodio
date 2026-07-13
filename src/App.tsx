import { useEffect } from 'react'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useLanguage } from '@/hooks/useLanguage'
import { DEFAULT_ACCENT } from '@/lib/accents'
import { ScrollProgress } from '@/components/ScrollProgress'
import { NavBar } from '@/features/nav/NavBar'
import { Hero } from '@/features/hero/Hero'
import { About } from '@/features/about/About'
import { Journey } from '@/features/journey/Journey'
import { Philosophy } from '@/features/philosophy/Philosophy'
import { Work } from '@/features/work/Work'
import { Research } from '@/features/research/Research'
import { Awards } from '@/features/awards/Awards'
import { Skills } from '@/features/skills/Skills'
import { Beyond } from '@/features/beyond/Beyond'
import { Contact } from '@/features/contact/Contact'
import styles from './App.module.css'

// Section visibility (mirrors the original `showBeyond` design flag).
const SHOW_BEYOND = true

function Page() {
  const { locale } = useLanguage()

  // Keep the document language in sync for a11y / SEO.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className={styles.page} data-accent={DEFAULT_ACCENT}>
      <ScrollProgress />
      <NavBar />
      <main>
        <Hero />
        <About />
        <Journey />
        <Philosophy />
        <Work />
        <Research />
        <Awards />
        <Skills />
        {SHOW_BEYOND && <Beyond />}
        <Contact />
      </main>
    </div>
  )
}

export function App() {
  return (
    <LanguageProvider initial="vi">
      <Page />
    </LanguageProvider>
  )
}
