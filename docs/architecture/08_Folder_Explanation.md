# 08 — Folder Explanation

Không chỉ "folder này chứa gì", mà **vai trò · quan hệ · dependency · WHY tổ chức như vậy**. Cấu trúc thư mục là "kiến trúc đông cứng thành file" — đọc nó là đọc tư duy tách bạch trách nhiệm.

---

## 1. Nguyên tắc tổ chức (WHY)

- **Tách "dùng chung" khỏi "đặc thù trang":** `components/` (atoms tái dùng, không biết nội dung) vs `features/` (khối trang cụ thể, biết nội dung).
- **Tách "logic" khỏi "hiển thị":** `hooks/` (hành vi) & `lib/` (tiện ích thuần) tách khỏi component.
- **Tách "dữ liệu" khỏi "trình bày":** `i18n/` giữ nội dung + schema; component chỉ tiêu thụ.
- **Tách "hệ thống thiết kế" ra nền:** `styles/` (tokens + global) là tầng đáy mọi thứ tham chiếu.
- **Kết quả:** dependency **một chiều, không vòng** (features → components → hooks/lib/styles; i18n cắt ngang cấp dữ liệu).

## 2. Từng folder

### `src/` (gốc ứng dụng)
- **Vai trò:** chứa toàn bộ mã nguồn chạy ở client.
- **File neo:** `main.tsx` (điểm vào, mount React), `App.tsx` (composition root), `vite-env.d.ts` (khai báo type cho Vite & CSS Modules), `assets.manifest.json` (sinh tự động).
- **Quan hệ:** `main` → `App` → `features` + `components` + `i18n`.

### `src/styles/` — Hệ thống thiết kế (tầng đáy)
- **Vai trò:** nguồn sự thật hình ảnh. `tokens.css` = biến (màu/font/spacing/radius/shadow/motion + 3 accent theme). `global.css` = reset, base typography, primitive `.reveal`, a11y (`:focus-visible`, `sr-only`), `prefers-reduced-motion`.
- **Dependency:** **không phụ thuộc gì** (tầng đáy). Mọi CSS Module tham chiếu biến từ đây.
- **WHY tách riêng:** đổi thương hiệu/theme = sửa 1 file; đảm bảo nhất quán; tránh "magic number" rải rác.

### `src/lib/` — Tiện ích thuần (pure, không UI)
- `asset.ts`: `asset(path)` ghép `BASE_URL` (đúng cả dev `/` và prod `/portfodio/`); `assetSize(path)` đọc `manifest` trả `{width,height}`.
- `accents.ts`: mảng accent hợp lệ + `DEFAULT_ACCENT` + nhãn.
- **Dependency:** `asset.ts` import `assets.manifest.json`. Không import component.
- **WHY:** logic "đường dẫn/kích thước ảnh" và "theme" là **thuần**, tách khỏi React ⇒ test dễ, tái dùng, đổi base path 1 chỗ.

### `src/i18n/` — Tầng nội dung + cung cấp
- `types.ts`: **schema** `PortfolioContent` + sub-types (`Project`, `Award`, `Publication`, `SkillGroup`, `Social`, `Locale`…). Đây là "hợp đồng dữ liệu".
- `content.en.ts` / `content.vi.ts`: hai bản dữ liệu **phải thỏa** `PortfolioContent`.
- `index.ts`: gộp `CONTENT = { en, vi }`.
- `LanguageContext.tsx`: `LanguageProvider` (giữ `locale`, cấp `content`+`toggle`) + `LanguageContext`.
- **Dependency:** content → types; index → content; Provider → index + types. Được `hooks/useLanguage` đọc và `features/*` tiêu thụ.
- **WHY gom vào một folder:** nội dung, schema, và cơ chế phân phối (Context) là **một mối quan tâm** (i18n/CMS-nhẹ) ⇒ đặt cạnh nhau để dễ tiến hoá (đổi sang CMS chỉ động vào đây).

### `src/hooks/` — Hành vi tái dùng
- `useLanguage.ts`: cổng đọc Context (fail-fast nếu ngoài Provider).
- `useReveal.ts`: reveal-on-scroll với **1 IntersectionObserver singleton** chia sẻ; tôn trọng reduced-motion.
- `useScrollProgress.ts`: % cuộn, throttle bằng `requestAnimationFrame`.
- **Dependency:** `useLanguage` → i18n Context. `useReveal`/`useScrollProgress` → chỉ Web API + React.
- **WHY:** đóng gói logic web-platform khỏi component; component chỉ khai báo.

### `src/components/` — Atoms dùng chung (design system layer)
- `Section, Container, Reveal, Eyebrow, SectionHeading, Button, Chip, MonoLabel, ScrollProgress` + `*.module.css`.
- **Đặc điểm:** **không biết** nội dung cụ thể; biến thể qua props (`variant/size/tone/bg`).
- **Dependency:** → `styles` (biến), → `hooks` (Reveal dùng useReveal, ScrollProgress dùng useScrollProgress). **Không** import `features`.
- **WHY:** tái dùng xuyên section; sửa 1 atom → đồng bộ toàn site; tránh trùng lặp UI.

### `src/features/` — Các khối trang (product slices)
- Mỗi section một folder: `nav, hero, about, journey, philosophy, work, research, awards, skills, beyond, contact`. `work/` tách thêm `ProjectCard`, `MoreWorkList` (presentational con).
- **Đặc điểm:** lấy dữ liệu qua `useLanguage()`, lắp bằng atoms từ `components/`.
- **Dependency:** → `components`, → `hooks/useLanguage`, → `lib/asset`. Các feature **độc lập với nhau** (không import chéo).
- **WHY feature-based:** mỗi khối là đơn vị dễ hiểu/sửa/xoá độc lập; đọc tên folder là biết bản đồ trang; mở rộng = thêm folder.

### `public/` — Tài sản tĩnh phục vụ nguyên trạng
- `assets/*.webp` (ảnh đã tối ưu, được deploy), `favicon.svg`.
- **WHY `public` (không `src/assets` import):** ảnh được tham chiếu **động** bằng chuỗi path trong dữ liệu (`award.img`) ⇒ đặt ở `public` và resolve qua `asset()` gọn hơn import tĩnh; Vite copy nguyên trạng, URL ổn định theo `BASE_URL`.

### `scripts/` — Công cụ build-time (không chạy runtime)
- `optimize-assets.mjs`: JPEG → WebP + `manifest.json`.
- **WHY tách khỏi `src`:** đây là công cụ tác vụ (Node, không phải mã client); ESLint bỏ qua; chạy qua `npm run optimize:assets`.

### `.github/workflows/` — CI/CD
- `deploy.yml`: build & deploy Pages (xem `02`/`05`).

### `design/` (không deploy, tham chiếu)
- Thiết kế gốc (`Portfolio.dc.html`, `support.js`, scraps). `.gitignore` loại khỏi repo/deploy. **Vai trò:** nguồn sự thật thiết kế lịch sử để đối chiếu pixel-perfect; không phải mã chạy.

### File cấu hình gốc
- `vite.config.ts` (base path, plugin react, alias `@`, manualChunks), `tsconfig*.json` (project references: app vs node), `eslint.config.js` (flat config + a11y), `package.json` (scripts/deps).

## 3. Sơ đồ quan hệ & hướng phụ thuộc

```
                         ┌───────────────┐
       (dữ liệu) ───────►│    i18n/      │◄─ useLanguage (hooks)
                         └──────┬────────┘
 features/ ──► components/ ──► hooks/ , lib/ ──► styles/ (tokens)   [đáy]
     │            │                                   ▲
     └──── asset() (lib) ──────────────────────────────┘
     └──── ảnh: public/assets/*.webp  (resolve qua BASE_URL)

Quy tắc: mũi tên chỉ 1 chiều. Không có vòng. Tầng dưới không biết tầng trên.
```

## 4. "Vì sao không gom hết vào ít folder?" (trade-off)

- Có thể để mọi thứ trong `src/` phẳng. Nhưng với 11 section + atoms + hooks + i18n, cấu trúc phẳng gây "file soup". Feature-based + layered giúp **định vị nhanh** (muốn sửa Awards → `features/awards/`), **giảm tải nhận thức**, và **ép ranh giới** (import sai hướng lộ ra ngay).
- **Đánh đổi:** nhiều folder/file nhỏ hơn ⇄ dễ điều hướng & bảo trì. Ở quy mô này, lợi > hại.

## 5. Quality Gate

- ✅ Mỗi folder có vai trò + dependency + WHY.
- ✅ Sơ đồ hướng phụ thuộc (acyclic).
- ✅ Trade-off của cách tổ chức.
- ✅ Giải thích lựa chọn tinh tế: `public` vs `src/assets`, tách `scripts`, project references.

**Đọc tiếp:** `09_Code_Reading_Guide.md`.
