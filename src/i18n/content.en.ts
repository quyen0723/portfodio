import type { PortfolioContent } from './types'

export const en: PortfolioContent = {
  navAbout: 'About',
  navWork: 'Work',
  navResearch: 'Research',
  navAwards: 'Awards',
  navCta: 'Contact',
  langLabel: 'VI',

  heroEyebrow: 'Software Engineer',
  heroTitleA: 'I build products and',
  heroTitleB: 'learn every day.',
  heroSub:
    'I turn ideas into products, questions into research, and challenges into reasons to grow — using AI to work smarter, learning with joy, and going further with a team.',
  chips: [
    'Ho Chi Minh City',
    'M.Sc. in AI — in progress',
    'B.Eng. Software Engineering — Honours',
  ],
  ctaWork: 'View selected work',
  ctaContact: 'Get in touch',
  heroProof: ['2× Best Paper — ICE 2026', 'Golden Key Student — FSB 2025'],
  heroBadge: 'Available for new opportunities',

  aboutEyebrow: 'About',
  aboutTitle: 'Between product, engineering, and research.',
  aboutP1:
    'I started as a student who loved to code — and kept widening the circle. From building web and mobile products, to running Python/Linux backends, to integrating AI models and publishing peer-reviewed research.',
  aboutP2:
    'Today I work in the seam between product and engineering: translating fuzzy requirements into code-ready specifications, and using prompt engineering to move faster without lowering the bar.',
  aboutP3:
    "I hold a Software Engineering degree with Honours (FPT University) and I'm pursuing an M.Sc. in AI (FSB). I build products, learn through every project, explore research, and go further with a team — every day.",

  journeyEyebrow: 'Journey',
  journeyTitle: 'A path that keeps compounding.',
  journey: [
    {
      year: '2020–24',
      title: 'B.Eng. in Software Engineering',
      desc: 'FPT University, Cần Thơ — graduated with Honours.',
    },
    {
      year: '2022',
      title: 'MOS World Championship',
      desc: 'Mekong Delta regional champion (Viettel).',
    },
    {
      year: '2024',
      title: 'Student of Excellence + capstone',
      desc: 'Recognised by FPT University; capstone project featured on FPT Edu.',
    },
    {
      year: '2025',
      title: 'Golden Key & M.Sc. in AI',
      desc: "Joined FSB's M.Sc. (AI major); named Golden Key Student.",
    },
    {
      year: '2025→',
      title: 'Technical Team Lead',
      desc: 'Leading the Mega Dev team at Deutschfuns.',
    },
    {
      year: '2026',
      title: 'Published researcher',
      desc: '2× Best Paper (ICE) and a TDMU journal article.',
    },
  ],

  workEyebrow: 'Selected work',
  workTitle: "A few things I've worked on.",
  workIntro:
    "Two projects I contributed to — helping a team develop a real product, and taking part in shaping a platform's architecture.",
  lblProblem: 'The problem',
  lblApproach: 'My approach',
  lblHighlights: 'What I did',
  lblStack: 'Stack',
  lblImpact: 'Impact',
  lblMore: 'Selected engineering work',
  projects: [
    {
      tag: 'Product · Team Leader',
      year: '2025 – 2026',
      name: 'LMS Product Development',
      sub: 'Deutschfuns · German-learning LMS',
      problem:
        'A live LMS needed a steady flow of new features while staying stable ahead of major marketing campaigns.',
      approach:
        'Coordinated with the Founder, COO, Technical Manager and other departments to develop features — planning, splitting and managing team tasks, writing specs, and turning ideas into clear, actionable work for developers.',
      highlights: [
        'Coordinated Founder, COO, Technical Manager & cross-functional teams to plan features',
        "Split work and managed the team's tasks, translating ideas into clear tickets for devs",
        'Wrote product & technical specs (PRD) for new features',
        'Built features end-to-end — payment module, maintenance module, speaking-practice chatbox UI/UX, and more',
        'Owned quality through code review & merges, managed staging → production deploys, and led feature acceptance',
      ],
      stack: [
        'React',
        'Node.js',
        'NestJS',
        'PHP / WordPress',
        'Notion',
        'Asana',
        'Trello',
        'Lark',
        'Playwright',
      ],
      impact: 'Steady feature delivery · clear specs & transparent task ownership',
    },
    {
      tag: 'Personal Project · Architecture',
      year: '2026 – present',
      name: 'WeFocus — TOEIC Platform',
      sub: 'EdTech · personal project · in development',
      problem:
        'A TOEIC-practice platform needs a content-ingestion pipeline that stays reliable as the question bank scales.',
      approach:
        'Owned the architecture and a phased content-ingestion system (INGEST-0 → INGEST-5), with a scored architecture review and a resequenced roadmap.',
      highlights: [
        'Designed a phased ingestion pipeline: INGEST-0 → INGEST-5',
        'Ran an architecture review with scoring + a resequenced roadmap',
        'Laid the foundation for AI-assisted content at scale',
      ],
      stack: [
        'React 18',
        'Vite',
        'TypeScript',
        'Tailwind',
        'shadcn/ui',
        'TanStack Query',
        'Zustand',
        'Supabase',
      ],
      impact: 'A staged, reviewable roadmap',
    },
  ],
  moreWork: [
    {
      name: 'Ngẫm — a moment to reflect',
      desc: 'A playful web app: draw three reflection cards and receive a few gentle prompts. Built for fun.',
      link: 'https://targot.pages.dev/',
      linkLabel: 'Try it live',
    },
    {
      name: 'Product Specs & Documentation',
      desc: 'PRDs, technical and prompt specs that turn product ideas into clear, safe-to-build work for developers.',
    },
    {
      name: 'ORB — Online Register Notebook',
      desc: 'SEP490 capstone; led the React Native mobile app. Featured on FPT Edu.',
    },
    {
      name: 'Custom AI Skills & Automation',
      desc: 'Designing tailored AI skills for specific tasks — for accuracy and efficiency in day-to-day work — from meeting summaries to report automation with Node.js.',
    },
    {
      name: 'E-commerce Microservices',
      desc: 'A microservices architecture built on .NET 7 + SQL Server.',
    },
    {
      name: 'Food Image Classification',
      desc: 'Fine-tuned EfficientNetB0 for food-image recognition (computer vision).',
    },
  ],

  resEyebrow: 'Research & Publications',
  resTitle: 'Engineering with a research mindset.',
  resIntro:
    'An active publication record across AI, economics of technology, and applied machine learning — with two Best Paper awards.',
  resCap1: 'Best Paper Award — ICE 2026',
  resCap2: 'Presenting my research at ICE 2026',
  pubs: [
    {
      badge: '2× Best Paper',
      venue: 'ICE 2026 · Intl. Conference on Economics',
      role: 'Co-author',
      date: 'HUIT · Jun 2026',
      title:
        "Beyond the Device: B2G Ecosystems & Human-in-the-Loop Services for Care Robots in South Korea's Silver Economy",
    },
    {
      badge: 'Best Paper',
      venue: 'ICE 2026',
      role: 'Co-author',
      date: 'HUIT · Jun 2026',
      title:
        "State Capitalism in the AI Era: Assessing South Korea's Digital and Green New Deals",
    },
    {
      badge: 'Journal',
      venue: 'TDMU Journal · Vol 81, No 1 (2026)',
      role: 'Co-author',
      date: 'Apr 2026 · Scholar / Crossref / DOAJ',
      title:
        'Bayesian Networks for Supply-Chain Risk Forecasting — an analytical framework for green logistics in Greater Ho Chi Minh City',
    },
  ],

  awEyebrow: 'Awards & Recognition',
  awTitle: 'Recognised for results.',
  awIntro: 'A few achievements from my time as a student.',
  awards: [
    {
      org: 'FSB · Fall 2025',
      title: 'Golden Key Student',
      why: 'Recognition for top academic standing in the M.Sc. program (class MSA33HCM).',
      img: 'assets/golden-key.webp',
    },
    {
      org: 'FPT University · Summer 2024',
      title: 'Student of Excellence',
      why: 'Student Achievement Award for outstanding results across the engineering program.',
      img: 'assets/student-excellent.webp',
    },
    {
      org: 'Viettel 2022 · Mekong Delta',
      title: 'MOS World Championship',
      why: 'Regional champion of the Microsoft Office Specialist World Championship — precision under pressure.',
      img: 'assets/mos-team.webp',
    },
  ],
  awFootnote: '',

  skEyebrow: 'Capabilities',
  skTitle: 'What I bring to a team.',
  skills: [
    {
      domain: 'Product & Delivery',
      items: [
        'PRD & technical specs',
        'OKR / PERT planning',
        'Roadmaps & sprints',
        'Dev → Staging → Prod handover',
      ],
    },
    {
      domain: 'Engineering',
      items: [
        'React / React Native',
        'Node.js / NestJS',
        'PHP (WordPress / LearnDash)',
        'Python (Flask, ML)',
        'Java (Servlet / JSP)',
        'C# / .NET',
      ],
    },
    {
      domain: 'Artificial Intelligence',
      items: [
        'Prompt engineering',
        'Computer Vision (EfficientNetB0)',
        'Claude Code / Cursor / Codex',
        'Antigravity / GLM / GitHub Copilot',
        'Custom skills & automation',
      ],
    },
    {
      domain: 'Data & Infrastructure',
      items: [
        'SQL Server / MySQL / SQLite',
        'Supabase',
        'Redis tuning',
        'Linux (Ubuntu 24.04)',
        'Git / GitHub Actions CI/CD',
      ],
    },
    {
      domain: 'Quality & Testing',
      items: ['Playwright (E2E)', 'Manual QA', 'Test-case design'],
    },
  ],
  lblCerts: 'Certifications',
  lblLang: 'Languages',
  certs: [
    'CertNexus CEET (2023)',
    'PM Principles & Practices (2024)',
    'Academic English: Writing (2024)',
    'SDLC (2022)',
    'Web Design (2022)',
    'MOS — Word & PowerPoint',
  ],
  langBody:
    'Vietnamese — native. English — technical & academic writing; presented at the international ICE 2026 conference; actively advancing.',

  philEyebrow: 'Living creed',
  philLines: [
    'Learning is a joy — and a happiness.',
    'Meet everything with gratitude, respect, and a whole heart.',
    'Whatever life brings, smile brightly first.',
  ],

  byEyebrow: 'Beyond code',
  byTitle: 'Always up for a game.',
  byIntro:
    'Running events, a championship team, community races — I love playing all kinds of sports.',

  ctEyebrow: 'Contact',
  ctTitle: "Let's build something.",
  ctIntro:
    'Open to software engineering, research, and technical leadership opportunities. The fastest way to reach me is email.',
  socials: [
    { label: 'Email', handle: 'quyennnm.work@gmail.com', href: 'mailto:quyennnm.work@gmail.com' },
    { label: 'Phone', handle: '0967 733 121', href: 'tel:0967733121' },
    {
      label: 'LinkedIn',
      handle: 'in/quyen-nguyen',
      href: 'https://www.linkedin.com/in/quyen-nguyen-5560363a7/',
    },
    { label: 'GitHub', handle: 'quyen0723', href: 'https://github.com/quyen0723' },
    {
      label: 'ORCID',
      handle: '0009-0002-1025-2669',
      href: 'https://orcid.org/0009-0002-1025-2669',
    },
    {
      label: 'Facebook',
      handle: 'my.quyen.5249',
      href: 'https://www.facebook.com/my.quyen.5249',
    },
  ],
  footNote: 'Software Engineer · Loves research',
}
