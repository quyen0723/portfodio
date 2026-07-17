# 10 — Architecture Decision Record (ADR)

Mỗi ADR ghi: **Context/Problem · Decision · Why · Alternatives · Trade-off · Pros · Cons · Status**. Đây là "hộp đen" của kiến trúc — vì sao nó thành hình như hiện tại. Khi ai đó hỏi "sao không dùng X?", câu trả lời nằm ở đây.

---

## ADR-001 — Static SPA (CSR) thay vì SSR/SSG server-render
- **Context/Problem:** portfolio đọc-nhiều, ghi-hiếm, nội dung không cá nhân hoá. Cần nhanh, rẻ, bền, dễ bảo trì bởi 1 người.
- **Decision:** build một bundle tĩnh (React CSR) và phục vụ qua CDN.
- **Why:** không có compute-per-request; CDN cho độ trễ thấp, khả dụng cao, chi phí ~0, bề mặt tấn công tối thiểu.
- **Alternatives:** Next.js SSR/SSG; Astro (islands); vanilla/11ty.
- **Trade-off:** mất SSR ⇒ HTML nguồn gần rỗng (ảnh hưởng SEO với crawler yếu JS & first paint). Bù bằng meta/OG/JSON-LD tĩnh + bundle nhỏ + LCP tối ưu.
- **Pros:** đơn giản vận hành, rẻ, scale/CDN sẵn.
- **Cons:** phụ thuộc JS để thấy nội dung; không personalization.
- **Status:** ✅ Accepted. (Nếu cần SEO tối đa hoặc nhiều trang ⇒ cân nhắc Astro/Next SSG — xem ADR-011.)

## ADR-002 — Content-as-code (TypeScript) thay vì CMS/Database
- **Problem:** cần nơi giữ nội dung có cấu trúc, ít thay đổi, 1 người quản lý, muốn an toàn kiểu.
- **Decision:** nội dung nằm trong `content.{vi,en}.ts` thoả `PortfolioContent`; Git là lưu trữ/lịch sử.
- **Why:** TS làm schema-validator (sai cấu trúc fail lúc build); không cần hạ tầng DB/CMS; diff/PR review nội dung như code.
- **Alternatives:** Headless CMS (Sanity/Contentful), DB (Supabase), Markdown + frontmatter.
- **Trade-off:** người phi kỹ thuật khó sửa; đổi nội dung phải build lại.
- **Pros:** type-safe, zero hạ tầng, versioned, atomic với code.
- **Cons:** không có editor GUI; coupling nội dung–build.
- **Status:** ✅ Accepted. (Chuyển CMS khi có biên tập viên phi kỹ thuật.)

## ADR-003 — CSS Modules + Design Tokens thay vì Tailwind / CSS-in-JS
- **Problem:** cần bám thiết kế pixel-perfect, hỗ trợ theming (3 accent), hiệu năng tốt, không xung đột class.
- **Decision:** `tokens.css` (CSS custom properties) là nguồn sự thật; `*.module.css` scoped cho component.
- **Why:** zero-runtime CSS (tốt performance); theming bằng biến CSS trên `[data-accent]` không cần re-render JS; giá trị thiết kế "lạ" (clamp, letter-spacing) dễ biểu đạt trực tiếp.
- **Alternatives:** Tailwind (utility), styled-components/emotion (CSS-in-JS), global CSS.
- **Trade-off:** nhiều file CSS; không có "utility velocity".
- **Pros:** scoped, zero runtime, theming sạch, pixel-perfect.
- **Cons:** verbose hơn Tailwind cho prototyping.
- **Status:** ✅ Accepted.

## ADR-004 — React Context cho i18n thay vì Redux/Zustand
- **Problem:** nhiều component cần biết ngôn ngữ hiện tại + hàm đổi.
- **Decision:** `LanguageProvider` (Context) cấp `{locale, content, toggle}`.
- **Why:** state toàn cục **chỉ 1 biến**; Context là công cụ chuẩn cho "nhiều nơi cần cùng dữ liệu sâu"; tránh boilerplate/bundle của store.
- **Alternatives:** Redux Toolkit, Zustand, Jotai, prop-drilling.
- **Trade-off:** Context re-render cả subtree khi đổi (đã giảm bằng `useMemo`/`useCallback`); không có devtools/middleware như Redux.
- **Pros:** không phụ thuộc ngoài, đủ dùng, đơn giản.
- **Cons:** không lý tưởng nếu state lớn/nhiều mảnh (chưa xảy ra).
- **Status:** ✅ Accepted.

## ADR-005 — Build-time image optimization (sharp) thay vì runtime/CDN image service
- **Problem:** ảnh gốc 2–5MB làm chậm & rớt Lighthouse; thiếu kích thước gây CLS.
- **Decision:** script `sharp` sinh WebP + `manifest.json` (width/height) lúc build.
- **Why:** tối ưu một lần; người xem luôn nhận ảnh nhẹ; không phụ thuộc dịch vụ ảnh trả phí; manifest chống CLS.
- **Alternatives:** Cloudinary/imgix (responsive tự động, đắt/ngoài), `vite-imagetools`, `<picture>` srcset.
- **Trade-off:** phải chạy script khi thêm ảnh; native binary nặng khi cài.
- **Pros:** giảm ~80% dung lượng, 0 chi phí runtime, CLS≈0.
- **Cons:** thao tác thủ công; chưa responsive srcset đa kích thước.
- **Status:** ✅ Accepted. (Thêm srcset nếu cần tối ưu theo DPR/màn hình.)

## ADR-006 — Feature-based folder structure
- **Problem:** 11 section + atoms + hooks + dữ liệu; cần dễ định vị & mở rộng.
- **Decision:** `components/` (dùng chung) vs `features/` (khối trang), + `hooks/ lib/ i18n/ styles/`.
- **Why:** ranh giới rõ, dependency một chiều, đọc tên là biết bản đồ, thêm section = thêm folder.
- **Alternatives:** cấu trúc phẳng; type-based (tất cả components chung, tất cả css chung).
- **Trade-off:** nhiều folder nhỏ.
- **Pros:** dễ điều hướng/bảo trì, ép ranh giới.
- **Cons:** overhead nhỏ cho dự án tí hon (chấp nhận được).
- **Status:** ✅ Accepted.

## ADR-007 — GitHub Pages + Actions thay vì Vercel/Netlify
- **Problem:** cần hosting + CI/CD đơn giản, rẻ, gắn với repo.
- **Decision:** Pages (CDN) + Actions (build/deploy artifact).
- **Why:** repo đã ở GitHub; push-to-deploy; miễn phí; rollback = revert.
- **Alternatives:** Vercel/Netlify (preview URL/edge functions), Cloudflare Pages.
- **Trade-off:** thiếu preview deploy per-PR & edge functions.
- **Pros:** 0 chi phí, 0 nhà cung cấp thêm, đơn giản.
- **Cons:** ít DX xa xỉ; cấu hình base path thủ công.
- **Status:** ✅ Accepted.

## ADR-008 — Base path `/portfodio/` + `asset()` helper
- **Problem:** Pages phục vụ ở subpath, không phải domain root; hard-code `/assets` sẽ vỡ.
- **Decision:** `vite base` = `/portfodio/` khi build; ảnh public tham chiếu qua `asset()` = `BASE_URL + path`.
- **Why:** một nguồn sự thật cho base path; đổi domain/subpath chỉ sửa 1 chỗ; dev vẫn `/`.
- **Trade-off:** phải nhớ dùng `asset()` cho ảnh động (ESLint không bắt được lỗi này).
- **Status:** ✅ Accepted.

## ADR-009 — Shared IntersectionObserver cho reveal (singleton) + rAF cho progress
- **Problem:** hàng chục phần tử reveal; scroll bắn nhiều event.
- **Decision:** 1 observer module-level chia sẻ; progress throttle bằng `requestAnimationFrame`; cả hai tôn trọng reduced-motion & cleanup.
- **Why:** hiệu năng (ít observer, ít công việc/scroll), a11y, không rò rỉ listener.
- **Alternatives:** mỗi phần tử 1 observer; scroll handler không throttle (jank).
- **Trade-off:** logic hơi tinh vi hơn.
- **Status:** ✅ Accepted.

## ADR-010 — Locale KHÔNG bền vững (không localStorage/cookie)
- **Problem:** có nên nhớ lựa chọn ngôn ngữ giữa các phiên?
- **Decision:** giữ `locale` chỉ trong bộ nhớ React; mặc định `vi`.
- **Why:** đơn giản; tránh cookie/localStorage ⇒ không banner đồng thuận, không PII.
- **Trade-off:** người chọn EN sẽ thấy VI lại khi quay lại.
- **Status:** ✅ Accepted (revisit nếu phân tích cho thấy người dùng khó chịu → thêm `localStorage`).

## ADR-011 — (Đang mở) SEO/SSG nâng cao
- **Context:** CSR ⇒ HTML rỗng; một số crawler/social có thể không chạy JS.
- **Option:** prerender (vite-plugin, `react-snap`) hoặc chuyển Astro/Next SSG để phát HTML tĩnh có nội dung.
- **Trade-off:** thêm bước build/độ phức tạp ⇄ SEO/first-paint tốt hơn.
- **Status:** 🔵 Proposed — chưa cần cho mục tiêu hiện tại; ghi nhận để cân nhắc.

## ADR-012 — (Đang mở) Analytics/observability
- **Option:** Plausible/Umami (privacy-first) hoặc `web-vitals` beacon.
- **Trade-off:** thêm 1 script/endpoint ⇄ biết hiệu quả tuyển dụng & Core Web Vitals thực địa.
- **Status:** 🔵 Proposed.

## Quality Gate
- ✅ Mỗi ADR đủ Decision/Problem/Why/Alternatives/Trade-off/Pros/Cons/Status.
- ✅ Có ADR "đang mở" (Proposed) thể hiện tư duy tiến hoá, không đóng băng.
- ✅ Trả lời được "vì sao không X" cho các X phổ biến (Next, Tailwind, Redux, CMS, Vercel).

**Đọc tiếp:** `11_System_Design_Interview.md`.
