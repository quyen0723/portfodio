/** Content model for the portfolio. Both locales must satisfy `PortfolioContent`. */

export type Locale = 'en' | 'vi'

export interface JourneyItem {
  year: string
  title: string
  desc: string
}

export interface Project {
  tag: string
  year: string
  name: string
  sub: string
  problem: string
  approach: string
  highlights: string[]
  stack: string[]
  impact: string
}

export interface MoreWorkItem {
  name: string
  desc: string
  link?: string
  linkLabel?: string
}

export interface Publication {
  badge: string
  venue: string
  role: string
  date: string
  title: string
}

export interface Award {
  org: string
  title: string
  why: string
  /** Optimized image path under /public, or null for text-only cards. */
  img: string | null
  /** When true, show the full image at its natural aspect (no 16:10 crop). */
  poster?: boolean
}

export interface SkillGroup {
  domain: string
  items: string[]
}

export interface Social {
  label: string
  handle: string
  href: string
}

export interface PortfolioContent {
  // nav
  navAbout: string
  navWork: string
  navResearch: string
  navAwards: string
  navCta: string
  langLabel: string

  // hero
  heroEyebrow: string
  heroTitleA: string
  heroTitleB: string
  heroSub: string
  chips: string[]
  ctaWork: string
  ctaContact: string
  heroProof: string[]
  heroBadge: string

  // about
  aboutEyebrow: string
  aboutTitle: string
  aboutP1: string
  aboutP2: string
  aboutP3: string

  // journey
  journeyEyebrow: string
  journeyTitle: string
  journey: JourneyItem[]

  // work
  workEyebrow: string
  workTitle: string
  workIntro: string
  lblProblem: string
  lblApproach: string
  lblHighlights: string
  lblStack: string
  lblImpact: string
  lblMore: string
  projects: Project[]
  moreWork: MoreWorkItem[]

  // research
  resEyebrow: string
  resTitle: string
  resIntro: string
  resCap1: string
  resCap2: string
  pubs: Publication[]

  // awards
  awEyebrow: string
  awTitle: string
  awIntro: string
  awards: Award[]
  awFootnote: string

  // skills
  skEyebrow: string
  skTitle: string
  skills: SkillGroup[]
  lblCerts: string
  lblLang: string
  certs: string[]
  langBody: string

  // philosophy
  philEyebrow: string
  philLines: string[]

  // beyond
  byEyebrow: string
  byTitle: string
  byIntro: string

  // contact
  ctEyebrow: string
  ctTitle: string
  ctIntro: string
  socials: Social[]
  footNote: string
}
