/** Accent theme identifiers — map 1:1 to the `data-accent` selectors in tokens.css. */
export const ACCENTS = ['royal-blue', 'ink-slate', 'deep-emerald'] as const

export type Accent = (typeof ACCENTS)[number]

export const DEFAULT_ACCENT: Accent = 'royal-blue'

export const ACCENT_LABELS: Record<Accent, string> = {
  'royal-blue': 'Royal Blue',
  'ink-slate': 'Ink Slate',
  'deep-emerald': 'Deep Emerald',
}
