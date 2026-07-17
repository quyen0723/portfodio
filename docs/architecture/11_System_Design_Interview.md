# 11 — System Design Interview

Phân tích portfolio này như một **bài System Design** (kiểu phỏng vấn FAANG): làm rõ yêu cầu, ước lượng quy mô, và soi qua các trục **Scalability · Availability · Reliability · Performance · Security · Maintainability**. Mục tiêu: luyện tư duy đánh đổi, biết "đúng quy mô" (right-sizing) thay vì over-engineer.

> Bài học lớn nhất của một buổi system design tốt: **kiến trúc phải khớp với yêu cầu**. Portfolio tĩnh là ví dụ mẫu mực của "đơn giản là đúng" — nhiều ứng viên trượt vì vẽ Kafka/microservices cho bài toán chỉ cần CDN.

---

## 1. Làm rõ yêu cầu (Requirements Clarification)

### Functional Requirements
- FR1: Hiển thị hồ sơ: hero, giới thiệu, hành trình, triết lý, dự án, nghiên cứu, giải thưởng, kỹ năng, ngoài-code, liên hệ.
- FR2: Song ngữ VI/EN, đổi tức thì.
- FR3: Điều hướng trong trang (anchor) + thanh tiến trình đọc.
- FR4: Liên kết ngoài (email, LinkedIn, GitHub, ORCID…).
- FR5: Responsive mọi thiết bị; animation reveal.

### Non-Functional Requirements (NFR)
- NFR1 **Performance:** LCP nhanh, CLS≈0, bundle nhỏ (Lighthouse cao).
- NFR2 **Availability:** ~luôn sẵn sàng (CDN).
- NFR3 **Cost:** ~$0.
- NFR4 **Maintainability:** 1 người + AI bảo trì; thêm nội dung dễ, type-safe.
- NFR5 **Accessibility:** WCAG-friendly (semantic, focus, reduced-motion, alt).
- NFR6 **Security/Privacy:** không thu thập dữ liệu; bề mặt tấn công tối thiểu.
- NFR7 **SEO cơ bản:** meta/OG/JSON-LD; (SEO nâng cao là điểm mở — ADR-011).

### Ngoài phạm vi (Out of scope)
- Không đăng nhập, không nội dung do người dùng tạo, không realtime, không thanh toán.

## 2. Ước lượng quy mô (Back-of-envelope)

- **Traffic:** portfolio cá nhân — cỡ 10²–10⁴ lượt xem/tháng, bursty (khi nộp đơn/chia sẻ). Không phải bài toán QPS lớn.
- **Payload/lượt:** HTML (~vài KB) + JS (~185KB: ~142KB React vendor + ~43KB app) + CSS (~20KB) + ảnh (WebP, vài chục–vài trăm KB mỗi ảnh, lazy). Tổng first view vài trăm KB.
- **Compute:** 0 phía server (chỉ đọc file). **Storage:** vài MB tài sản tĩnh.
- **Kết luận right-sizing:** một **CDN tĩnh** thừa sức phục vụ; không cần app server/DB/queue/cache layer riêng. Đây chính là "đáp án đúng" của bài design này.

## 3. High-Level Design

```
Người xem ──HTTPS──► CDN edge (GitHub Pages) ──► artifact tĩnh (HTML/JS/CSS/WebP)
   ▲                                   ▲
   │ tương tác client-side             │ publish
   │ (i18n, reveal, progress)          │
   └───────────────────────┐   GitHub Actions ◄── git push (nguồn: React+TS+content)
                           └── Google Fonts (phụ thuộc runtime duy nhất)
```

Ranh giới: **read-only, stateless, no-auth**. Mọi tính toán ở client hoặc build-time.

## 4. Deep-dive theo trục NFR

### 4.1. Scalability
- **Cách scale:** CDN nhân bản file ra edge; thêm người xem = thêm cache hit, không thêm tải "gốc". **Scale gần như vô hạn, tuyến tính, tự động.**
- **Bottleneck?** Không có bottleneck compute/DB (vì không có). "Giới hạn" chỉ là băng thông/CDN của nhà cung cấp — dư thừa cho quy mô này.
- **Nếu 100× traffic:** không cần đổi gì (CDN lo). Nếu thêm tính năng động ⇒ scale phần đó riêng ở edge/serverless.

### 4.2. Availability
- **Nguồn khả dụng:** SLA của GitHub Pages CDN (cao). Không có thành phần stateful tự vận hành để hỏng.
- **Điểm hỏng đơn (SPOF):** (1) Pages down → site down; (2) Google Fonts down/chậm → chữ dùng fallback (đã khai báo), site vẫn chạy.
- **Cải thiện nếu cần 99.99%:** đa CDN / self-host font để bỏ phụ thuộc ngoài.

### 4.3. Reliability
- **Deploy an toàn:** build fail (tsc/vite) ⇒ **không publish** (CI chặn) ⇒ live luôn ở trạng thái tốt gần nhất.
- **Rollback:** revert commit → Actions deploy lại bản cũ. Bất biến & versioned theo Git.
- **Không có dữ liệu runtime ⇒ không có corruption/consistency issue.**

### 4.4. Performance
- **LCP:** ảnh hero `fetchPriority=high`, WebP nhẹ, kích thước khai báo.
- **CLS≈0:** mọi `<img>` có `width/height` (từ manifest) hoặc `aspect-ratio`.
- **JS nhỏ + split:** React vendor tách chunk (cache dài hạn); app chunk nhỏ.
- **CSS:** zero-runtime, nhỏ, `prefers-reduced-motion` cắt animation.
- **Fonts:** `preconnect` + `display=swap` (không chặn render).
- **Cache:** filename hashing ⇒ cache bất biến; CDN edge cache.
- **Ảnh dưới màn:** `loading=lazy`.

### 4.5. Security
- **Bề mặt tấn công tối thiểu:** không server/DB/API ⇒ không SQLi, không auth bypass, không SSRF.
- **XSS:** không dùng `dangerouslySetInnerHTML`; React escape mặc định; nội dung là dữ liệu tĩnh do chủ sở hữu viết (không phải input người dùng).
- **Liên kết ngoài:** `target=_blank` kèm `rel="noopener noreferrer"` (chống tabnabbing).
- **Transport:** HTTPS bắt buộc (Pages).
- **Điểm có thể cứng hoá thêm:** Content-Security-Policy header (Pages hạn chế custom header; có thể qua `<meta http-equiv>` hoặc chuyển CDN cho phép header) — điểm mở.
- **Privacy:** không cookie/analytics ⇒ không PII, không cần consent banner.

### 4.6. Maintainability
- **Type-safe content:** thêm mục sai cấu trúc ⇒ fail build.
- **Design tokens:** đổi thương hiệu 1 chỗ.
- **Feature-based:** định vị & mở rộng dễ.
- **Lint/format gate:** ESLint + a11y.
- **CI đơn giản:** ai cũng đọc hiểu `deploy.yml`.

## 5. Trade-off tổng & "đúng quy mô"

| Nếu over-engineer (sai) | Vì sao sai ở đây |
|---|---|
| Microservices / API gateway | Không có nghiệp vụ server để tách |
| Database + ORM | Dữ liệu nhỏ, tĩnh, 1 người ⇒ file .ts đủ |
| Redux + saga | 1 biến state toàn cục |
| SSR cluster | Không cá nhân hoá; CDN đủ |
| K8s / container | Không có process server để chạy |

- **Thông điệp phỏng vấn:** thể hiện bạn biết **khi nào KHÔNG dùng** công cụ mạnh. Đó là dấu hiệu senior/architect.

## 6. Câu hỏi mở rộng thường gặp (và hướng trả lời)
- *"Thêm form liên hệ?"* → serverless function + dịch vụ email; giữ lõi tĩnh (ADR-005 tư duy islands).
- *"Đa ngôn ngữ 10+?"* → tách bundle theo locale / lazy import để không phình bundle.
- *"SEO cho crawler không chạy JS?"* → prerender/SSG (ADR-011).
- *"Biết ai đang xem?"* → privacy analytics (ADR-012).
- *"Chịu 1M view/ngày?"* → CDN vốn đã lo; không đổi kiến trúc.

## 7. Quality Gate
- ✅ FR/NFR rõ ràng; ước lượng quy mô.
- ✅ Deep-dive đủ 6 trục (Scal/Avail/Rel/Perf/Sec/Maint) kèm số liệu bundle.
- ✅ Trade-off & "right-sizing" (khi nào KHÔNG over-engineer).
- ✅ Câu hỏi mở rộng có hướng xử lý.

**Đọc tiếp:** `12_Knowledge_Map.md`.
