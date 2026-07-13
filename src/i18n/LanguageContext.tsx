import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { CONTENT } from './index'
import type { Locale, PortfolioContent } from './types'

interface LanguageContextValue {
  locale: Locale
  content: PortfolioContent
  toggle: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  initial: Locale
  children: ReactNode
}

export function LanguageProvider({ initial, children }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>(initial)

  const toggle = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'vi' : 'en'))
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, content: CONTENT[locale], toggle }),
    [locale, toggle],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
