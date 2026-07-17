# 02 — System Architecture

Tài liệu này mô tả **các thành phần hệ thống**, vai trò, và **luồng giữa chúng**. Điểm quan trọng: nhiều "tầng" kinh điển (DB, Auth, API server, Monitoring) **không tồn tại** ở đây — và ta sẽ giải thích tại sao sự vắng mặt đó là **đúng**, không phải thiếu sót.

---

## 1. Bản đồ thành phần (Component Map)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                             BUILD PLANE (CI / máy dev)                       │
│                                                                              │
│  package.json scripts ──► tsc -b (type check) ──► vite build (Rollup)        │
│                                        │                                     │
│  scripts/optimize-assets.mjs (sharp) ──┴──► dist/  (HTML, JS[hashed],        │
│                                              CSS[hashed], webp, favicon)     │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │  actions/upload-pages-artifact + deploy-pages
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                       SERVING PLANE (GitHub Pages CDN)                        │
│   Phục vụ file tĩnh qua HTTPS tại base path /portfodio/. Có cache, có TLS.    │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │  GET (chỉ tài nguyên tĩnh)
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                     CLIENT PLANE (trình duyệt người xem)                      │
│                                                                              │
│  main.tsx ──► createRoot(#root).render(<StrictMode><App/></StrictMode>)      │
│      │                                                                       │
│      ▼                                                                       │
│  App ──► <ScrollProgress/>  <NavBar/>  <main> 11 sections </main>            │
│      │        (rAF)             (Context)     (Hero…Contact)                 │
│      └──► LanguageProvider (React Context) bọc toàn bộ                       │
│                                                                              │
│  Web APIs dùng: IntersectionObserver, requestAnimationFrame,                 │
│                 matchMedia(prefers-reduced-motion), <img loading=lazy>       │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ (chỉ 1 phụ thuộc mạng lúc chạy)
                                ▼
                        Google Fonts (Fraunces, Manrope, IBM Plex Mono)
```

---

## 2. Frontend (WHAT / HOW)

- **WHAT:** Toàn bộ ứng dụng. React dựng cây component, CSS Modules tạo style scoped, tokens.css cấp biến thiết kế.
- **HOW render:** Client-Side Rendering. `index.html` gần như rỗng (`<div id="root">`), JS tải xong mới dựng DOM. Xem `06`.
- **State:** hai loại — (1) **UI state cục bộ** (progress %, đã reveal chưa) bằng `useState`/`useRef`; (2) **App state chia sẻ** = ngôn ngữ hiện tại, bằng **React Context** (`LanguageProvider`). Không có global store (Redux/Zustand) vì state quá nhỏ — xem `10`.
- **WHERE:** `src/`.

## 3. "Backend" = Static Host (WHY không có server)

Đây là phần dễ gây hiểu nhầm nhất, nên nói rõ:

> **Vai trò "backend" ở hệ thống này do CDN GitHub Pages đảm nhiệm: nhận request HTTP, trả file tĩnh.** Không có tầng application server, không có xử lý logic theo request.

- **WHY không cần server:** Server tồn tại để (a) tính toán theo từng request, (b) giữ trạng thái/dữ liệu dùng chung, (c) bảo vệ tài nguyên bí mật. Portfolio **không có** cả ba: nội dung như nhau với mọi người, không có dữ liệu người dùng, không có secret. ⇒ Thêm server chỉ tạo thêm điểm hỏng, chi phí, bề mặt tấn công.
- **Hệ quả tích cực:** scale gần như vô hạn (CDN), khả dụng cao, không cần vá bảo mật server, không cần scaling/load balancer.
- Chi tiết ở `05_Backend_Architecture.md`.

## 4. Database — không có, thay bằng "content-as-code" (WHY)

- **WHAT thay thế:** `src/i18n/content.{vi,en}.ts` là "bảng dữ liệu"; `src/i18n/types.ts` là "schema"; Git là "nơi lưu trữ + lịch sử".
- **WHY:** Dữ liệu nhỏ, đọc-nhiều-ghi-hiếm, một người quản lý. Database (Postgres/Mongo/Supabase) sẽ là over-engineering: thêm hạ tầng, kết nối, migration, backup — cho thứ mà một file `.ts` + Git giải quyết gọn hơn và **type-safe**.
- **WHEN nào nên đổi:** nếu cần người phi kỹ thuật tự sửa nội dung, hoặc nội dung động theo người dùng ⇒ lúc đó thêm Headless CMS (Contentful/Sanity) hoặc DB. Xem trade-off ở `10`.

## 5. Hosting & Deployment (WHERE / WHEN / HOW)

- **Hosting:** GitHub Pages — CDN tĩnh, HTTPS, miễn phí cho repo public.
- **CI/CD:** `.github/workflows/deploy.yml`:
  1. `on: push` nhánh `main` (hoặc chạy tay `workflow_dispatch`).
  2. Job **build:** checkout → setup Node 22 (cache npm) → `npm ci` → `npm run build` → upload thư mục `dist/` làm Pages artifact.
  3. Job **deploy:** `actions/deploy-pages` publish artifact.
  4. `concurrency: {group: pages, cancel-in-progress: true}` — push mới hủy deploy đang chạy (tránh race).
- **WHY GitHub Pages + Actions:** repo đã ở GitHub; pipeline "push là deploy" đơn giản, không thêm nhà cung cấp. Đánh đổi so với Vercel/Netlify: xem `03` & `10`.
- **Base path:** production phục vụ ở `/portfodio/` ⇒ `vite.config.ts` đặt `base` tương ứng; asset URL phải qua helper `asset()` (mục 8).

## 6. AI Services (WHERE — quan trọng để không hiểu nhầm)

- **Runtime:** **KHÔNG có AI** trong sản phẩm chạy. Không có mô hình, không gọi LLM API.
- **Build/authoring time:** AI (trợ lý code) được dùng để *xây dựng* dự án. Đây là "AI trong quy trình phát triển", không phải "AI trong kiến trúc hệ thống". Phân biệt này quan trọng với một Software Architect: đừng nhầm công cụ tạo ra hệ thống với thành phần của hệ thống.

## 7. External APIs (dependency ngoài)

| Dịch vụ ngoài | Loại | Lúc nào | Rủi ro & giảm thiểu |
|---|---|---|---|
| **Google Fonts** | CSS/font CDN | Runtime, khi tải trang | Là phụ thuộc mạng bên thứ ba duy nhất. Có `preconnect` để giảm trễ; `display=swap` để không chặn render. Nếu Google Fonts chậm/chặn ⇒ fallback `system-ui`/serif đã khai báo trong tokens. Muốn tự chủ hoàn toàn: self-host font (đánh đổi: tự quản lý file, subset). |
| **GitHub Pages** | Hosting CDN | Runtime | Nếu Pages down ⇒ site down. SLA CDN cao; chấp nhận với portfolio. |

## 8. Authentication / Authorization / Storage / Session (WHY vắng mặt)

- **Auth/Authz:** không có vì **không có tài nguyên riêng tư nào để bảo vệ** và không có hành động thay đổi dữ liệu phía server. Mọi thứ là công khai, read-only.
- **Storage/Session/Cookie/JWT:** không có vì không có phiên người dùng, không có trạng thái cần nhớ giữa các lần truy cập. (Ngôn ngữ hiện tại chỉ giữ trong bộ nhớ React, reset khi F5 — một lựa chọn đơn giản có chủ đích; xem `07`.)
- **Bài học kiến trúc:** chỉ thêm auth/session **khi có tài nguyên cần bảo vệ hoặc trạng thái cần bền vững**. Thêm sớm = nợ kỹ thuật + rủi ro bảo mật vô ích.

## 9. Monitoring / Observability (hiện trạng & hướng mở rộng)

- **Hiện tại:** không có analytics/RUM/error tracking (tôn trọng quyền riêng tư & giữ zero-dependency).
- **Nếu cần đo hiệu quả tuyển dụng:** thêm privacy-friendly analytics (Plausible/Umami) hoặc RUM (web-vitals → endpoint). Đây là điểm mở rộng "không hối tiếc" vì tách rời phần lõi. Xem `11`.

## 10. Luồng giữa các thành phần (tóm tắt, chi tiết ở 06/07)

1. **Deploy flow:** dev `git push` → Actions build `dist/` → publish lên Pages CDN.
2. **Load flow:** browser GET `index.html` → tải JS/CSS/webp từ CDN → React render.
3. **Interaction flow:** mọi tương tác (đổi ngôn ngữ, cuộn, click nav) xử lý **hoàn toàn ở client**, không round-trip server.

## 11. Quality Gate

- ✅ WHY cho từng thành phần **có** (FE, CDN, CI/CD) và **không có** (BE, DB, Auth, AI).
- ✅ Trade-off: server-less, DB-less, font ngoài.
- ✅ Sơ đồ 3 mặt phẳng (Build / Serving / Client).
- ✅ Architect mindset: phân biệt "AI xây dựng hệ thống" vs "AI trong hệ thống".

**Đọc tiếp:** `03_Tech_Stack_Analysis.md`.
