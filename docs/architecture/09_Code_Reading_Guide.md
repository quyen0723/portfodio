# 09 — Code Reading Guide

Nếu bạn là developer mới nhận repo này, đây là **thứ tự đọc để hiểu nhanh mà không bị ngợp**. Nguyên tắc: đi từ **"hệ thống được lắp ráp & phát hành thế nào"** → **"dữ liệu ở đâu"** → **"UI được xây từ đâu"** → **"một tính năng chạy ra sao"**.

> Mẹo: đọc theo *luồng thực thi và luồng dữ liệu*, không đọc theo bảng chữ cái. Hiểu "xương sống" trước, "chi tiết" sau.

---

## Giai đoạn 0 — Bối cảnh (5 phút)
1. `README.md` — mục tiêu, stack, cách chạy, deploy.
2. `docs/architecture/01_Project_Overview.md` & `02_System_Architecture.md` — bức tranh lớn + ranh giới hệ thống.
   - **Cần rút ra:** đây là SPA tĩnh, không backend/DB/auth.

## Giai đoạn 1 — Hệ thống được lắp ráp & phát hành thế nào (15 phút)
3. `package.json` — đọc `scripts` (`dev`, `build = tsc -b && vite build`, `optimize:assets`) và `dependencies` (chỉ `react`, `react-dom`!).
   - **Cần rút ra:** runtime chỉ có React; mọi thứ khác là dev/build.
4. `vite.config.ts` — `base` (`/portfodio/` khi build), alias `@`, `manualChunks` (tách vendor React).
   - **Cần rút ra:** vì sao ảnh phải qua `asset()` (base path).
5. `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json` — project references, `strict`.
6. `.github/workflows/deploy.yml` — push → build → publish Pages.
   - **Cần rút ra:** vòng đời từ commit tới live.

## Giai đoạn 2 — Điểm vào & khung ứng dụng (10 phút)
7. `src/main.tsx` — `createRoot(#root).render(<StrictMode><App/></StrictMode>)` + import `global.css`.
8. `src/App.tsx` — **composition root**: `LanguageProvider` bọc `Page`; `Page` = `ScrollProgress + NavBar + <main>{11 sections}</main>`; `useEffect` set `html.lang`; wrapper `data-accent`.
   - **Cần rút ra:** thứ tự section & cách Provider bọc toàn cây.

## Giai đoạn 3 — Hệ thống thiết kế (10 phút)
9. `src/styles/tokens.css` — **đọc kỹ**: đây là "bảng màu/nhịp" của cả site + 3 accent theme.
10. `src/styles/global.css` — reset, `.reveal`, a11y, reduced-motion.
    - **Cần rút ra:** mọi `*.module.css` chỉ *tiêu thụ* biến ở đây.

## Giai đoạn 4 — Tầng dữ liệu / i18n (15 phút) — *quan trọng nhất để hiểu nội dung*
11. `src/i18n/types.ts` — **đọc trước tiên**: mô hình dữ liệu (`PortfolioContent`, `Project`, `Award`…). Hiểu schema = hiểu toàn bộ nội dung.
12. `src/i18n/content.vi.ts` (lướt) — thấy dữ liệu thật khớp schema thế nào.
13. `src/i18n/index.ts` → `LanguageContext.tsx` → `src/hooks/useLanguage.ts` — cách dữ liệu tới component qua Context.
    - **Cần rút ra:** `useLanguage().content` là "cửa" mọi feature lấy text.

## Giai đoạn 5 — Atoms tái dùng (15 phút)
14. Đọc theo cụm, mỗi cái rất nhỏ: `Container` → `Section` → `Reveal` → `Eyebrow` → `SectionHeading` → `Button` → `Chip` → `MonoLabel` → `ScrollProgress` (kèm `.module.css`).
    - **Cần rút ra:** "bộ Lego" để lắp mọi section; cách biến thể qua props.
15. Hooks còn lại: `src/hooks/useReveal.ts` (observer chia sẻ) & `src/hooks/useScrollProgress.ts` (rAF).

## Giai đoạn 6 — Một feature đầu-cuối (20 phút)
16. `src/features/hero/Hero.tsx` + `Hero.module.css` — feature giàu nhất: dùng `Reveal`, `Chip`, `Button`, `Eyebrow`, `asset()`, `fetchPriority`, badge, blob animation.
    - **Cần rút ra:** công thức chung của một section.
17. `src/features/awards/Awards.tsx` (+ `ProjectCard` ở `work/`) — ví dụ **data-driven** (`content.awards.map`) + biến thể poster (CSS var `--poster-bg`, blurred backdrop) + grid 3×2 responsive.
    - **Cần rút ra:** thêm 1 mục dữ liệu là UI mọc thêm; cách xử lý ảnh full-vs-crop.

## Giai đoạn 7 — Pipeline ảnh (10 phút)
18. `scripts/optimize-assets.mjs` — sharp: JPEG → WebP + `manifest.json`.
19. `src/lib/asset.ts` — `asset()`/`assetSize()` nối manifest với `<img>`.
    - **Cần rút ra:** vòng đời ảnh & vì sao chống CLS.

## Sau khi đọc xong, bạn nên trả lời được:
- Dữ liệu nội dung sống ở đâu và tới màn hình bằng đường nào? → i18n → Context → component.
- Vì sao không có backend/DB? → `05`.
- Thêm một giải thưởng mới cần sửa file nào? → `content.*.ts` (+ ảnh qua script).
- Đổi màu chủ đạo toàn site? → `tokens.css`.
- Vì sao ảnh không vỡ khi deploy ở `/portfodio/`? → `asset()` + `BASE_URL`.

## Anti-pattern khi đọc (tránh)
- ❌ Đọc bảng chữ cái từng file rời rạc → mất mạch.
- ❌ Nhảy vào `*.module.css` trước khi đọc `tokens.css` → không hiểu biến.
- ❌ Đọc feature trước khi đọc `types.ts`/Context → không hiểu dữ liệu ở đâu ra.

## Bản đồ "đọc 60 phút" (nếu gấp)
`README → 02 → package.json → App.tsx → tokens.css → types.ts → useLanguage → Hero.tsx → Awards.tsx → asset.ts`. Bấy nhiêu đủ để sửa nội dung & UI an toàn.

## Quality Gate
- ✅ Thứ tự theo luồng thực thi/dữ liệu, có "cần rút ra" mỗi bước.
- ✅ Ước lượng thời gian, lộ trình gấp 60 phút, anti-pattern.
- ✅ Kết nối tới các doc khác (05, tokens, i18n).

**Đọc tiếp:** `10_Architecture_Decision_Record.md`.
