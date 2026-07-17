# 13 — Learning Roadmap

Từ chính source code này, đây là lộ trình học **theo cấp bậc** (Junior → Mid → Senior → Tech Lead → Architect → Principal). Mỗi cấp: **mục tiêu tư duy · học gì · chứng minh bằng việc gì trong/từ repo**. Ưu tiên từ trên xuống.

> Triết lý: đừng học công nghệ rời rạc; học để **giải một loại vấn đề**. Mỗi mốc dưới đây gắn với "vấn đề" thật.

---

## Cấp 1 — Junior (làm được, hiểu cục bộ)
**Mục tiêu:** đọc hiểu & sửa an toàn một component/nội dung.
- HTML ngữ nghĩa, CSS cơ bản (flex/grid, box model), JS/ES modules.
- React nền: JSX, props, `useState`, `useEffect`, list rendering (`.map` + `key`).
- TypeScript nền: type/interface, đọc `types.ts`.
- Git cơ bản: clone, branch, commit, PR.
**Chứng minh:** thêm 1 giải thưởng vào `content.*.ts`; đổi 1 text; sửa 1 màu qua token; chạy `npm run dev`.
**Vấn đề học được:** "làm UI khớp dữ liệu".

## Cấp 2 — Mid (hiểu luồng & tái dùng)
**Mục tiêu:** xây một feature mới đúng chuẩn dự án.
- React sâu hơn: `useRef`, `useMemo`, `useCallback`, custom hooks, Context.
- CSS Modules + design tokens; responsive (media query, `clamp`, `aspect-ratio`, object-fit cover/contain).
- Web APIs: IntersectionObserver, requestAnimationFrame, matchMedia.
- TS: generics cơ bản, utility types (`Pick`, `Record`), strict mode.
- Build: `npm scripts`, hiểu `vite build` vs `tsc`.
**Chứng minh:** tạo một section mới (folder `features/x/`) dùng `Section/Container/Reveal/Eyebrow`; viết một custom hook nhỏ; tối ưu 1 ảnh qua script.
**Vấn đề học được:** "tách logic khỏi view; tái dùng; không lặp".

## Cấp 3 — Senior (chất lượng & đánh đổi cục bộ)
**Mục tiêu:** đảm bảo performance/a11y/maintainability, biết đánh đổi.
- Core Web Vitals (LCP/CLS/INP) & cách repo đạt (fetchpriority, width/height, lazy, hashing).
- Accessibility (WCAG): semantics, `aria-labelledby`, `:focus-visible`, reduced-motion, alt.
- Bundle: tree-shaking, code-splitting (`manualChunks`), đo kích thước.
- Security cơ bản FE: XSS/escaping, `rel=noopener`, HTTPS.
- Refactor an toàn nhờ types + lint.
**Chứng minh:** chạy Lighthouse, đề xuất & thực hiện 1 cải thiện có đo lường; review a11y một feature.
**Vấn đề học được:** "làm đúng, nhanh, tiếp cận được — và biết vì sao".

## Cấp 4 — Tech Lead (nhất quán & vận hành nhóm)
**Mục tiêu:** định chuẩn để nhiều người/AI cùng làm không loạn.
- Kiến trúc thư mục & ranh giới (feature-based, dependency một chiều).
- CI/CD: đọc/sửa `deploy.yml`; quy tắc "build fail thì không deploy"; rollback bằng Git.
- Coding standard: ESLint flat config, quy ước commit, PR review.
- Quản lý phụ thuộc & nợ kỹ thuật; ADR (ghi quyết định).
**Chứng minh:** viết một ADR mới cho một thay đổi; thiết lập/điều chỉnh CI gate; định nghĩa "định nghĩa hoàn thành".
**Vấn đề học được:** "biến quyết định cá nhân thành chuẩn nhóm".

## Cấp 5 — Software Architect (đúng quy mô & tiến hoá)
**Mục tiêu:** chọn kiến trúc khớp yêu cầu; biết khi nào KHÔNG thêm gì.
- Static-first/JAMstack vs SSR/SSG/ISR vs SPA; islands & edge; khi nào cần backend/DB/auth (xem `05`, `11`).
- Non-functional thinking: scalability/availability/reliability/security/cost/maintainability (trục ở `11`).
- Chiến lược dữ liệu: content-as-code vs CMS vs DB; caching (CDN/hashing).
- SEO chiến lược (prerender/SSG), observability chiến lược (privacy analytics).
- Tư duy đánh đổi & right-sizing (chống over-engineering).
**Chứng minh:** viết bản thiết kế mở rộng (thêm form/CMS/analytics) giữ lõi tĩnh, kèm trade-off; phản biện "vì sao không microservices/Redux/Next".
**Vấn đề học được:** "khớp kiến trúc với bài toán; loại bỏ độ phức tạp thừa".

## Cấp 6 — Principal (tầm ảnh hưởng & nguyên lý)
**Mục tiêu:** rút ra nguyên lý tái dùng nhiều dự án; dẫn dắt kỹ thuật.
- Trừu tượng hoá pattern: "islands of dynamism trên nền tĩnh", "validation shift-left", "single source of truth", "acyclic dependencies".
- Đánh đổi hệ thống lớn: đa CDN, edge compute, đa vùng, chi phí/độ trễ.
- Định hướng công nghệ dài hạn; cố vấn Architect/Lead; chuẩn hoá cross-team.
- Kinh tế kỹ thuật: chi phí tổng sở hữu (TCO), rủi ro nhà cung cấp, khả năng thoái lui (exit strategy).
**Chứng minh:** viết "engineering guideline" từ các nguyên lý repo này minh hoạ; đánh giá & định hướng nhiều kiến trúc.
**Vấn đề học được:** "biến kinh nghiệm thành nguyên lý & ảnh hưởng".

## Ma trận ưu tiên (nếu thời gian hạn chế)
| Nếu bạn muốn… | Học ngay (từ repo) |
|---|---|
| Làm việc được | React cơ bản + `content.*.ts` + tokens |
| Lên Mid nhanh | custom hooks + Context + CSS Modules/responsive |
| Lên Senior | Web Vitals + a11y + bundle + security FE |
| Tư duy Architect | `05`,`10`,`11` (backend-less, ADR, NFR trade-offs) |

## Khoảng trống kiến thức mà repo *không* dạy (phải học nơi khác)
- Backend thật: API design (REST/GraphQL), DB/SQL, auth (session/JWT/OAuth), caching server (Redis).
- Testing tự động (unit/E2E — dự án chưa có; nên bổ sung Vitest + Playwright).
- Observability sản xuất (logging/metrics/tracing).
- Hệ phân tán (queue, consistency, đa vùng).
> Đây là các mảng cần chủ động học ngoài repo để đạt Architect/Principal toàn diện.

## Quality Gate
- ✅ Lộ trình 6 cấp, mỗi cấp có mục tiêu/học gì/chứng minh gắn với repo.
- ✅ Ma trận ưu tiên & khoảng trống kiến thức (trung thực về giới hạn của repo).
- ✅ Nhấn mạnh tư duy đúng-quy-mô cấp Architect.

**Đọc tiếp:** `14_FAQ.md`.
