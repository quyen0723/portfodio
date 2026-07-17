import type { PortfolioContent } from './types'

export const vi: PortfolioContent = {
  navAbout: 'Giới thiệu',
  navWork: 'Dự án',
  navResearch: 'Nghiên cứu',
  navAwards: 'Giải thưởng',
  navCta: 'Liên hệ',
  langLabel: 'EN',

  heroEyebrow: 'Kỹ sư Phần mềm',
  heroTitleA: 'Mình xây sản phẩm và',
  heroTitleB: 'học mỗi ngày.',
  heroSub:
    'Mình biến ý tưởng thành sản phẩm, câu hỏi thành nghiên cứu, và thử thách thành lý do để lớn lên — dùng AI để tối ưu công việc, học bằng niềm vui, và đi xa hơn cùng đội nhóm.',
  chips: [
    'TP. Hồ Chí Minh',
    'Thạc sĩ AI — đang học',
    'Kỹ sư Kỹ thuật phần mềm — loại Giỏi',
  ],
  ctaWork: 'Xem dự án tiêu biểu',
  ctaContact: 'Liên hệ',
  heroProof: ['2× Best Paper — ICE 2026', 'Golden Key Student — FSB 2025'],
  heroBadge: 'Sẵn sàng cho cơ hội mới',

  aboutEyebrow: 'Giới thiệu',
  aboutTitle: 'Giữa sản phẩm, kỹ thuật và nghiên cứu.',
  aboutP1:
    'Mình bắt đầu từ một sinh viên yêu lập trình — và không ngừng mở rộng vòng tròn đó. Từ xây web/mobile, vận hành backend Python/Linux, đến tích hợp mô hình AI và công bố nghiên cứu bình duyệt.',
  aboutP2:
    'Hôm nay mình làm việc ở đường ranh giữa sản phẩm và kỹ thuật: biến yêu cầu mơ hồ thành đặc tả code-được, và dùng prompt engineering để đi nhanh hơn mà không hạ chuẩn.',
  aboutP3:
    'Mình tốt nghiệp Kỹ thuật phần mềm loại Giỏi (ĐH FPT) và đang học Thạc sĩ AI (FSB). Mình xây sản phẩm, học hỏi qua từng dự án, tìm tòi nghiên cứu, và cùng đội nhóm đi xa hơn — mỗi ngày.',

  journeyEyebrow: 'Hành trình',
  journeyTitle: 'Một lộ trình luôn cộng dồn giá trị.',
  journey: [
    {
      year: '2020–24',
      title: 'Kỹ sư Kỹ thuật phần mềm',
      desc: 'ĐH FPT, Cần Thơ — tốt nghiệp loại Giỏi.',
    },
    {
      year: '2022',
      title: 'Vô địch Tin học VP Thế giới',
      desc: 'Vô địch khu vực ĐBSCL (MOS – Viettel).',
    },
    {
      year: '2024',
      title: 'Sinh viên xuất sắc + đồ án',
      desc: 'Được ĐH FPT vinh danh; đồ án được đưa tin trên FPT Edu.',
    },
    {
      year: '2025',
      title: 'Golden Key & Thạc sĩ AI',
      desc: 'Vào Thạc sĩ AI (FSB); đạt Golden Key Student.',
    },
    {
      year: '2025→',
      title: 'Trưởng nhóm Kỹ thuật',
      desc: 'Dẫn dắt đội Mega Dev tại Deutschfuns.',
    },
    {
      year: '2026',
      title: 'Nhà nghiên cứu có công bố',
      desc: '2× Best Paper (ICE) và bài tạp chí TDMU.',
    },
  ],

  workEyebrow: 'Dự án tiêu biểu',
  workTitle: 'Một vài điều mình đã làm.',
  workIntro:
    'Hai dự án mình được góp sức — cùng đội nhóm phát triển một sản phẩm thật, và tham gia định hình kiến trúc cho một nền tảng.',
  lblProblem: 'Vấn đề',
  lblApproach: 'Cách tiếp cận',
  lblHighlights: 'Mình đã làm',
  lblStack: 'Công nghệ',
  lblImpact: 'Kết quả',
  lblMore: 'Các công việc kỹ thuật khác',
  projects: [
    {
      tag: 'Sản phẩm · Team Leader',
      year: '2025 – 2026',
      name: 'Phát triển sản phẩm LMS',
      sub: 'Deutschfuns · LMS học tiếng Đức',
      problem:
        'Nền tảng LMS cần ra tính năng mới đều đặn mà vẫn ổn định trước các đợt marketing lớn.',
      approach:
        'Phối hợp với Founder, COO, Technical Manager và các bộ phận khác để phát triển tính năng — lên kế hoạch, phân chia và quản lý task đội nhóm, viết tài liệu đặc tả, và triển khai ý tưởng thành công việc rõ ràng cho dev.',
      highlights: [
        'Phối hợp Founder, COO, Technical Manager & các bộ phận để lên kế hoạch tính năng',
        'Phân chia công việc, quản lý task đội nhóm và triển khai ý tưởng thành ticket rõ ràng cho dev',
        'Viết tài liệu đặc tả sản phẩm & kỹ thuật (PRD) cho tính năng mới',
        'Phát triển tính năng — module thanh toán, module bảo trì, UI/UX chatbox luyện nói,...',
        'Đảm bảo chất lượng qua code review & merge, quản lý deploy staging → production và nghiệm thu tính năng',
      ],
      stack: [
        'React',
        'Node.js',
        'NestJS',
        'PHP / WordPress',
        'Notion',
        'Asana',
        'Trello',
        'Lark',
        'Playwright',
      ],
      impact: 'Tính năng ra đều đặn · spec rõ ràng · quản lý task minh bạch',
    },
    {
      tag: 'Dự án cá nhân · Kiến trúc',
      year: '2026 – nay',
      name: 'WeFocus — Nền tảng TOEIC',
      sub: 'EdTech · dự án cá nhân · đang phát triển',
      problem:
        'Nền tảng luyện TOEIC cần pipeline nạp nội dung ổn định khi ngân hàng câu hỏi mở rộng quy mô.',
      approach:
        'Chủ trì kiến trúc và hệ thống nạp nội dung theo giai đoạn (INGEST-0 → INGEST-5), với architecture review có chấm điểm và roadmap được sắp xếp lại.',
      highlights: [
        'Thiết kế pipeline nạp nội dung theo giai đoạn: INGEST-0 → INGEST-5',
        'Architecture review có chấm điểm + roadmap resequenced',
        'Đặt nền tảng cho nội dung hỗ trợ bởi AI ở quy mô lớn',
      ],
      stack: [
        'React 18',
        'Vite',
        'TypeScript',
        'Tailwind',
        'shadcn/ui',
        'TanStack Query',
        'Zustand',
        'Supabase',
      ],
      impact: 'Roadmap theo giai đoạn, có thể review',
    },
  ],
  moreWork: [
    {
      name: 'Ngẫm — dừng lại một nhịp',
      desc: 'Web app giải trí: rút ba lá thẻ chiêm nghiệm và nhận đôi lời gợi mở. Làm cho vui.',
      link: 'https://targot.pages.dev/',
      linkLabel: 'Trải nghiệm',
    },
    {
      name: 'Đặc tả & tài liệu sản phẩm',
      desc: 'Viết PRD, technical & prompt spec — biến ý tưởng sản phẩm thành công việc rõ ràng, an toàn để dev triển khai.',
    },
    {
      name: 'ORB — Online Register Notebook',
      desc: 'Đồ án capstone SEP490; phụ trách chính app mobile React Native. Được đưa tin trên FPT Edu.',
    },
    {
      name: 'Custom AI Skills & Automation',
      desc: 'Thiết kế skill AI riêng cho từng công việc, đảm bảo chính xác và hiệu quả — từ tóm tắt cuộc họp đến tự động hóa báo cáo bằng Node.js.',
    },
    {
      name: 'E-commerce Microservices',
      desc: 'Kiến trúc microservices trên .NET 7 + SQL Server.',
    },
    {
      name: 'Phân loại ảnh thực phẩm',
      desc: 'Tinh chỉnh EfficientNetB0 để nhận diện ảnh thực phẩm (computer vision).',
    },
  ],

  resEyebrow: 'Nghiên cứu & Công bố',
  resTitle: 'Kỹ thuật với tư duy nghiên cứu.',
  resIntro:
    'Hồ sơ công bố tích cực trải khắp AI, kinh tế công nghệ và machine learning ứng dụng — với hai giải Best Paper.',
  resCap1: 'Nhận Best Paper Award — ICE 2026',
  resCap2: 'Trình bày nghiên cứu tại ICE 2026',
  pubs: [
    {
      badge: '2× Best Paper',
      venue: 'ICE 2026 · Hội nghị Quốc tế về Kinh tế',
      role: 'Đồng tác giả',
      date: 'ĐH Công Thương · 06/2026',
      title:
        "Beyond the Device: B2G Ecosystems & Human-in-the-Loop Services for Care Robots in South Korea's Silver Economy",
    },
    {
      badge: 'Best Paper',
      venue: 'ICE 2026',
      role: 'Đồng tác giả',
      date: 'ĐH Công Thương · 06/2026',
      title:
        "State Capitalism in the AI Era: Assessing South Korea's Digital and Green New Deals",
    },
    {
      badge: 'Tạp chí',
      venue: 'Tạp chí KH ĐH Thủ Dầu Một · Tập 81, Số 1 (2026)',
      role: 'Đồng tác giả',
      date: '04/2026 · Scholar / Crossref / DOAJ',
      title:
        'Ứng dụng mạng Bayes trong dự báo rủi ro chuỗi cung ứng — khung phân tích cho logistics xanh vùng TP.HCM mở rộng',
    },
  ],

  awEyebrow: 'Giải thưởng & Ghi nhận',
  awTitle: 'Được ghi nhận bằng kết quả.',
  awIntro: 'Một số thành tích trong quá trình học tập của mình.',
  awards: [
    {
      org: 'FSB · Spring 2026',
      title: 'Champion Award',
      why: 'Danh hiệu học thuật cao nhất kỳ Spring 2026 trong chương trình Thạc sĩ (lớp MSA33HCM).',
      img: 'assets/award-spring2026.webp',
      poster: true,
    },
    {
      org: 'FSB · Fall 2025',
      title: 'Golden Key Student',
      why: 'Ghi nhận thành tích học thuật xuất sắc trong chương trình Thạc sĩ (lớp MSA33HCM).',
      img: 'assets/award-fall2025.webp',
      poster: true,
    },
    {
      org: 'ĐH FPT · Summer 2024',
      title: 'Sinh viên xuất sắc',
      why: 'Student Achievement Award cho kết quả nổi bật xuyên suốt chương trình kỹ thuật.',
      img: 'assets/student-excellent.webp',
    },
    {
      org: 'Viettel 2022 · ĐBSCL',
      title: 'Vô địch Tin học VP Thế giới',
      why: 'Vô địch khu vực cuộc thi MOS World Championship — độ chính xác dưới áp lực.',
      img: 'assets/mos-team.webp',
    },
  ],
  awFootnote: '',

  skEyebrow: 'Năng lực',
  skTitle: 'Điều tôi mang đến cho đội ngũ.',
  skills: [
    {
      domain: 'Sản phẩm & Bàn giao',
      items: [
        'PRD & technical spec',
        'Lập kế hoạch OKR / PERT',
        'Roadmap & sprint',
        'Handover Dev → Staging → Prod',
      ],
    },
    {
      domain: 'Kỹ thuật',
      items: [
        'React / React Native',
        'Node.js / NestJS',
        'PHP (WordPress / LearnDash)',
        'Python (Flask, ML)',
        'Java (Servlet / JSP)',
        'C# / .NET',
      ],
    },
    {
      domain: 'Trí tuệ nhân tạo',
      items: [
        'Prompt engineering',
        'Computer Vision (EfficientNetB0)',
        'Claude Code / Cursor / Codex',
        'Antigravity / GLM / GitHub Copilot',
        'Custom skills & automation',
      ],
    },
    {
      domain: 'Dữ liệu & Hạ tầng',
      items: [
        'SQL Server / MySQL / SQLite',
        'Supabase',
        'Tối ưu Redis',
        'Linux (Ubuntu 24.04)',
        'Git / GitHub Actions CI/CD',
      ],
    },
    {
      domain: 'Chất lượng & Kiểm thử',
      items: ['Playwright (E2E)', 'Manual QA', 'Thiết kế test case'],
    },
  ],
  lblCerts: 'Chứng chỉ',
  lblLang: 'Ngôn ngữ',
  certs: [
    'CertNexus CEET (2023)',
    'PM Principles & Practices (2024)',
    'Academic English: Writing (2024)',
    'SDLC (2022)',
    'Web Design (2022)',
    'MOS — Word & PowerPoint',
  ],
  langBody:
    'Tiếng Việt — bản ngữ. Tiếng Anh — đọc/viết tài liệu kỹ thuật & học thuật; đã trình bày tại hội nghị quốc tế ICE 2026; đang nâng cao chủ động.',

  philEyebrow: 'Chân ngôn sống',
  philLines: [
    'Được học là niềm vui, là hạnh phúc.',
    'Đón nhận mọi điều bằng lòng biết ơn, sự trân trọng và hết mình.',
    'Dù cuộc sống có thế nào, Quiniu mỉm cười thật tươi trước đã.',
  ],

  byEyebrow: 'Bên ngoài code',
  byTitle: 'Lúc nào cũng sẵn sàng ra sân.',
  byIntro:
    'Các giải chạy, một đội bóng vô địch, và những đường đua cộng đồng — mình chơi được nhiều môn thể thao.',

  ctEyebrow: 'Liên hệ',
  ctTitle: 'Cùng tạo nên điều gì đó.',
  ctIntro:
    'Sẵn sàng cho các cơ hội về kỹ thuật phần mềm, nghiên cứu. Cách nhanh nhất để liên hệ là email.',
  socials: [
    { label: 'Email', handle: 'quyennnm.work@gmail.com', href: 'mailto:quyennnm.work@gmail.com' },
    { label: 'Điện thoại', handle: '0967 733 121', href: 'tel:0967733121' },
    {
      label: 'LinkedIn',
      handle: 'in/quyen-nguyen',
      href: 'https://www.linkedin.com/in/quyen-nguyen-5560363a7/',
    },
    { label: 'GitHub', handle: 'quyen0723', href: 'https://github.com/quyen0723' },
    {
      label: 'ORCID',
      handle: '0009-0002-1025-2669',
      href: 'https://orcid.org/0009-0002-1025-2669',
    },
    {
      label: 'Facebook',
      handle: 'my.quyen.5249',
      href: 'https://www.facebook.com/my.quyen.5249',
    },
  ],
  footNote: 'Kỹ sư Phần mềm · Thích nghiên cứu',
}
