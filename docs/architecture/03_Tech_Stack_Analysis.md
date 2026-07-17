# 03 — Tech Stack Analysis

Với mỗi công nghệ: **Vai trò · Business/Technical value · Why chọn · Ưu · Nhược · Trade-off · Alternative (đổi thì khác gì) · Best practice · Common mistakes**. Mục tiêu: hiểu *tại sao*, không chỉ *biết dùng*.

> Nguyên tắc xuyên suốt: mỗi công nghệ được chọn để giải một **vấn đề cụ thể**. Nếu không có vấn đề đó, công nghệ đó là nợ. Đây là tư duy "fit-for-purpose".

---

## 1. React 18

- **Vai trò:** thư viện UI — mô tả giao diện theo *state → view* (declarative), quản lý cập nhật DOM hiệu quả qua reconciliation.
- **Vấn đề nó giải:** đồng bộ UI với dữ liệu (ngôn ngữ, trạng thái reveal) mà không phải thao tác DOM thủ công dễ lỗi.
- **Why chọn (ở dự án này):** thiết kế gốc vốn là bản export dạng React; component model phù hợp để tách 11 section + atoms tái dùng; hệ sinh thái + TypeScript hỗ trợ tốt.
- **Ưu:** declarative, component tái dùng, ecosystem khổng lồ, `IntersectionObserver`/hooks gói gọn logic.
- **Nhược:** cho một trang **tĩnh**, React là "búa tạ" — phải tải runtime (~140KB) chỉ để render nội dung không đổi. Đây là đánh đổi lớn nhất của dự án.
- **Trade-off:** DX + khả năng mở rộng ⇄ payload JS + phụ thuộc JS để thấy nội dung (ảnh hưởng SEO/first paint). Đã giảm thiểu bằng bundle nhỏ, code-split React vendor, meta tĩnh.
- **Alternative:**
  - **Vanilla HTML/CSS/JS / Astro / 11ty:** cho trang tĩnh này sẽ **nhẹ hơn và SEO tốt hơn** (HTML có sẵn, ít/không JS). Astro đặc biệt hợp (island architecture). Đổi lại: rời khỏi React model, ít "kỹ năng show-off" hơn cho một portfolio của kỹ sư React.
  - **Preact:** API tương thích, ~3KB — bù đúng nhược điểm payload; đổi lại lệch ecosystem nhỏ.
- **Best practice áp dụng:** component nhỏ, single-responsibility; `StrictMode`; tách hook; tránh `dangerouslySetInnerHTML` (an toàn XSS).
- **Common mistakes (đã tránh):** để logic reveal lặp ở mỗi component (đã gom vào 1 `IntersectionObserver` chia sẻ — `useReveal`); lạm dụng global store.

## 2. TypeScript (strict)

- **Vai trò:** thêm hệ kiểu tĩnh cho JS; ở đây còn đóng vai **"schema" cho nội dung**.
- **Vấn đề nó giải:** bắt lỗi cấu trúc dữ liệu **lúc build** (thiếu field, sai kiểu ảnh, quên `poster`), không phải lúc chạy trên máy người xem.
- **Why:** nội dung VI/EN phải **đồng cấu trúc** (cùng thỏa `PortfolioContent`). TS ép điều này — thêm giải thưởng mà quên field ⇒ `tsc` fail, CI chặn deploy.
- **Ưu:** an toàn refactor, tự-tài-liệu-hóa (đọc `types.ts` là hiểu mô hình dữ liệu), IDE autocomplete.
- **Nhược:** thêm bước biên dịch, learning curve generics; kiểu cho CSS custom property phải cast (`--poster-bg`).
- **Trade-off:** thời gian viết type ⇄ giảm bug runtime + tốc độ bảo trì. Với dữ liệu có cấu trúc (giải thưởng, dự án) ⇒ rất đáng.
- **Alternative:** JS thuần (nhanh lúc đầu, rủi ro về sau) hoặc JSDoc types (nhẹ hơn nhưng yếu hơn). Với schema nội dung đa mục ⇒ TS thắng.
- **Config đáng chú ý:** `strict`, `noUnusedLocals/Parameters`, `noUncheckedSideEffectImports`, `verbatimModuleSyntax`-tương đương qua `isolatedModules`; dùng **project references** (`tsconfig.app.json` cho `src`, `tsconfig.node.json` cho `vite.config.ts`).
- **Common mistakes (đã tránh):** dùng `any` (ESLint cấm `@typescript-eslint/no-explicit-any: error`); để type app và type Node lẫn nhau (đã tách 2 tsconfig).

## 3. Vite 6 (+ Rollup + @vitejs/plugin-react)

- **Vai trò:** dev server (ESM + HMR) và **bundler production** (qua Rollup).
- **Vấn đề nó giải:** biến TS/TSX/CSS Modules thành bundle tối ưu; dev nhanh; xử lý `base` path cho GitHub Pages; hash tên file để cache-busting.
- **Why:** nhanh (esbuild cho transform, Rollup cho bundle), cấu hình tối thiểu, chuẩn ESM hiện đại, tích hợp CSS Modules & asset sẵn.
- **Ưu:** HMR tức thì, tree-shaking, code-splitting, `manualChunks` tách React vendor (cache dài hạn), `import.meta.env.BASE_URL` cho base path.
- **Nhược:** dev (esbuild) và build (Rollup) là 2 công cụ khác nhau ⇒ hiếm khi có khác biệt hành vi cần lưu ý.
- **Trade-off:** so với **Next.js** — Vite không cho SSR/SSG/routing sẵn; nhưng dự án **không cần** những thứ đó, nên Vite gọn hơn. So với **Webpack/CRA** — Vite nhanh hơn nhiều, cấu hình ít hơn.
- **Alternative & khác biệt:**
  - **Next.js:** thêm SSR/SSG, file-based routing, image optimization — mạnh cho app nhiều trang/động; nhưng cho 1 trang tĩnh là thừa (nặng, build phức tạp, phải `output: export`).
  - **Parcel:** zero-config; ít quyền kiểm soát hơn.
- **Best practice áp dụng:** `base` chỉ set khi `command === 'build'` (dev vẫn `/`); `manualChunks` cho vendor; `reportCompressedSize:false` (build nhanh hơn).
- **Common mistakes (đã tránh):** hard-code `/assets/...` (sẽ vỡ ở subpath) → dùng `import.meta.env.BASE_URL` qua `asset()`.

## 4. CSS Modules + Design Tokens (CSS custom properties)

- **Vai trò:** hệ thống style — **tokens.css** là nguồn sự thật (màu, font, spacing, radius, shadow, motion); **`*.module.css`** cấp style scoped cho từng component.
- **Vấn đề nó giải:** (a) tránh xung đột tên class toàn cục (Modules hash tên); (b) một nơi đổi là toàn hệ đổi (tokens); (c) đổi theme (3 accent) chỉ bằng đổi biến trên `[data-accent]`.
- **Why (thay vì Tailwind/CSS-in-JS):**
  - **Zero runtime:** CSS thuần, không JS sinh style lúc chạy ⇒ tốt cho performance (khác styled-components/emotion).
  - **Pixel-perfect:** cần bám sát thiết kế gốc với giá trị chính xác (`clamp()`, letter-spacing…) — dễ hơn với CSS trực tiếp so với utility-class.
  - **Theming bằng CSS variables:** `--accent` đổi theo `data-accent` → cả cây con kế thừa, không cần re-render JS.
- **Ưu:** scoped, không xung đột, dễ đọc, hỗ trợ media query/`prefers-reduced-motion` gọn.
- **Nhược:** nhiều file `.module.css`; không có "utility velocity" như Tailwind cho prototyping nhanh.
- **Trade-off:** verbosity ⇄ kiểm soát & hiệu năng. Với yêu cầu pixel-perfect + theming ⇒ chọn Modules+tokens.
- **Alternative & khác biệt:**
  - **Tailwind:** prototyping nhanh, nhất quán spacing; nhưng markup rối class, khó match giá trị design lạ, cần build purge.
  - **styled-components/emotion:** co-locate style trong JS; nhưng có **runtime cost** và tăng bundle — ngược mục tiêu performance.
  - **Vanilla global CSS:** dễ xung đột tên ở quy mô nhiều component.
- **Best practice áp dụng:** không hard-code màu ngoài token; token phân tầng (semantic: `--color-ink`, `--accent`); `prefers-reduced-motion` tắt animation; focus ring `:focus-visible`.

## 5. sharp (build-time image pipeline)

- **Vai trò:** thư viện xử lý ảnh Node; trong `scripts/optimize-assets.mjs` biến JPEG lớn → WebP nhỏ, resize, và sinh `assets.manifest.json` (width/height).
- **Vấn đề nó giải:** ảnh gốc 2–5MB làm chậm tải & rớt điểm Lighthouse; thiếu width/height gây **CLS** (layout nhảy).
- **Why build-time (không runtime/CDN image service):** tối ưu **một lần**, người xem luôn nhận ảnh nhẹ, không phụ thuộc dịch vụ ảnh trả phí (Cloudinary/imgix), không tính toán lúc chạy.
- **Ưu:** rất nhanh (libvips), chất lượng tốt, giảm ~80% dung lượng; manifest cấp kích thước để đặt `width/height`/`aspect-ratio` chống CLS.
- **Nhược:** phải chạy script khi thêm ảnh; là devDependency có native binary (cài đặt nặng hơn).
- **Trade-off:** thao tác build thủ công ⇄ không cần hạ tầng ảnh động. Với số ảnh ít, cập nhật hiếm ⇒ hợp.
- **Alternative:** `vite-imagetools` (tối ưu khi import), dịch vụ CDN ảnh (responsive tự động, đắt & phụ thuộc ngoài), hoặc `<picture>` nhiều nguồn (chưa cần).
- **Best practice áp dụng:** cap cạnh dài (`MAX_EDGE`), quality ~80–88 (cao hơn cho ảnh nhiều chữ như poster), luôn ghi manifest để chống CLS.

## 6. ESLint (flat config) + plugins

- **Vai trò:** cổng chất lượng tĩnh — bắt lỗi/anti-pattern trước khi merge.
- **Cấu hình:** `@eslint/js` recommended + `typescript-eslint` + `react-hooks` + `react-refresh` + **`jsx-a11y`** (accessibility) + cấm `no-explicit-any`.
- **Why:** đảm bảo hooks đúng luật, JSX **accessible** (alt, aria), không `any`, không biến thừa → chất lượng đồng đều dù nhiều lần chỉnh sửa.
- **Trade-off:** đôi lúc "cằn nhằn" ⇄ chất lượng nhất quán. Đáng cho code muốn bền.
- **Common mistakes nó chặn:** quên `alt`, sai dependency array của hook, export lẫn lộn phá Fast Refresh.

## 7. GitHub Actions + GitHub Pages (CI/CD + Hosting)

- **Vai trò:** tự động **build & deploy**; phục vụ tĩnh qua CDN.
- **Why:** repo đã ở GitHub ⇒ không thêm nhà cung cấp; "push là deploy"; miễn phí; artifact-based deploy tách build/serve.
- **Ưu:** đơn giản, miễn phí, versioned theo commit, rollback = revert commit.
- **Nhược:** ít tính năng preview so với Vercel/Netlify (không auto preview URL cho PR); build agent chạy Node cần cấu hình.
- **Trade-off:** đơn giản & 0 chi phí ⇄ ít DX xa xỉ (preview deploy, edge functions). Với portfolio ⇒ hợp.
- **Alternative & khác biệt:**
  - **Vercel/Netlify:** preview mỗi PR, edge functions, analytics; nhưng thêm nhà cung cấp & có thể phát sinh phí.
  - **Cloudflare Pages:** CDN mạnh, workers; tương tự trade-off.

## 8. React DOM `createRoot` + StrictMode

- **Vai trò:** `createRoot` mount app (React 18 concurrent-ready); `StrictMode` bật kiểm tra kép ở dev để lộ side-effect không an toàn.
- **Why:** an toàn hiện đại; `StrictMode` giúp phát hiện hook không idempotent (đã đảm bảo `useReveal`/`useScrollProgress` cleanup đúng).

## 9. Bảng tổng hợp trade-off "chọn / không chọn"

| Đã chọn | Đã cân nhắc & bỏ | Lý do cốt lõi |
|---|---|---|
| Vite (CSR tĩnh) | Next.js (SSR/SSG) | Không cần server-render; muốn bundle nhỏ, cấu hình gọn |
| CSS Modules + tokens | Tailwind / CSS-in-JS | Pixel-perfect + theming bằng CSS var + zero runtime |
| Content-as-code (TS) | CMS / Database | Dữ liệu nhỏ, 1 người, muốn type-safe & Git-versioned |
| React Context (i18n) | Redux / Zustand | State quá nhỏ; tránh phụ thuộc thừa |
| sharp build-time | CDN image service | Tối ưu 1 lần, không phụ thuộc ngoài, 0 chi phí |
| GitHub Pages+Actions | Vercel / Netlify | Không thêm nhà cung cấp; push-to-deploy; free |
| React 18 | Astro / vanilla / Preact | Thiết kế gốc là React; DX & ecosystem; (đánh đổi payload) |

## 10. Quality Gate

- ✅ Mỗi công nghệ có Why/Pros/Cons/Trade-off/Alternative/Best-practice/Common-mistakes.
- ✅ Nêu rõ đánh đổi lớn nhất (React trên trang tĩnh) và các phương án thay thế thực tế.
- ✅ Bảng "chọn/không chọn" giúp thấy tư duy fit-for-purpose.

**Đọc tiếp:** `04_Frontend_Architecture.md`.
