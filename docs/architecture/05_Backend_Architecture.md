# 05 — Backend Architecture

> **Tuyên bố thẳng:** Hệ thống này **không có backend truyền thống** (không application server, không API, không DB). Điều đó là **có chủ đích**. Tài liệu này (a) giải thích tại sao, (b) ánh xạ từng "tầng backend kinh điển" sang thứ đóng vai trò tương đương ở đây, và (c) chỉ ra *khi nào* bạn sẽ cần thêm backend thật.

Hiểu được **khi nào KHÔNG cần backend** là một trong những dấu hiệu trưởng thành nhất của một Software Architect. Thêm backend "cho chắc" là nguồn gốc của nợ kỹ thuật, chi phí, và bề mặt tấn công.

---

## 1. "Backend" ở đây là gì (WHAT)

Vai trò tối thiểu của một backend web = *nhận HTTP request, trả về phản hồi*. Ở hệ thống này, vai trò đó do **GitHub Pages CDN** đảm nhiệm: nó nhận `GET /portfodio/...` và trả file tĩnh (HTML/JS/CSS/WebP). **Không có logic theo request.**

```
Client ──GET──►  CDN (GitHub Pages)  ──►  đọc file tĩnh từ artifact ──►  200 + bytes
                 (TLS, cache, edge)        (không tính toán, không DB)
```

## 2. Tại sao không cần backend (WHY — ba câu hỏi kiểm tra)

Một backend chỉ cần thiết nếu trả lời **"có"** cho ít nhất một câu:

| Câu hỏi | Portfolio? | Hệ quả |
|---|---|---|
| Có cần **tính toán khác nhau theo từng request/người dùng** không? | ❌ Không (ai xem cũng như nhau) | Không cần compute layer |
| Có **dữ liệu dùng chung cần đọc/ghi bền vững** (state) không? | ❌ Không (nội dung tĩnh, không ai ghi) | Không cần DB |
| Có **bí mật/tài nguyên cần bảo vệ** sau đăng nhập không? | ❌ Không (mọi thứ công khai) | Không cần auth/server |

Cả ba "không" ⇒ backend là **accidental complexity**. Loại bỏ nó cho: chi phí ~0, khả dụng cao (CDN), bề mặt tấn công gần 0, không vá bảo mật server, không lo scaling.

## 3. Ánh xạ "tầng backend kinh điển" → thực tế ở đây

Yêu cầu tài liệu nhắc tới API/Service/Repository/DB/DI/Auth/Middleware/Validation/Caching/Business logic. Ánh xạ trung thực:

| Tầng kinh điển | Vai trò của nó | Ở hệ thống này ai đóng? |
|---|---|---|
| **API Layer** | endpoint nhận request | ❌ Không có. CDN chỉ trả file. Mọi "API" tương lai sẽ là external service gọi từ client. |
| **Service Layer** (business logic) | quy tắc nghiệp vụ | Rất mỏng và **ở client**: chọn ngôn ngữ (`toggle`), chọn accent theme, tính % cuộn. Đó là toàn bộ "logic". |
| **Repository Layer** | truy cập dữ liệu | Thay bằng **import tĩnh**: `CONTENT[locale]` trong `i18n/index.ts`. "Truy vấn" = truy cập object. |
| **Database** | lưu trữ bền vững | **Git + file `.ts`** (content-as-code). Lịch sử = git log. |
| **Dependency Injection** | ghép phụ thuộc | Thay bằng **React Context** (`LanguageProvider` "inject" content xuống cây) và module imports. |
| **Authentication** | biết bạn là ai | ❌ Không có — không có phiên người dùng. |
| **Authorization** | bạn được làm gì | ❌ Không có — mọi thứ read-only công khai. |
| **Middleware** | xử lý xuyên suốt request | Gần nhất: **CI pipeline** (Actions) + **CDN** (TLS, cache) — "middleware" ở tầng hạ tầng, không ở app. |
| **Validation** | kiểm tra dữ liệu hợp lệ | **TypeScript lúc build** (`content` phải thỏa `PortfolioContent`) + **ESLint**. Validation dịch sang *compile-time*, không *runtime*. |
| **Caching** | tăng tốc đọc | **CDN cache** + **filename hashing** (Vite) cho cache bất biến; **manifest** cache kích thước ảnh. |
| **Business Logic** | lõi nghiệp vụ | Nghiệp vụ ở đây là *trình bày thông tin* ⇒ nằm trong content + component, không cần server. |

**Insight kiến trúc:** các "tầng" không biến mất — chúng **dịch chuyển pha (shift)**: validation → build-time, data access → static import, DI → Context, caching → CDN+hashing. Một Architect nhìn ra "chức năng vẫn còn, chỉ đổi chỗ thực thi".

## 4. Build Pipeline như một "backend build-time" (HOW)

Thứ gần nhất với "xử lý phía sau" là **pipeline build** — chạy trên CI, không phục vụ người dùng theo request:

```
git push (main)
   └► GitHub Actions (deploy.yml)
        job build:
          checkout → setup-node@22 (cache npm) → npm ci
          → npm run build  ==  tsc -b (validate)  &&  vite build (bundle)
          → upload-pages-artifact(dist/)
        job deploy:
          deploy-pages → publish lên CDN
   concurrency: pages, cancel-in-progress  (push mới huỷ deploy cũ)
```

- Đây là nơi "logic phía sau" thực sự xảy ra: **validate dữ liệu (tsc), biến đổi (bundle), tối ưu (đã làm ảnh trước đó bằng sharp), phát hành**. Nhưng nó xảy ra **một lần lúc deploy**, không phải mỗi request ⇒ chi phí phân bổ về 0 cho người xem.

## 5. Khi nào cần thêm backend thật (WHEN — hướng tiến hoá)

Kiến trúc hiện tại "đúng cho hôm nay". Nó sẽ cần một backend khi xuất hiện một trong các nhu cầu sau — và cách thêm **ít hối tiếc**:

| Nhu cầu mới | Vì sao cần backend | Cách thêm gọn nhất (không đập đi xây lại) |
|---|---|---|
| **Form liên hệ gửi email** | cần secret (API key) + gửi mail | Serverless function (Vercel/Netlify/Cloudflare Worker) hoặc dịch vụ form (Formspree). Client `fetch` tới endpoint. |
| **Nội dung do người phi kỹ thuật sửa** | cần chỗ lưu + editor | Headless CMS (Sanity/Contentful) → build-time fetch (giữ tĩnh) hoặc runtime fetch. |
| **Lượt xem / analytics** | cần lưu & tổng hợp | Privacy analytics (Plausible/Umami) — script nhỏ, backend của họ. |
| **Bình luận / like** | ghi dữ liệu người dùng | BaaS (Supabase/Firebase) — DB + auth quản lý sẵn. |
| **Nội dung cá nhân hoá / A-B test** | logic theo người dùng | Edge function (chạy tại CDN edge) — giữ độ trễ thấp. |

- **Nguyên tắc tiến hoá:** giữ **lõi tĩnh**, thêm khả năng động ở **rìa** (serverless/edge/BaaS). Đừng biến toàn bộ thành app server chỉ vì một tính năng nhỏ. Đây là "islands of dynamism trên nền tĩnh".

## 6. 5W1H tóm tắt

- **WHY không backend:** không có compute-per-request, không state chung, không secret cần bảo vệ.
- **WHAT đóng vai backend:** CDN (serve) + CI pipeline (build/validate/deploy).
- **WHO bảo trì:** 1 developer; kiến trúc phải vận hành-được-bởi-1-người ⇒ serverless.
- **WHEN cần thật:** khi có form/CMS/analytics/ghi-dữ-liệu.
- **WHERE:** logic build ở CI; logic runtime (mỏng) ở client.
- **HOW mở rộng:** thêm serverless/edge/BaaS ở rìa, giữ lõi tĩnh.

## 7. Quality Gate

- ✅ WHY: 3 câu hỏi kiểm tra sự cần thiết của backend.
- ✅ Ánh xạ **đầy đủ** mọi tầng kinh điển (API/Service/Repo/DB/DI/Auth/Middleware/Validation/Caching) sang thực tế.
- ✅ Trade-off & lộ trình tiến hoá (khi nào thêm gì).
- ✅ Architect mindset: "tầng không mất, chỉ dịch pha thực thi".

**Đọc tiếp:** `06_Request_Response_Flow.md`.
