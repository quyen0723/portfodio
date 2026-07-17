# 01 — Project Overview

> Bộ tài liệu này viết cho người muốn hiểu hệ thống ở tư duy **Software Architect**, không phải "code chạy là được". Mỗi quyết định quan trọng được mổ xẻ theo **5W1H** (Why/What/Who/When/Where/How) kèm **trade-off**.

---

## 1. Hệ thống này là gì (WHAT)

Một **portfolio cá nhân song ngữ (Tiếng Việt / English)** cho một Software Engineer & Researcher, được dựng lại thành một ứng dụng **production-grade**:

- **Kiểu hệ thống:** Single-Page Application (SPA) **tĩnh**, render phía client (CSR).
- **Công nghệ lõi:** React 18 + TypeScript (strict) + Vite 6, CSS Modules + design tokens.
- **Hạ tầng:** GitHub Pages (CDN tĩnh) + GitHub Actions (CI/CD).
- **Không có:** backend server, database, authentication, AI runtime, external API lúc chạy (trừ Google Fonts).

Đây là điểm mấu chốt cần nắm ngay: **phần lớn "độ khó kiến trúc" của hệ thống này nằm ở việc quyết định CÁI GÌ KHÔNG CẦN, chứ không phải thêm tầng.** Một kiến trúc sư giỏi được đánh giá qua khả năng loại bỏ độ phức tạp không cần thiết (accidental complexity), không phải khả năng thêm công nghệ.

## 2. Bài toán nghiệp vụ (Business Problem — WHY)

| Câu hỏi | Trả lời |
|---|---|
| **WHY tồn tại?** | Một kỹ sư cần một "cửa hàng mặt tiền" đáng tin cậy để nhà tuyển dụng / đối tác đánh giá năng lực: sản phẩm, nghiên cứu, giải thưởng, cách liên hệ. |
| **User value** | Người xem (nhà tuyển dụng, HR, đồng nghiệp) hiểu nhanh "người này là ai, làm được gì" trong < 60 giây, trên mọi thiết bị, tải cực nhanh, song ngữ. |
| **Business value** | Tăng tỉ lệ được liên hệ / mời phỏng vấn. Chi phí vận hành ~ $0 (hosting tĩnh miễn phí). Không có dữ liệu người dùng ⇒ không rủi ro pháp lý (GDPR/PII). |
| **Vòng đời nội dung** | Nội dung thay đổi chậm (vài lần/tháng khi có giải mới, dự án mới). Đây là lý do quyết định "content-as-code" hợp lý (mục 4). |

## 3. Ai dùng, khi nào, ở đâu (WHO / WHEN / WHERE)

- **WHO (người xem):** nhà tuyển dụng, HR, khách tham quan — thiết bị đa dạng (mobile chiếm đa số), mạng có thể yếu.
- **WHO (người bảo trì):** chính chủ nhân portfolio (1 developer) + trợ lý AI. ⇒ Kiến trúc phải **đơn giản để 1 người bảo trì**, không cần đội DevOps.
- **WHEN:** truy cập bất kỳ lúc nào; cập nhật nội dung khi có thành tích mới; deploy tự động mỗi lần `git push`.
- **WHERE:** chạy hoàn toàn trong **trình duyệt của người xem**; phục vụ từ **CDN GitHub Pages** (`https://quyen0723.github.io/portfodio/`).

## 4. Bốn quyết định kiến trúc nền tảng (HOW — tóm tắt)

Bốn quyết định dưới đây định hình toàn bộ hệ thống. Chi tiết đầy đủ ở `10_Architecture_Decision_Record.md`; ở đây nêu tinh thần.

### 4.1. Static-first (SSG/CSR tĩnh) thay vì SSR/Server

- **Problem:** Portfolio là nội dung đọc-nhiều, ghi-hiếm, không cá nhân hóa theo người dùng.
- **Decision:** Xuất một bundle tĩnh (HTML + JS + CSS + ảnh), phục vụ qua CDN.
- **Why:** Không có gì để tính toán phía server theo từng request ⇒ server chỉ là chi phí thừa. CDN cho độ trễ thấp toàn cầu, khả dụng cao, chi phí ~0, bề mặt tấn công gần như bằng 0.
- **Trade-off:** Mất SSR (SEO cho crawler yếu JS, first paint cần tải JS). Đã bù bằng meta/OG/JSON-LD tĩnh + bundle nhỏ. Xem `11` và `10`.

### 4.2. Content-as-code (nội dung là dữ liệu TypeScript) thay vì CMS/Database

- **Decision:** Toàn bộ nội dung (text VI/EN, danh sách giải thưởng, dự án…) nằm trong `src/i18n/content.vi.ts` / `content.en.ts`, kiểu hóa bởi `types.ts`.
- **Why:** Nội dung thay đổi chậm và do 1 người quản lý. "Database" duy nhất cần là Git. TypeScript đóng vai **schema validator** — sai cấu trúc là fail lúc build, không phải lúc chạy.
- **Trade-off:** Người không biết code khó sửa nội dung; đổi nội dung phải build lại. Với 1 chủ nhân là developer ⇒ chấp nhận được.

### 4.3. Design tokens + CSS Modules thay vì Tailwind/CSS-in-JS

- **Decision:** Một nguồn sự thật cho màu/typography/spacing ở `src/styles/tokens.css` (CSS custom properties), style scoped theo component bằng `*.module.css`.
- **Why:** Bám sát thiết kế gốc pixel-perfect, zero-runtime CSS (tốt cho performance), dễ đổi theme (3 accent) chỉ bằng đổi biến.

### 4.4. Build-time image optimization thay vì runtime/CDN image service

- **Decision:** `scripts/optimize-assets.mjs` dùng `sharp` biến JPEG lớn → WebP nhỏ + sinh `assets.manifest.json` (kích thước để chống CLS).
- **Why:** Ảnh là "chi phí byte" lớn nhất của portfolio. Tối ưu một lần lúc build ⇒ người xem luôn nhận ảnh nhẹ, không cần dịch vụ ảnh trả phí.

## 5. Sơ đồ tổng quan (HOW — bức tranh lớn)

```
                     ┌──────────────────────────── BUILD TIME (máy dev / CI) ────────────────────────────┐
   Nội dung (TS)     │                                                                                   │
   Ảnh nguồn (JPG) ──┼─► sharp ─► WebP + manifest.json                                                   │
                     │                                                                                   │
   src/ (TSX/CSS) ──►│  Vite (Rollup): TS→JS, tree-shake, code-split, hash, CSS Modules → dist/          │
                     └───────────────────────────────────┬───────────────────────────────────────────────┘
                                                          │ git push → GitHub Actions
                                                          ▼
                                       ┌──────────── GitHub Pages (CDN tĩnh) ────────────┐
                                       │   /portfodio/index.html, /assets/*.js|css|webp  │
                                       └───────────────────────┬─────────────────────────┘
                                                               │ HTTPS (chỉ tải file tĩnh)
                                                               ▼
   ┌──────────────────────────────── RUNTIME (trình duyệt người xem) ────────────────────────────────┐
   │  index.html → tải React bundle → createRoot().render(<App/>)                                     │
   │  App → LanguageProvider (Context) → NavBar + 11 section (Hero, About, … Contact)                 │
   │  Tương tác: đổi ngôn ngữ (Context), reveal-on-scroll (IntersectionObserver), progress (rAF)      │
   │  KHÔNG có request về server sau khi tải xong (trừ Google Fonts).                                 │
   └─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 6. Ranh giới hệ thống (System Boundary — WHERE)

| Thành phần | Trong hệ thống? | Ghi chú |
|---|---|---|
| React SPA | ✅ Có | Toàn bộ logic hiển thị & tương tác |
| Nội dung VI/EN | ✅ Có (compile-time) | Dữ liệu tĩnh, kiểu hóa |
| Pipeline ảnh (sharp) | ✅ Có (build-time) | Không chạy lúc runtime |
| GitHub Actions | ✅ Có | CI/CD |
| GitHub Pages CDN | ✅ Có (hạ tầng) | Đóng vai "backend" phục vụ file |
| Google Fonts | ⚠️ Phụ thuộc ngoài | External runtime dependency duy nhất |
| Backend / API server | ❌ Không | Có chủ đích — xem `05` |
| Database | ❌ Không | Thay bằng content-as-code |
| Auth / Authz | ❌ Không | Không có tài nguyên cần bảo vệ |
| AI runtime | ❌ Không | AI chỉ dùng lúc *xây dựng*, không lúc chạy |
| Analytics / Monitoring | ❌ Không (hiện tại) | Có thể thêm; xem `10` & `11` |

## 7. Quality Gate cho tài liệu này

- ✅ WHY: giải thích lý do tồn tại & lý do chọn static-first, content-as-code.
- ✅ Trade-off: nêu cái mất (SSR/SEO, non-dev khó sửa nội dung).
- ✅ Kiến trúc: có sơ đồ build-time vs runtime, ranh giới hệ thống.
- ✅ Architect mindset: nhấn mạnh "loại bỏ độ phức tạp" là quyết định kiến trúc.

**Đọc tiếp:** `02_System_Architecture.md` để đi sâu từng thành phần và luồng giữa chúng.
