# 06 — Request / Response Flow

Tài liệu này lần theo **từng bước** một request từ lúc gõ URL đến khi thấy giao diện, và các **tương tác** sau đó. Điểm mấu chốt cần khắc sâu: sau khi tải xong, **hầu như không còn request nào tới server** — mọi tương tác xử lý ở client. Ta cũng đối chiếu với luồng FE→BE→DB kinh điển để bạn *thấy sự khác biệt*.

---

## 1. Flow A — Tải trang lần đầu (Initial Load)

```
[1] Người xem gõ URL / click link
        │  GET https://quyen0723.github.io/portfodio/
        ▼
[2] DNS → GitHub Pages CDN (edge gần nhất) → TLS handshake
        ▼
[3] CDN trả index.html   (nhỏ; chứa <head> meta/OG/JSON-LD tĩnh + <div id="root"> + <script type=module src=/portfodio/assets/index-[hash].js>)
        ▼
[4] Trình duyệt parse HTML:
        • thấy <link preconnect> Google Fonts → mở kết nối sớm
        • thấy <link rel=stylesheet ...index-[hash].css> → tải CSS (render-blocking, nhưng nhỏ)
        • thấy <script type=module> → tải JS bundle
        │
        ├─(song song)─► GET assets/react-[hash].js   (vendor React, cache dài hạn)
        ├─(song song)─► GET assets/index-[hash].js    (code app)
        └─(song song)─► GET assets/index-[hash].css    (styles)
        ▼
[5] JS thực thi:  main.tsx
        createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>)
        ▼
[6] App render:
        LanguageProvider (locale='vi' mặc định)
          → ScrollProgress + NavBar + <main>{Hero…Contact}</main>
          → useEffect: document.documentElement.lang = 'vi'
        ▼
[7] React dựng DOM thật → trình duyệt sơn (first contentful paint)
        • Hero <img fetchPriority="high"> tải ảnh chân dung (LCP)
        • Các <img loading="lazy"> phía dưới hoãn tới khi gần viewport
        ▼
[8] Sau paint:
        • useReveal đăng ký các .reveal vào IntersectionObserver
        • useScrollProgress gắn listener scroll (rAF)
        • Google Fonts về → chữ swap sang Fraunces/Manrope/IBM Plex Mono
        ▼
[9] Trang tương tác đầy đủ (interactive). KHÔNG còn request nghiệp vụ nào.
```

**Giải thích từng bước (WHY quan trọng):**

- **[3] HTML gần rỗng:** vì CSR, nội dung chưa có trong HTML — đây là *đánh đổi của SPA*. Bù lại: `<head>` chứa **meta/OG/JSON-LD tĩnh** để bot mạng xã hội & Google (chạy JS) vẫn đọc được mô tả.
- **[4] Tải song song + hashing:** tên file có hash ⇒ CDN cache "bất biến"; lần sau chỉ tải file đổi. `react-[hash].js` tách riêng (manualChunks) nên khi chỉ sửa nội dung, người dùng cũ vẫn dùng lại vendor cache.
- **[7] LCP vs lazy:** ảnh Hero ưu tiên (`fetchPriority=high`) vì là "Largest Contentful Paint"; ảnh dưới `loading=lazy` để không tranh băng thông lúc đầu.
- **[8] Reveal & progress khởi động sau paint:** không chặn hiển thị nội dung.

## 2. Flow B — Tương tác: Đổi ngôn ngữ (VI ⇄ EN)

Đây là ví dụ "user click → state → render" **thuần client**, không có mạng:

```
[1] User click nút ngôn ngữ trong NavBar  (nhãn "EN" hoặc "VI")
        │  onClick={toggle}
        ▼
[2] toggle() (trong LanguageProvider) gọi setLocale(prev => prev==='en'?'vi':'en')
        ▼
[3] React đổi state locale → Provider tính lại value (useMemo phụ thuộc [locale,toggle])
        content = CONTENT[locale]  // đổi từ vi → en
        ▼
[4] Mọi component gọi useLanguage() nhận content mới → re-render với text ngôn ngữ mới
        ▼
[5] useEffect trong App chạy lại: document.documentElement.lang = 'en'
        ▼
[6] DOM cập nhật (React reconciliation chỉ đổi text đổi) → người xem thấy tiếng Anh
```

- **KHÔNG có request:** cả hai ngôn ngữ đã nằm trong bundle. Đổi ngôn ngữ = đổi con trỏ dữ liệu trong bộ nhớ + re-render. Độ trễ ~ vài mili-giây.
- **Trade-off:** bundle chứa **cả hai** ngôn ngữ (to hơn một chút) ⇄ đổi ngôn ngữ tức thì, offline-friendly, không round-trip. Với 2 ngôn ngữ text ⇒ đánh đổi hợp lý. (Nếu 10 ngôn ngữ nặng ⇒ cân nhắc tách bundle theo locale / lazy import.)

## 3. Flow C — Tương tác: Cuộn trang (Reveal + Progress + Anchor nav)

```
Cuộn:
  • Scroll event → useScrollProgress: rAF → tính (scrollTop / (scrollHeight-clientHeight))*100
        → set state progress → thanh ScrollProgress đổi width%
  • Phần tử .reveal vào viewport → IntersectionObserver callback
        → thêm class .is-visible → CSS transition fade/slide-in → observer.unobserve (chạy 1 lần)
Click mục nav (#work):
  • Trình duyệt cuộn mượt tới #work (scroll-behavior:smooth) + scroll-margin-top offset nav
  • (nếu prefers-reduced-motion: cuộn tức thì, không animation)
```

- **WHY rAF cho progress:** scroll bắn rất nhiều event; gộp cập nhật vào 1 khung hình/refresh ⇒ mượt, không nghẽn main thread.
- **WHY 1 observer chia sẻ:** hàng chục `.reveal`; một observer dùng chung tiết kiệm bộ nhớ/CPU so với mỗi phần tử một observer.

## 4. Đối chiếu với luồng FE→BE→DB kinh điển (để *thấy* khác biệt)

Sơ đồ mà đề bài mô tả (User click → FE → State → API → BE → Business Logic → DB → Response → Render) là của **app động có server**. Ở portfolio này, phần "API → BE → Business Logic → DB → Response" **bị lược bỏ** vì dữ liệu đã ở client:

| Bước kinh điển | Ở portfolio |
|---|---|
| User click | ✅ có (đổi ngôn ngữ, cuộn, nav) |
| Frontend | ✅ có (React) |
| State update | ✅ có (Context/local state) |
| **API call** | ❌ không (dữ liệu đã in-bundle) |
| **Backend** | ❌ không |
| **Business logic (server)** | ❌ không (logic mỏng ở client) |
| **Database** | ❌ không (static import) |
| **Response (network)** | ❌ không (đọc từ bộ nhớ) |
| Frontend render | ✅ có |

- **Bài học:** khi dữ liệu & logic đủ nhỏ để "nướng" vào client lúc build, bạn **cắt bỏ toàn bộ nửa phải của sơ đồ** ⇒ độ trễ tương tác gần như bằng 0, không có điểm hỏng mạng. Đây là sức mạnh của kiến trúc static-first cho đúng loại bài toán.

## 5. Nơi *sẽ* xuất hiện request nếu mở rộng (WHEN)

- Form liên hệ → `fetch(POST)` tới serverless/endpoint (Flow mới: client → edge function → email service).
- CMS runtime → `fetch(GET)` nội dung khi tải.
- Analytics → beacon `fetch`/`sendBeacon` gửi số liệu.

Lúc đó Flow A sẽ có thêm nhánh mạng; nhưng lõi hiển thị vẫn tĩnh.

## 6. Quality Gate

- ✅ Từng bước Load/Interaction giải thích + WHY.
- ✅ Nêu rõ "không có request sau tải" và trade-off bundle chứa 2 ngôn ngữ.
- ✅ Đối chiếu tường minh với luồng FE→BE→DB kinh điển.
- ✅ Performance framing: LCP, lazy, rAF, shared observer, hashing/cache.

**Đọc tiếp:** `07_Data_Flow.md`.
