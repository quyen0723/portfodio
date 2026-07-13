import { useContext } from 'react'
import { LanguageContext } from '@/i18n/LanguageContext'

/** Access the active locale, its content bundle, and the language toggle. */
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
