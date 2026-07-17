# 04 — Frontend Architecture

Đây là "trái tim" của hệ thống (vì gần như *toàn bộ* hệ thống là frontend). Ta phân tích: cấu trúc thư mục, layout, quản lý state, luồng dữ liệu, rendering, thiết kế component, hooks, context, và các design pattern — kèm **WHY** cho mỗi lựa chọn.

---

## 1. Nguyên tắc kiến trúc FE (WHY tổng)

Ba nguyên tắc định hình mọi thứ:

1. **Feature-based, không type-based rối:** UI dùng lại (`components/`) tách khỏi từng khối trang (`features/`). Mỗi feature là một "mảnh sản phẩm" tự chứa (component + style).
2. **Composition over configuration:** component nhỏ, ghép lại (`Section > Container > Reveal > atoms`), thay vì một component khổng lồ nhiều prop.
3. **Single source of truth:** thiết kế ở `tokens.css`; nội dung ở `i18n/`; đường dẫn ảnh qua `lib/asset.ts`. Không lặp giá trị.

## 2. Folder Structure (WHERE + vai trò)

```
src/
├── main.tsx              # Entry: mount React vào #root
├── App.tsx               # Composition root: Provider + thứ tự section
├── App.module.css        # style cấp trang (overflow-x clip, accent wrapper)
├── vite-env.d.ts         # types cho Vite (import.meta.env, *.module.css)
├── assets.manifest.json  # (sinh tự động) width/height ảnh → chống CLS
│
├── styles/               # HỆ THỐNG STYLE (nền tảng, không phụ thuộc gì)
│   ├── tokens.css        #   nguồn sự thật: màu/font/spacing/radius/shadow/accent
│   └── global.css        #   reset + base + .reveal + a11y + reduced-motion
│
├── lib/                  # TIỆN ÍCH THUẦN (không UI)
│   ├── accents.ts        #   danh sách accent theme + default
│   └── asset.ts          #   asset(): resolve path theo BASE_URL; assetSize(): dims
│
├── i18n/                 # TẦNG NỘI DUNG (dữ liệu + cung cấp qua Context)
│   ├── types.ts          #   "schema": PortfolioContent + sub-types
│   ├── content.en.ts     #   dữ liệu tiếng Anh (thỏa PortfolioContent)
│   ├── content.vi.ts     #   dữ liệu tiếng Việt (thỏa PortfolioContent)
│   ├── index.ts          #   CONTENT = { en, vi }
│   └── LanguageContext.tsx  # Provider: giữ locale, cấp content + toggle
│
├── hooks/                # LOGIC TÁI DÙNG (không render)
│   ├── useLanguage.ts    #   đọc LanguageContext (ném lỗi nếu ngoài Provider)
│   ├── useReveal.ts      #   reveal-on-scroll (1 IntersectionObserver chia sẻ)
│   └── useScrollProgress.ts # % cuộn trang (throttle bằng requestAnimationFrame)
│
├── components/           # UI ATOMS DÙNG CHUNG (không biết nội dung cụ thể)
│   ├── Section.tsx       #   band section: nền + nhịp dọc + Container + a11y
│   ├── Container.tsx     #   giới hạn bề rộng + gutter (default/narrow/tight)
│   ├── Reveal.tsx        #   bọc children, gắn useReveal
│   ├── Eyebrow.tsx       #   nhãn mono có gạch accent (light/dark, align, rule)
│   ├── SectionHeading.tsx#   tiêu đề serif (size sm/md/lg, tone)
│   ├── Button.tsx        #   nút/pill link (variant solid/dark/outline, size)
│   ├── Chip.tsx          #   pill viền (hero facts)
│   ├── MonoLabel.tsx     #   nhãn field nhỏ (tone label/faint/accent)
│   └── ScrollProgress.tsx#   thanh tiến trình đọc (dùng useScrollProgress)
│
└── features/             # CÁC KHỐI TRANG (mỗi section 1 folder)
    ├── nav/NavBar
    ├── hero/Hero
    ├── about/About
    ├── journey/Journey
    ├── philosophy/Philosophy
    ├── work/{Work, ProjectCard, MoreWorkList}
    ├── research/Research
    ├── awards/Awards
    ├── skills/Skills
    ├── beyond/Beyond
    └── contact/Contact
```

**Hướng phụ thuộc (dependency direction) — rất quan trọng:**

```
features/  ──►  components/  ──►  hooks/ , lib/ , styles(tokens)
   │                                  ▲
   └──────────────►  i18n/ (Context) ─┘   (i18n cắt ngang, cung cấp dữ liệu)
```

- Tầng dưới **không biết** tầng trên (styles/lib không import features). Đây là **acyclic dependency** — dấu hiệu kiến trúc lành mạnh, dễ test/tái dùng/không vòng lặp import.

## 3. Routing & Layout (WHY không có router)

- **Routing:** **không có React Router.** Đây là **one-page** với điều hướng bằng **anchor** (`#about`, `#work`…) + `scroll-behavior:smooth` + `scroll-margin-top`.
- **WHY:** chỉ có 1 "trang". Thêm router = thêm phụ thuộc & độ phức tạp cho thứ mà anchor giải quyết. Nếu sau này có nhiều trang (blog) ⇒ mới cần router/SSG.
- **Layout:** `App` là composition root: `<ScrollProgress/> + <NavBar/> + <main>{11 sections}</main>`, bọc trong `LanguageProvider`, wrapper mang `data-accent` để kích hoạt token accent.

## 4. State Management (WHAT / WHY / HOW)

Hai loại state, cố tình **không** dùng thư viện global:

| Loại | Ví dụ | Cơ chế | WHY |
|---|---|---|---|
| **Shared app state** | `locale` (vi/en) hiện tại | **React Context** (`LanguageProvider`) | Cần nhiều component đọc (NavBar + mọi section). Context vừa đủ, không cần Redux. |
| **Local UI state** | progress %, đã reveal chưa | `useState`/`useRef` trong hook | Cục bộ 1 component, không ai khác quan tâm ⇒ giữ tại chỗ. |

- **WHY không Redux/Zustand:** state toàn cục **chỉ có 1 biến** (ngôn ngữ). Redux/Zustand cho một biến là over-engineering (boilerplate/bundle). Nguyên tắc: **chọn công cụ state theo độ phức tạp state, không theo thói quen.**
- **HOW `LanguageProvider` tối ưu:** `toggle` bọc `useCallback` (định danh ổn định), giá trị context bọc `useMemo` phụ thuộc `[locale, toggle]` ⇒ tránh re-render thừa toàn cây khi parent render lại.

## 5. Data Flow (HOW — nội dung tới màn hình)

```
content.vi.ts / content.en.ts   (dữ liệu tĩnh, type-checked)
        │  index.ts: CONTENT = { en, vi }
        ▼
LanguageProvider  ──(useMemo)──►  { locale, content: CONTENT[locale], toggle }
        │  React Context
        ▼
useLanguage()  ◄── mỗi feature gọi để lấy `content` + `toggle`
        │
        ▼
Hero/About/…/Contact  render text từ `content`  →  React → DOM
```

- **Một chiều (unidirectional):** dữ liệu chảy xuống (Context → component), sự kiện đi lên (`toggle()` gọi từ NavBar → đổi `locale` → Context đổi → toàn bộ re-render với ngôn ngữ mới). Đây chính là mô hình React kinh điển, không có magic.

## 6. Rendering (WHAT / WHEN)

- **CSR:** `main.tsx` gọi `createRoot(#root).render(<StrictMode><App/></StrictMode>)`. DOM được dựng ở client sau khi JS tải.
- **Reveal:** phần tử bắt đầu `opacity:0` (class `.reveal` trong `global.css`); khi cuộn vào viewport, `IntersectionObserver` thêm `.is-visible` ⇒ fade/slide in. Nếu `prefers-reduced-motion` ⇒ hiện ngay, không animation.
- **Hệ quả cần biết (trade-off):** vì CSR, **HTML nguồn gần như rỗng**; nội dung chỉ xuất hiện sau khi JS chạy. Ảnh hưởng SEO với crawler yếu JS & first paint (đã bù bằng meta/OG/JSON-LD tĩnh trong `index.html`, bundle nhỏ). Xem `06`, `11`.

## 7. Component Design (design patterns — WHY)

- **Atoms tái dùng (`components/`):** `Section, Container, Eyebrow, SectionHeading, Button, Chip, MonoLabel, Reveal, ScrollProgress`. Mỗi cái **single-responsibility**, nhận `props` để biến thể (variant/size/tone) thay vì clone.
- **Container vs Presentational (biểu hiện nhẹ):**
  - *"Container/feature"*: `Awards`, `Work`… lấy dữ liệu từ `useLanguage()`, quyết định *render cái gì*.
  - *"Presentational"*: `ProjectCard`, `MoreWorkList`, các atoms — nhận props, chỉ lo *render thế nào*. Ví dụ rõ nhất: `Work` (container) tách `ProjectCard`/`MoreWorkList` (presentational) để giữ mỗi file < ~200 LOC và tách trách nhiệm.
- **Composition:** trang = `Section`(nền/nhịp) › `Container`(bề rộng) › `Reveal`(animation) › atoms(nội dung). Ghép, không cấu hình phức tạp.
- **Polymorphic nhẹ + variant props:** `Button` (`variant`, `size`), `SectionHeading` (`size`, `tone`), `Eyebrow` (`align`, `tone`, `rule`), `Section` (`bg`, `size`) — mở rộng bằng thêm biến thể, không sinh component mới.
- **Data-driven rendering:** section map qua mảng dữ liệu (`content.awards.map`, `content.projects.map`) ⇒ thêm 1 mục dữ liệu là UI tự mọc thêm; không sửa JSX.
- **Escape hatch có kiểm soát:** `Section` nhận `style` để override token (`--section-y`) cho Philosophy/Contact; `Awards` truyền `--poster-bg` (CSS var) để tạo nền blur poster. Dùng CSS variable làm "API" giữa TSX và CSS — sạch, không inline style rối.

## 8. Hooks (logic tách khỏi view — WHY)

| Hook | Trách nhiệm | Điểm kiến trúc |
|---|---|---|
| `useLanguage` | đọc Context, ném lỗi nếu dùng ngoài Provider | *fail fast* — lỗi lập trình lộ ngay, không "im lặng sai" |
| `useReveal` | gắn 1 phần tử vào **1 IntersectionObserver dùng chung (module singleton)** | tránh tạo hàng chục observer; tôn trọng reduced-motion; cleanup `unobserve` |
| `useScrollProgress` | tính % cuộn, **throttle bằng `requestAnimationFrame`** | không chặn main thread mỗi sự kiện scroll; cleanup listener/rAF |

- **WHY tách hook:** đóng gói logic web-API (observer, rAF, matchMedia) khỏi component ⇒ component thuần khai báo; logic test/tái dùng độc lập.

## 9. Context (i18n) — chi tiết HOW

- `LanguageContext` khởi tạo `null`; `LanguageProvider` giữ `locale` (mặc định `vi`), cấp `{ locale, content, toggle }`.
- `App` có `useEffect` đồng bộ `document.documentElement.lang = locale` ⇒ **accessibility/SEO** đúng theo ngôn ngữ hiển thị.
- **WHY Context (không prop-drilling):** nếu truyền `content` qua props sẽ phải xuyên nhiều tầng (App → main → mỗi section). Context giải đúng bài toán "nhiều nơi cần cùng dữ liệu ở sâu".

## 10. Reusable Components — bảng tham chiếu nhanh

| Component | Props chính | Dùng ở |
|---|---|---|
| `Section` | `bg`, `size`, `id`, `labelledBy`, `style` | mọi section (trừ Hero tự layout) |
| `Container` | `size`(default/narrow/tight), `padY` | trong Section & Hero |
| `Reveal` | `className`, `style` | bọc mọi khối cần animate |
| `Eyebrow` | `align`, `tone`, `rule` | nhãn đầu mỗi section |
| `SectionHeading` | `size`, `tone`, `id` | tiêu đề h2 |
| `Button` | `variant`, `size`, `href` | nav CTA, hero CTA |
| `Chip` / `MonoLabel` | (text) / `tone` | hero facts / nhãn field |

## 11. Quality Gate

- ✅ WHY cho: feature-based, không router, Context thay Redux, tách hook, CSS-var-as-API.
- ✅ Trade-off: CSR ⇒ HTML rỗng/SEO; nêu cách bù.
- ✅ Design patterns: composition, container/presentational, data-driven, variant props.
- ✅ Sơ đồ dependency direction (acyclic) — tư duy kiến trúc, không chỉ "file này gọi file kia".

**Đọc tiếp:** `05_Backend_Architecture.md` (vì sao "không backend" là một kiến trúc, không phải sự thiếu).
