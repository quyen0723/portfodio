# 07 — Data Flow

Tài liệu này theo dấu **dữ liệu** trong hệ thống: nội dung text, dữ liệu ảnh, và trạng thái UI. Đồng thời trả lời trung thực về các khái niệm CRUD / cache / storage / session / cookie / JWT / token — cái nào có, cái nào không, và **tại sao**.

---

## 1. Hai dòng dữ liệu chính

```
DÒNG 1 — Nội dung (text VI/EN, danh sách giải thưởng/dự án…)
  content.vi.ts / content.en.ts  (author viết tay, TS kiểm kiểu)
      │  build: được bundle vào JS
      ▼
  CONTENT = { en, vi }  (i18n/index.ts)
      │  runtime: LanguageProvider chọn theo locale
      ▼
  useLanguage().content  →  component render text

DÒNG 2 — Ảnh
  assets/*.jpg (nguồn, KHÔNG deploy)
      │  build-time: scripts/optimize-assets.mjs (sharp)
      ├─►  public/assets/*.webp        (bản tối ưu, được deploy)
      └─►  src/assets.manifest.json    (width/height mỗi ảnh)
      │  runtime:
      ▼
  asset('assets/x.webp')      → BASE_URL + path  (URL đúng theo môi trường)
  assetSize('assets/x.webp')  → {width,height}   (đặt vào <img> chống CLS)
      ▼
  <img src=… width=… height=…>  → trình duyệt GET .webp từ CDN
```

- **Điểm tinh tế:** ảnh **nguồn** (`assets/*.jpg`) bị `.gitignore`/không phục vụ; chỉ bản `.webp` trong `public/assets` được deploy. `manifest.json` là "cầu nối" giữa build-time (biết kích thước) và runtime (đặt `width/height` để trình duyệt chừa chỗ ⇒ **CLS ≈ 0**).

## 2. CRUD — có không? (WHAT / WHY)

| Thao tác | Có ở runtime? | Giải thích |
|---|---|---|
| **Create/Update/Delete** | ❌ Không | Người xem không tạo/sửa/xoá gì. Nội dung chỉ thay đổi bởi **developer sửa file `.ts` rồi build lại** — đó là "write path" duy nhất, xảy ra lúc *authoring*, không lúc *runtime*. |
| **Read** | ✅ Có (đọc tĩnh) | "Đọc" = truy cập object đã bundle (`CONTENT[locale]`) hoặc GET file `.webp` từ CDN. Không có truy vấn DB. |

- **WHY không CRUD runtime:** không có tài nguyên do người dùng sở hữu, không có form ghi. CRUD sinh ra khi có "dữ liệu sống"; portfolio là "dữ liệu chết đẹp" (curated, tĩnh).

## 3. State (trạng thái) — vòng đời & nơi cư trú

| State | Nơi giữ | Bền vững? | Reset khi |
|---|---|---|---|
| `locale` (vi/en) | React state trong `LanguageProvider` (bộ nhớ) | ❌ Không (in-memory) | F5 / mở lại tab → về mặc định `vi` |
| `accent` theme | prop tĩnh `DEFAULT_ACCENT` trên wrapper | — | luôn `royal-blue` (chưa cho người dùng đổi) |
| `progress` (% cuộn) | `useState` trong `useScrollProgress` | ❌ | mỗi lần tải |
| "đã reveal chưa" | class DOM `.is-visible` do observer thêm | ❌ | mỗi lần tải |

- **Quyết định có chủ đích:** `locale` **không** được nhớ giữa các phiên. WHY: giữ đơn giản, tránh cookie/localStorage (⇒ không cần banner đồng thuận, không PII). Đánh đổi: người từng chọn EN sẽ thấy VI lại khi quay lại.
- **Nếu muốn nhớ:** lưu `locale` vào `localStorage` và đọc lúc khởi tạo Provider. Đây là nâng cấp nhỏ, "không hối tiếc" — nhưng cân nhắc quyền riêng tư/độ phức tạp. (Xem ADR ở `10` về "vì sao chưa làm".)

## 4. Cache — ở đâu (HOW)

Không có cache tầng ứng dụng (không Redis/HTTP cache thủ công), nhưng cache **vẫn tồn tại ở hạ tầng**:

- **CDN cache:** GitHub Pages CDN cache file tĩnh ở edge → người xem gần được phục vụ nhanh.
- **Filename hashing (Vite):** `index-[hash].js|css`, ảnh `.webp` tên cố định. File hash cho phép `Cache-Control` bất biến: đổi nội dung → hash đổi → URL mới → không lo cache cũ; file không đổi → dùng lại cache trình duyệt.
- **Manifest:** không phải cache mạng, mà là "cache kích thước ảnh" tính sẵn lúc build để runtime khỏi đo.

## 5. Storage / Session / Cookie / JWT / Token (WHY vắng mặt)

| Khái niệm | Có? | Vì sao |
|---|---|---|
| **localStorage / sessionStorage** | ❌ | Không cần nhớ gì giữa phiên (quyết định đơn giản hoá; có thể thêm cho `locale`). |
| **Cookie** | ❌ | Không có phiên/định danh; tránh cookie ⇒ không cần banner đồng thuận. |
| **Session (server)** | ❌ | Không có server giữ phiên. |
| **JWT / Token** | ❌ | Token dùng để *chứng minh danh tính/quyền*; ở đây không có đăng nhập, không tài nguyên bảo vệ ⇒ vô nghĩa. |
| **OAuth** | ❌ | Không đăng nhập. |

- **Bài học kiến trúc:** JWT/session/cookie là công cụ cho **auth & state phía server**. Đưa chúng vào một trang tĩnh công khai là **thêm rủi ro không đổi lấy giá trị**. Chỉ xuất hiện khi có đăng nhập/ghi dữ liệu.

## 6. Tính bất biến & nguồn sự thật (immutability & SoT)

- **Nội dung:** nguồn sự thật là file `.ts`; Git là lịch sử phiên bản (thay cho audit log/DB versioning).
- **Thiết kế:** nguồn sự thật là `tokens.css` (đổi 1 biến → toàn hệ đổi).
- **Ảnh:** nguồn là `assets/*.jpg`; bản phái sinh là `public/assets/*.webp` + `manifest.json` (tái tạo được bằng `npm run optimize:assets`).
- **WHY quan trọng:** mỗi loại dữ liệu có **đúng một** nơi định nghĩa ⇒ không mâu thuẫn, dễ suy luận, dễ đổi.

## 7. Sơ đồ vòng đời dữ liệu tổng (từ author tới mắt người xem)

```
Author (dev)                 Build (CI)                     Serve (CDN)          Runtime (browser)
────────────                 ──────────                     ──────────           ─────────────────
sửa content.*.ts   ─tsc validate─►  bundle JS   ─────────►  index-[hash].js  ─►  CONTENT[locale] → render text
thêm assets/*.jpg  ─sharp────────►  *.webp + manifest ────► assets/*.webp    ─►  <img> hiển thị
sửa tokens.css     ─────────────►  CSS Modules bundle ────► index-[hash].css ─►  áp dụng biến thiết kế
```

## 8. Quality Gate

- ✅ WHY cho từng thứ **không có**: CRUD runtime, session, cookie, JWT, token, localStorage.
- ✅ Vòng đời dữ liệu text & ảnh (author → build → serve → runtime).
- ✅ Trade-off: locale không bền vững; bundle chứa 2 ngôn ngữ.
- ✅ Nêu nguồn sự thật cho từng loại dữ liệu (immutability/SoT).

**Đọc tiếp:** `08_Folder_Explanation.md`.
