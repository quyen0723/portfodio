# Portfolio — Nguyễn Ngọc Mỹ Quyên

Portfolio cá nhân song ngữ (Tiếng Việt / English) — Software Engineer & Researcher.
Dựng lại production-grade từ thiết kế gốc, giữ nguyên 100% giao diện.

**Live:** https://quyen0723.github.io/portfodio/

## Tech stack

- **React 18 + TypeScript** (strict) + **Vite 6**
- Kiến trúc feature-based, component-per-file, design tokens (CSS variables)
- CSS Modules (scoped), không framework CSS
- i18n VI/EN qua React Context, 3 accent theme
- Ảnh tối ưu WebP (sharp), lazy-load, `width/height` chống CLS
- Deploy tự động lên GitHub Pages qua GitHub Actions

## Cấu trúc

```
src/
  components/      # UI atoms dùng chung (Button, Chip, Section, Eyebrow, …)
  features/        # Mỗi section 1 folder (hero, about, work, research, …)
  hooks/           # useLanguage, useReveal, useScrollProgress
  i18n/            # types + content.en/vi + LanguageContext
  lib/             # accents, asset resolver
  styles/          # tokens.css (source of truth) + global.css
scripts/           # optimize-assets.mjs (JPEG → WebP)
design/            # Thiết kế gốc tham chiếu (không ship)
```

## Scripts

```bash
npm run dev              # dev server
npm run build            # tsc -b && vite build  →  dist/
npm run preview          # xem thử bản build
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run optimize:assets  # tái tạo public/assets/*.webp từ assets/*.jpg
```

## Deploy

Mỗi lần push lên `main`, GitHub Actions build và publish `dist/` lên GitHub Pages.
`base` được đặt `/portfodio/` khi build production (xem `vite.config.ts`).
