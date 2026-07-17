# 14 — FAQ (100 câu hỏi một Software Architect có thể hỏi)

Câu hỏi được nhóm theo chủ đề. Mỗi câu trả lời ngắn nhưng nhắm vào **WHY/trade-off**, không chỉ mô tả. Tham chiếu tài liệu chi tiết ở ngoặc.

---

## A. Tổng quan & Kiến trúc (1–10)

**1. Hệ thống này thuộc loại kiến trúc nào?** SPA tĩnh, client-rendered (CSR), phục vụ qua CDN — thuộc họ static-first/JAMstack. (01,02)

**2. Vì sao không có backend?** Không có compute-per-request, không state chung, không secret cần bảo vệ ⇒ backend là độ phức tạp thừa. (05)

**3. "Backend" ai đóng vai?** CDN GitHub Pages (serve file) + CI pipeline (build/validate/deploy). (05)

**4. Database ở đâu?** Không có; nội dung là "content-as-code" trong `.ts`, Git là lưu trữ/lịch sử. (07,10-ADR002)

**5. Điểm mạnh lớn nhất của kiến trúc này?** Đơn giản, rẻ (~$0), khả dụng cao (CDN), bảo mật (bề mặt tấn công tối thiểu), bảo trì bởi 1 người. (11)

**6. Điểm yếu lớn nhất?** CSR ⇒ HTML nguồn rỗng (SEO với crawler yếu JS, first paint cần JS); tải React runtime cho nội dung tĩnh. (04,10-ADR001)

**7. Đây có phải over-engineering không?** Ngược lại — nó cố tình loại bỏ tầng thừa; điểm "nặng" duy nhất là dùng React cho trang tĩnh (đánh đổi có ý thức). (03,11)

**8. Nếu làm lại tối giản hơn?** Astro/11ty/vanilla sẽ nhẹ & SEO tốt hơn; đổi lại rời React model. (03,10-ADR001)

**9. Ranh giới hệ thống gồm gì?** React SPA + content + image pipeline + CI + CDN; phụ thuộc ngoài runtime chỉ Google Fonts. (01,02)

**10. Triết lý thiết kế cốt lõi?** Fit-for-purpose + single source of truth + loại bỏ accidental complexity. (01,08)

## B. Frontend & React (11–25)

**11. Vì sao chọn React?** Thiết kế gốc là React; component model hợp để tách 11 section + atoms; DX/ecosystem/TS tốt. (03)

**12. Vì sao không Next.js?** Không cần SSR/SSG/routing; Vite gọn hơn cho 1 trang tĩnh. (03,10-ADR001)

**13. State management dùng gì?** React Context cho `locale` (shared) + `useState/useRef` cục bộ; không Redux/Zustand. (04,10-ADR004)

**14. Vì sao không Redux?** State toàn cục chỉ 1 biến; Redux là boilerplate/bundle thừa. (10-ADR004)

**15. Context có gây re-render thừa?** Có nguy cơ; đã giảm bằng `useMemo` value + `useCallback` toggle. (04)

**16. Routing thế nào?** Không có router; one-page với anchor `#id` + `scroll-margin-top`. (04)

**17. Khi nào cần thêm router?** Khi có nhiều trang thực (blog/case study) ⇒ React Router hoặc chuyển SSG. (04)

**18. Component pattern chính?** Composition (`Section>Container>Reveal>atoms`), container/presentational (Work vs ProjectCard), data-driven (`.map`). (04)

**19. Atoms tái dùng gồm gì?** Section, Container, Reveal, Eyebrow, SectionHeading, Button, Chip, MonoLabel, ScrollProgress. (04,08)

**20. Biến thể component xử lý sao?** Qua props (`variant/size/tone/bg`) thay vì clone component. (04)

**21. Custom hooks nào & vì sao?** `useLanguage` (đọc Context, fail-fast), `useReveal` (1 observer chia sẻ), `useScrollProgress` (rAF throttle). (04,08)

**22. Vì sao 1 IntersectionObserver chia sẻ?** Hàng chục phần tử reveal; 1 observer tiết kiệm bộ nhớ/CPU so với mỗi phần tử 1 observer. (04,10-ADR009)

**23. StrictMode để làm gì?** Bật kiểm tra kép ở dev để lộ side-effect không idempotent; đã đảm bảo hooks cleanup đúng. (03,09)

**24. Rendering là CSR hay SSR?** CSR — DOM dựng ở client sau khi JS tải. (04,06)

**25. Làm sao thêm 1 section mới?** Tạo `features/x/` dùng atoms, thêm vào `App.tsx`, thêm dữ liệu vào `content.*.ts` + `types.ts` nếu cần. (09)

## C. TypeScript & Mô hình dữ liệu (26–35)

**26. TS đóng vai gì ngoài type?** Là "schema validator" cho nội dung — sai cấu trúc fail lúc build. (03,07)

**27. Schema nội dung ở đâu?** `src/i18n/types.ts` (`PortfolioContent` + sub-types). (08)

**28. Hai ngôn ngữ đảm bảo đồng bộ sao?** Cả `content.en` và `content.vi` phải thoả `PortfolioContent`; thiếu field ⇒ `tsc` fail. (03,07)

**29. Vì sao tách 2 tsconfig?** `tsconfig.app.json` cho `src` (DOM libs), `tsconfig.node.json` cho `vite.config.ts` (Node types) — môi trường khác nhau. (03,08)

**30. `strict` bật gì đáng chú ý?** `noUnusedLocals/Parameters`, `noUncheckedSideEffectImports`, `isolatedModules`, `resolveJsonModule`. (03)

**31. `any` được dùng không?** Không; ESLint cấm `no-explicit-any: error`. (03)

**32. Import JSON (manifest) type-safe?** Có, `resolveJsonModule` + cast `Record<string,{width,height}>` trong `asset.ts`. (07,08)

**33. Generics dùng ở đâu?** Ví dụ typing props component (variant maps) và Web API refs; nhẹ, không lạm dụng. (12)

**34. Nếu dùng JS thuần thì sao?** Nhanh lúc đầu nhưng mất an toàn refactor & schema — rủi ro cho dữ liệu đa mục. (03)

**35. Thêm loại dữ liệu mới (vd. talks) làm sao?** Thêm type vào `types.ts`, field vào cả 2 content, render ở feature — TS dẫn đường. (09)

## D. CSS & Design System (36–45)

**36. Vì sao CSS Modules + tokens, không Tailwind?** Pixel-perfect + theming bằng CSS var + zero runtime; Tailwind rối markup & khó match giá trị design lạ. (03,10-ADR003)

**37. Nguồn sự thật thiết kế?** `styles/tokens.css` — mọi màu/font/spacing/radius/shadow. (03,08)

**38. Theming (3 accent) hoạt động sao?** `[data-accent]` set biến `--accent...`; cây con kế thừa, không re-render JS. (03,04)

**39. Vì sao không CSS-in-JS?** Có runtime cost + tăng bundle — ngược mục tiêu performance. (03,10-ADR003)

**40. Responsive làm bằng gì?** `clamp()` cho scaling, media queries cho breakpoint, `grid/flex`, `aspect-ratio`. (04,12)

**41. object-fit cover vs contain dùng khi nào?** Cover cho ảnh sự kiện (16:10, chấp nhận crop); contain cho poster (không cắt chữ) + nền blur lấp letterbox. (Awards)

**42. Chống CLS ở CSS?** `aspect-ratio` + `width/height` từ manifest ⇒ trình duyệt chừa chỗ trước khi ảnh tải. (07,11)

**43. Accessibility trong CSS?** `:focus-visible` ring, `prefers-reduced-motion` tắt animation, `.sr-only`. (04,11)

**44. Xử lý style động (poster bg) ra sao?** Truyền CSS var `--poster-bg` qua inline style; CSS `::before` đọc biến ⇒ tách TSX/CSS sạch. (04)

**45. Global vs Module CSS ranh giới?** `global.css` = reset/base/primitive/a11y; `*.module.css` = style scoped từng component. (08)

## E. Build, Vite & Tooling (46–55)

**46. Vite làm gì?** Dev server (ESM+HMR) và bundler production (Rollup). (03)

**47. Base path xử lý sao?** `base='/portfodio/'` khi build (dev `/`); ảnh qua `asset()`=`BASE_URL+path`. (03,10-ADR008)

**48. Vì sao tách React thành chunk riêng?** `manualChunks` ⇒ vendor cache dài hạn; sửa nội dung không phá cache React. (03,06)

**49. Cache-busting thế nào?** Filename hashing (`index-[hash].js`) ⇒ URL đổi khi nội dung đổi. (06,07)

**50. `npm run build` gồm gì?** `tsc -b` (validate) `&&` `vite build` (bundle) — build fail nếu type sai. (05,09)

**51. ESLint cấu hình gì đặc biệt?** Flat config + typescript-eslint + react-hooks + react-refresh + **jsx-a11y** + no-explicit-any. (03)

**52. Tree-shaking có không?** Có (Rollup) — loại code không dùng khỏi bundle. (12)

**53. Dev và build khác engine?** Dev dùng esbuild transform, build dùng Rollup — hiếm khi khác hành vi. (03)

**54. Vì sao `reportCompressedSize:false`?** Build nhanh hơn (bỏ bước tính gzip size báo cáo). (03)

**55. Alias `@` là gì?** `@/` → `src/` (import gọn, tránh `../../`). (03,08)

## F. Không backend / DB / Auth (56–67)

**56. Ba câu hỏi quyết định "có cần backend"?** Compute-per-request? State chung bền vững? Secret cần bảo vệ? Cả ba "không" ⇒ không cần. (05)

**57. Validation ở đâu nếu không có server?** Shift-left: TypeScript + ESLint lúc build. (05,07)

**58. CRUD có không?** Chỉ Read (tĩnh). Create/Update/Delete = dev sửa file rồi build lại (authoring, không runtime). (07)

**59. Session/cookie/JWT?** Không — không có đăng nhập/phiên/tài nguyên bảo vệ. (07)

**60. Caching ở đâu?** CDN edge + filename hashing (không cache tầng app). (07,11)

**61. Dependency Injection thể hiện sao?** React Context "inject" content xuống cây + module imports. (05)

**62. Repository layer tương đương gì?** Static import `CONTENT[locale]` — "truy vấn" = truy cập object. (05)

**63. Business logic nằm đâu?** Mỏng, ở client: chọn ngôn ngữ/accent, tính % cuộn. Nghiệp vụ chính là "trình bày thông tin". (05)

**64. Thêm form liên hệ thì kiến trúc đổi sao?** Thêm serverless function/dịch vụ form ở rìa; client `fetch`; giữ lõi tĩnh. (05,11)

**65. Muốn người phi kỹ thuật sửa nội dung?** Thêm Headless CMS (Sanity/Contentful), build-time hoặc runtime fetch. (05,10-ADR002)

**66. Auth khi nào cần?** Khi có tài nguyên riêng tư/ghi dữ liệu; thêm sớm = nợ + rủi ro vô ích. (05)

**67. "Tầng backend biến mất" đúng không?** Không — chúng **dịch pha**: validation→build, data access→static import, DI→Context, caching→CDN. (05)

## G. Performance (68–77)

**68. LCP tối ưu sao?** Ảnh hero `fetchPriority=high`, WebP nhẹ, kích thước khai báo. (06,11)

**69. CLS≈0 nhờ gì?** `width/height`(manifest) + `aspect-ratio`. (07,11)

**70. Bundle bao lớn?** ~185KB JS (≈142KB React vendor + ≈43KB app) + ~20KB CSS. (11)

**71. Ảnh tối ưu thế nào?** sharp build-time: JPEG→WebP, resize, quality 80–88; giảm ~80%. (03,10-ADR005)

**72. Ảnh dưới màn hình?** `loading=lazy` để không tranh băng thông đầu. (06,11)

**73. Font không chặn render?** `preconnect` + `display=swap` + fallback system. (02,11)

**74. Scroll không jank?** `useScrollProgress` throttle bằng `requestAnimationFrame`. (04,10-ADR009)

**75. Vì sao React runtime là "chi phí" ở đây?** Tải ~142KB JS chỉ để render nội dung tĩnh — đánh đổi lớn nhất; Preact/Astro sẽ nhẹ hơn. (03)

**76. Cache trình duyệt tối ưu ra sao?** Assets hashed ⇒ cache bất biến; đổi = URL mới. (06,07)

**77. Đo performance bằng gì?** Lighthouse/Core Web Vitals; (RUM là điểm mở — ADR-012). (11)

## H. Accessibility / SEO / Security (78–87)

**78. A11y có gì?** Semantic HTML, `aria-labelledby` mỗi section, `:focus-visible`, reduced-motion, alt ảnh, `html.lang` đồng bộ. (04,11)

**79. jsx-a11y giúp gì?** Bắt lỗi a11y lúc lint (quên alt, aria sai). (03)

**80. SEO cơ bản?** `<head>` meta/description/OG + JSON-LD tĩnh trong `index.html`. (06,11)

**81. Điểm yếu SEO?** CSR ⇒ nội dung cần JS; crawler yếu JS có thể bỏ lỡ. (04,10-ADR011)

**82. Khắc phục SEO?** Prerender/SSG (react-snap/Astro/Next SSG) — điểm mở. (10-ADR011)

**83. XSS phòng sao?** Không `dangerouslySetInnerHTML`; React escape; nội dung là dữ liệu tĩnh của chủ sở hữu. (11)

**84. Link ngoài an toàn?** `target=_blank` + `rel="noopener noreferrer"` (chống tabnabbing). (11)

**85. Transport security?** HTTPS bắt buộc (Pages). (11)

**86. CSP có không?** Chưa; Pages hạn chế custom header — có thể qua `<meta>` hoặc đổi CDN; điểm cứng-hoá. (11)

**87. Privacy?** Không cookie/analytics/PII ⇒ không cần consent banner. (07,11)

## I. CI/CD, Deploy & Infra (88–93)

**88. Deploy diễn ra khi nào?** Mỗi `push` nhánh `main` (hoặc chạy tay). (02)

**89. Pipeline gồm bước gì?** checkout→setup-node→`npm ci`→`npm run build`→upload artifact→deploy-pages. (02,05)

**90. Build fail thì sao?** Không publish ⇒ live giữ bản tốt gần nhất (fail-safe). (11)

**91. Rollback thế nào?** Revert commit → Actions deploy lại bản cũ. (10-ADR007,11)

**92. `concurrency` để làm gì?** `cancel-in-progress` — push mới hủy deploy đang chạy, tránh race. (02)

**93. Vì sao Pages+Actions, không Vercel?** Không thêm nhà cung cấp; push-to-deploy; free; đổi lại thiếu preview URL/edge. (03,10-ADR007)

## J. Scaling, Evolution & Trade-offs (94–100)

**94. Chịu 1M view/ngày?** CDN vốn đã lo; không đổi kiến trúc. (11)

**95. SPOF là gì?** Pages down (site down) & Google Fonts (đã có fallback). Giảm bằng đa CDN/self-host font. (11)

**96. Thêm "động" mà không đập lõi?** Islands: serverless/edge/BaaS ở rìa, giữ tĩnh ở lõi. (05,11)

**97. Đa ngôn ngữ 10+ nặng?** Tách bundle theo locale / lazy import để không phình. (06,11)

**98. Testing hiện có?** Chưa; nên thêm Vitest (unit) + Playwright (E2E) — khoảng trống đã ghi nhận. (13)

**99. Observability?** Chưa; thêm privacy analytics/web-vitals beacon nếu cần. (10-ADR012)

**100. Bài học kiến trúc lớn nhất từ dự án?** "Đúng quy mô": chọn kiến trúc khớp yêu cầu, loại bỏ độ phức tạp thừa, và biết *khi nào* thêm tầng — quan trọng hơn biết *cách* thêm. (01,05,11)

---

## Quality Gate
- ✅ Đủ 100 câu, nhóm theo 10 chủ đề.
- ✅ Mỗi đáp án nhắm WHY/trade-off, có tham chiếu tài liệu.
- ✅ Bao phủ cả "vì sao không" (backend/DB/Redux/Next/Tailwind) — tư duy kiến trúc.

**Đọc tiếp:** `15_Final_Architecture_Book.md`.
