# 12 — Knowledge Map

Bản đồ khái niệm: từ source code này, bạn *đang chạm vào* những mảng kiến thức nào, và chúng nối với nhau ra sao. Dùng để biết "mình cần học/ôn gì" và "khái niệm này thuộc về đâu".

> Cách dùng: mỗi nhánh là một "cây kiến thức". Mục nào bạn thấy lạ ⇒ đưa vào roadmap (`13`). Mục có 📄 là **có thật trong repo** để bạn học từ ví dụ sống.

---

## 1. Bản đồ tổng (mối liên hệ giữa các mảng)

```
                         WEB PLATFORM (nền tảng)
                HTML ── CSS ── JavaScript ── DOM ── HTTP/HTTPS
                  │       │         │
                  │       │         └── ES Modules ── async/await ── Web APIs
                  │       │                              (IntersectionObserver 📄,
                  │       │                               requestAnimationFrame 📄,
                  │       │                               matchMedia/prefers-reduced-motion 📄,
                  │       │                               <img loading/lazy/fetchPriority> 📄)
                  │       └── CSS nâng cao: custom properties 📄, clamp() 📄, grid/flex 📄,
                  │                          aspect-ratio 📄, media queries 📄, CSS Modules 📄
                  ▼
             TYPESCRIPT ── types/interfaces 📄 ── generics 📄 ── strict mode 📄 ── project refs 📄
                  ▼
                REACT ── components/props 📄 ── state (useState) 📄 ── refs (useRef) 📄
                  │        ── hooks (useEffect/useMemo/useCallback) 📄 ── custom hooks 📄
                  │        ── Context 📄 ── reconciliation ── StrictMode 📄 ── CSR vs SSR/SSG
                  ▼
             BUILD/TOOLING ── Vite 📄 ── Rollup(bundle/tree-shake/code-split 📄/hashing 📄)
                  │            ── npm scripts 📄 ── ESLint(flat + a11y) 📄
                  ▼
             ARCHITECTURE ── feature-based 📄 ── design tokens 📄 ── composition 📄
                  │            ── container/presentational 📄 ── data-driven UI 📄
                  │            ── i18n 📄 ── static-first/JAMstack ── unidirectional data flow 📄
                  ▼
             PERFORMANCE ── Core Web Vitals (LCP/CLS/INP) ── image optim (WebP/sharp 📄)
                  │            ── lazy loading 📄 ── caching/CDN ── bundle budget
                  ▼
             DELIVERY ── Git 📄 ── CI/CD (GitHub Actions 📄) ── CDN/GitHub Pages 📄 ── base path 📄
                  ▼
             QUALITY ── Accessibility (WCAG/ARIA/semantics/focus 📄) ── SEO (meta/OG/JSON-LD 📄)
                        ── Security (XSS/escaping/noopener 📄/HTTPS/CSP)
```

## 2. Các "chuỗi khái niệm" nên nắm liền mạch

### Chuỗi React
```
JSX → component → props → state(useState) → effect(useEffect) →
memoization(useMemo/useCallback) → refs(useRef) → custom hooks →
Context(provider/consumer) → reconciliation/re-render → StrictMode →
CSR ↔ SSR ↔ SSG ↔ hydration (biết khác nhau, dù dự án chỉ dùng CSR)
```

### Chuỗi CSS/Design System
```
box model → flex/grid → responsive(media query, clamp) →
CSS custom properties(tokens) → theming([data-accent]) →
CSS Modules(scoping) → aspect-ratio/object-fit(cover vs contain) →
animation/transition → prefers-reduced-motion(a11y)
```

### Chuỗi TypeScript
```
type vs interface → union/enum → generics → utility types(Pick/Record) →
strictness(noUnusedLocals…) → module resolution(bundler) →
project references(app vs node) → JSON module import → typing CSS var(cast)
```

### Chuỗi Build & Delivery
```
ES Modules → bundler(Rollup) → tree-shaking → code-splitting(manualChunks) →
content hashing(cache-busting) → env(import.meta.env.BASE_URL) →
CI(Actions: build/artifact/deploy) → CDN(edge cache) → base path/subpath
```

### Chuỗi Performance
```
Core Web Vitals(LCP, CLS, INP) → image format(WebP/AVIF) → resize/compress(sharp) →
intrinsic size(width/height ⇒ no CLS) → lazy/priority hints →
bundle size budget → caching(immutable hashed assets)
```

### Chuỗi Web Platform APIs (dùng thật ở đây)
```
IntersectionObserver(reveal) → requestAnimationFrame(scroll throttle) →
matchMedia(reduced-motion) → History/anchor(#hash nav) → <img> loading/fetchpriority
```

## 3. Khái niệm "biết để phân biệt" (dù dự án không dùng)
- **CSR vs SSR vs SSG vs ISR vs hydration** — hiểu để biết *vì sao chọn CSR* và *khi nào đổi*.
- **REST/GraphQL, JWT/session/cookie, ORM/SQL, cache(Redis)** — hiểu để biết *vì sao hệ thống này không cần*, và *sẽ thêm ở đâu* nếu mở rộng (form/CMS/auth).
- **Islands architecture / edge functions / serverless** — hướng tiến hoá thêm "động" trên nền "tĩnh".

## 4. Bản đồ "khái niệm ↔ file trong repo"
| Khái niệm | Học từ file |
|---|---|
| Context/Provider | `i18n/LanguageContext.tsx`, `hooks/useLanguage.ts` |
| Custom hook + Web API | `hooks/useReveal.ts`, `hooks/useScrollProgress.ts` |
| Design tokens/theming | `styles/tokens.css` |
| CSS Modules + a11y | `styles/global.css`, `*.module.css` |
| Data-driven UI | `features/awards/Awards.tsx`, `features/work/*` |
| TS schema/generics | `i18n/types.ts`, `components/Button.tsx` |
| Build/base path | `vite.config.ts`, `lib/asset.ts` |
| Image pipeline | `scripts/optimize-assets.mjs`, `assets.manifest.json` |
| CI/CD | `.github/workflows/deploy.yml` |
| SEO/meta | `index.html` |

## 5. Quality Gate
- ✅ Bản đồ tổng + các chuỗi khái niệm liền mạch.
- ✅ Đánh dấu 📄 khái niệm có ví dụ sống trong repo.
- ✅ Nêu cả khái niệm "biết để phân biệt" (SSR/JWT/ORM) phục vụ tư duy kiến trúc.
- ✅ Bảng khái niệm ↔ file để học từ code thật.

**Đọc tiếp:** `13_Learning_Roadmap.md`.
