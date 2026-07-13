import { en } from './content.en'
import { vi } from './content.vi'
import type { Locale, PortfolioContent } from './types'

export const CONTENT: Record<Locale, PortfolioContent> = { en, vi }

export type { Locale, PortfolioContent } from './types'
