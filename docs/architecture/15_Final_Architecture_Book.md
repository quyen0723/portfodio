# 15 — The Architecture Book (Tổng hợp hoàn chỉnh)

> Một tài liệu duy nhất, mạch lạc như một quyển sách, tổng hợp toàn bộ bộ 01–14. Đọc riêng cái này là hiểu được hệ thống ở tư duy Software Architect; đọc kèm các file chi tiết để đào sâu.

**Hệ thống:** Portfolio cá nhân song ngữ (VI/EN) · React 18 + TypeScript + Vite · CSS Modules + Design Tokens · GitHub Pages + Actions · **không backend/DB/auth/AI-runtime**.

---

## Lời nói đầu — Vì sao nên đọc kiến trúc của một portfolio?

Vì nó là bài học tinh khiết về **đúng quy mô (right-sizing)**. Không có hệ phân tán để gây choáng, không có microservice để giấu sự thiếu tư duy. Toàn bộ giá trị kiến trúc nằm ở các *quyết định loại bỏ*: không server, không database, không auth, không state library, không router. Một kỹ sư giỏi thêm công nghệ; một **kiến trúc sư** biết cái nào **không** thêm — và giải thích được **vì sao**. Quyển sách này giải thích từng "vì sao".

---

## Chương 1 — Bài toán & Bối cảnh

- **Mục tiêu nghiệp vụ:** giúp nhà tuyển dụng/đối tác đánh giá năng lực chủ nhân trong < 60 giây, trên mọi thiết bị, tải nhanh, song ngữ, chi phí ~$0, không rủi ro dữ liệu.
- **Đặc tính quyết định kiến trúc:** nội dung **đọc-nhiều, ghi-hiếm, không cá nhân hoá**, do **một người** quản lý. Ba đặc tính này là lý do mọi tầng động (server/DB/auth) trở nên thừa.
- **Ranh giới:** React SPA + content(TS) + image pipeline(sharp) + CI(Actions) + CDN(Pages); phụ thuộc runtime ngoài duy nhất: Google Fonts.
> Chi tiết: `01`.

## Chương 2 — Bức tranh kiến trúc (3 mặt phẳng)

```
BUILD PLANE (CI/dev):  content.ts + assets.jpg + src/  ──tsc+vite+sharp──►  dist/ (HTML/JS/CSS/WebP + manifest)
                                            │ git push → GitHub Actions
SERVING PLANE (CDN):   GitHub Pages phục vụ file tĩnh tại /portfodio/ (TLS, cache)
                                            │ GET
CLIENT PLANE (browser): React CSR → LanguageProvider(Context) → NavBar + 11 sections
                        tương tác: i18n toggle, reveal(IntersectionObserver), progress(rAF)
                        phụ thuộc runtime: Google Fonts
```

- **Thông điệp:** "tính toán" chỉ xảy ra ở **build-time** (một lần) và **client-side** (nhẹ). **Serving-time = 0 compute** (chỉ trả bytes). Đây là bản chất static-first.
> Chi tiết: `02`, `06`.

## Chương 3 — Vì sao "không backend" là một kiến trúc

Backend chỉ cần khi có **compute-per-request**, **state chung bền vững**, hoặc **secret cần bảo vệ**. Portfolio không có cả ba. Nên các tầng kinh điển **dịch pha** thay vì biến mất:

| Tầng | Dịch sang |
|---|---|
| Validation | build-time (TypeScript + ESLint) |
| Data access (Repository) | static import (`CONTENT[locale]`) |
| Database | Git + file `.ts` (content-as-code) |
| Dependency Injection | React Context |
| Caching | CDN edge + filename hashing |
| Auth/Session/JWT | (không có — không tài nguyên bảo vệ) |

- **Hệ quả:** chi phí ~0, khả dụng cao (CDN), bảo mật (bề mặt tấn công tối thiểu), vận hành-được-bởi-1-người.
> Chi tiết: `05`, `07`.

## Chương 4 — Frontend: nơi (gần như) toàn bộ hệ thống cư trú

Ba nguyên tắc: **feature-based**, **composition over configuration**, **single source of truth**.

- **Dependency một chiều (acyclic):** `features → components → hooks/lib/styles`; `i18n` cắt ngang cấp dữ liệu qua Context. Tầng dưới không biết tầng trên.
- **State đúng-quy-mô:** shared state = 1 biến `locale` (React Context, tối ưu bằng `useMemo`/`useCallback`); UI state cục bộ = `useState/useRef`. Không Redux/Zustand.
- **Patterns:** composition (`Section>Container>Reveal>atoms`), container/presentational (`Work` vs `ProjectCard`), **data-driven** (`content.awards.map` ⇒ thêm dữ liệu là UI mọc thêm), variant props (Button/Section/Eyebrow), **CSS-var-as-API** (truyền `--poster-bg`/`--section-y` từ TSX sang CSS).
- **Hooks đóng gói Web APIs:** `useReveal` (1 IntersectionObserver chia sẻ), `useScrollProgress` (rAF throttle), `useLanguage` (fail-fast Context).
> Chi tiết: `04`, `08`.

## Chương 5 — Hệ thống thiết kế & Nội dung

- **Design tokens (`tokens.css`):** một nơi định nghĩa màu/font/spacing/radius/shadow + 3 accent theme (đổi qua `[data-accent]`, không re-render JS). Component style scoped bằng CSS Modules ⇒ **zero-runtime**, pixel-perfect.
- **Content-as-code (`i18n/`):** `types.ts` là schema, `content.{vi,en}.ts` là dữ liệu **phải thoả schema** (sai ⇒ fail build). TS = validator; Git = "database" + lịch sử.
> Chi tiết: `03`(§4,§2), `07`.

## Chương 6 — Vòng đời request & dữ liệu

- **Initial load:** CDN trả HTML gần rỗng → tải JS/CSS/WebP (song song, hashed) → `createRoot().render(<App/>)` → paint (hero LCP ưu tiên, ảnh dưới lazy) → reveal/progress khởi động → fonts swap. Sau đó **không còn request nghiệp vụ**.
- **Interaction (đổi ngôn ngữ):** click → `setLocale` → Context đổi → re-render text — **thuần client, ~mili-giây, không mạng** (bundle chứa cả 2 ngôn ngữ: đánh đổi kích thước ⇄ tức thì/offline).
- **So với FE→BE→DB kinh điển:** nửa phải (API/BE/logic/DB/response) **bị cắt bỏ** vì dữ liệu & logic đã "nướng" vào client lúc build.
> Chi tiết: `06`, `07`.

## Chương 7 — Chất lượng phi chức năng (góc System Design)

| Trục | Cách đạt |
|---|---|
| **Scalability** | CDN nhân bản edge; thêm user = thêm cache hit; scale tuyến tính, tự động |
| **Availability** | SLA CDN cao; SPOF: Pages & Google Fonts (có fallback) |
| **Reliability** | build fail ⇒ không publish; rollback = revert commit; không dữ liệu runtime ⇒ không corruption |
| **Performance** | LCP(fetchpriority+WebP), CLS≈0(width/height), JS split+hashed, CSS zero-runtime, lazy ảnh, font swap |
| **Security** | không server/DB ⇒ bề mặt tối thiểu; React escape; `rel=noopener`; HTTPS; (CSP là điểm mở) |
| **Maintainability** | type-safe content, tokens, feature-based, ESLint a11y, CI đơn giản |

- **Right-sizing:** microservices/DB/Redux/SSR-cluster/K8s đều **sai** ở đây vì không có bài toán tương ứng. Biết *khi nào không dùng* là dấu hiệu architect.
> Chi tiết: `11`.

## Chương 8 — Những quyết định định hình (ADR tinh gọn)

1. **Static SPA (CSR)** — không compute-per-request ⇒ CDN đủ (đổi lại SEO/first-paint).
2. **Content-as-code** — dữ liệu nhỏ/1 người/type-safe (đổi lại non-dev khó sửa).
3. **CSS Modules + tokens** — pixel-perfect + theming + zero-runtime (đổi lại verbose hơn Tailwind).
4. **Context i18n** — 1 biến state ⇒ không cần store.
5. **sharp build-time** — tối ưu ảnh 1 lần, không dịch vụ ngoài.
6. **Feature-based** — ranh giới rõ, dependency acyclic.
7. **Pages+Actions** — không thêm nhà cung cấp, push-to-deploy (đổi lại thiếu preview/edge).
8. **Base path + `asset()`** — một nguồn sự thật cho subpath.
9. **Shared observer + rAF** — hiệu năng + a11y + no leak.
10. **Locale không bền vững** — đơn giản, không cookie/PII.
- **Đang mở:** SEO/SSG (ADR-011), Analytics (ADR-012).
> Chi tiết & Pros/Cons đầy đủ: `10`.

## Chương 9 — Tiến hoá: thêm "động" mà không phá "tĩnh"

Nguyên tắc **islands of dynamism trên nền tĩnh**: giữ lõi tĩnh, thêm khả năng động ở **rìa**.

| Nhu cầu | Cách thêm ít hối tiếc |
|---|---|
| Form liên hệ | serverless function / dịch vụ form; client `fetch` |
| Non-dev sửa nội dung | Headless CMS (build-time hoặc runtime fetch) |
| Analytics | privacy analytics (Plausible/Umami) hoặc web-vitals beacon |
| Ghi dữ liệu người dùng | BaaS (Supabase/Firebase) |
| SEO tối đa | prerender/SSG (react-snap/Astro/Next SSG) |
| Nhớ ngôn ngữ | `localStorage` (cân nhắc privacy) |

> Chi tiết: `05`(§5), `11`(§6).

## Chương 10 — Khoảng trống & Lộ trình trưởng thành

- **Repo dạy tốt:** React/TS/CSS hiện đại, design system, performance, a11y, CI/CD tĩnh, tư duy backend-less.
- **Repo không dạy (học nơi khác):** backend thật (API/DB/auth/cache server), testing tự động (Vitest/Playwright — nên bổ sung), observability sản xuất, hệ phân tán.
- **Lộ trình:** Junior(sửa nội dung/token) → Mid(feature+hooks+Context) → Senior(Web Vitals+a11y+security) → Tech Lead(chuẩn+CI+ADR) → Architect(đúng-quy-mô+NFR+data strategy) → Principal(nguyên lý+ảnh hưởng).
> Chi tiết: `12`, `13`.

## Kết luận — Điều khiến kiến trúc này "đạt tầm Architect"

Không phải vì nó phức tạp, mà vì nó **khớp chính xác với bài toán** và **giải thích được mọi quyết định**:

1. **Fit-for-purpose:** mỗi công nghệ giải một vấn đề cụ thể; không có vấn đề ⇒ không có công nghệ.
2. **Loại bỏ accidental complexity:** không server/DB/auth/store/router — vì không cần.
3. **Single source of truth:** thiết kế (tokens), nội dung (i18n), đường dẫn ảnh (asset) — mỗi thứ một nơi.
4. **Shift-left & acyclic:** validation về build-time, dependency một chiều.
5. **Đường tiến hoá rõ:** biết *khi nào* và *thêm gì* (islands ở rìa), không đập lõi.

> Một Software Architect đọc xong nên tự trả lời được: *"Tôi hiểu vì sao hệ thống được thiết kế như vậy, và tôi có thể tự thiết kế một hệ thống tương tự — hoặc mở rộng nó đúng cách."* Đó là mục tiêu của cả bộ tài liệu.

---

## Phụ lục A — Bản đồ tài liệu
| # | File | Nội dung |
|---|---|---|
| 01 | Project_Overview | Mục tiêu, business problem, 4 quyết định nền tảng, ranh giới |
| 02 | System_Architecture | 3 mặt phẳng, thành phần có/không, luồng |
| 03 | Tech_Stack_Analysis | Từng công nghệ: why/pros/cons/trade-off/alternative |
| 04 | Frontend_Architecture | Folder, state, data flow, patterns, hooks, context |
| 05 | Backend_Architecture | Vì sao backend-less; ánh xạ tầng; khi nào cần |
| 06 | Request_Response_Flow | Load/interaction từng bước; đối chiếu FE-BE-DB |
| 07 | Data_Flow | Vòng đời text/ảnh; CRUD/session/JWT vắng mặt |
| 08 | Folder_Explanation | Vai trò/quan hệ/dependency từng folder |
| 09 | Code_Reading_Guide | Thứ tự đọc cho dev mới |
| 10 | ADR | 12 quyết định (Accepted/Proposed) |
| 11 | System_Design_Interview | FR/NFR, quy mô, 6 trục |
| 12 | Knowledge_Map | Bản đồ khái niệm ↔ file |
| 13 | Learning_Roadmap | 6 cấp Junior→Principal |
| 14 | FAQ | 100 câu hỏi & trả lời |
| 15 | (this) | Tổng hợp thành sách |

## Phụ lục B — Số liệu nhanh
- Mã nguồn: ~3.150 dòng TS/TSX/CSS · 11 feature sections · 9 atoms · 3 hooks.
- Runtime deps: **chỉ** `react`, `react-dom`.
- Bundle: ~185KB JS (≈142KB React vendor tách chunk + ≈43KB app) + ~20KB CSS.
- Ảnh: JPEG → WebP (sharp), giảm ~80%, có manifest chống CLS.
- Hạ tầng: GitHub Pages (CDN) + Actions (CI/CD), base `/portfodio/`, chi phí ~$0.

## Quality Gate (toàn bộ bộ tài liệu)
- ✅ WHY cho mọi quyết định lớn (hiện diện & vắng mặt).
- ✅ Trade-off + Alternative xuyên suốt.
- ✅ Best practice & production experience (perf/a11y/security/CI).
- ✅ Sơ đồ kiến trúc (3 mặt phẳng, dependency, flows).
- ✅ Giúp đạt tư duy Architect: right-sizing, single source of truth, evolution path.
