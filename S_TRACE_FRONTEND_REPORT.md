# BÁO CÁO DỰ ÁN FRONTEND S-TRACE
## DỊCH VỤ KẾ TOÁN SỐ & QUẢN LÝ TRUY XUẤT NGUỒN GỐC NÔNG SẢN

---

### 1. TỔNG QUAN WEBSITE

- **Tên dự án:** S-TRACE (Smart Traceability & Digital Agriculture Accounting)
- **Tên đầy đủ:** S-TRACE — Dịch vụ kế toán số và quản lý truy xuất nguồn gốc nông sản
- **Slogan chính:** *"Minh bạch chi phí — Rõ nguồn gốc — Nâng giá trị nông sản"*
- **Slogan phụ:** *"Kết nối nông sản với người tiêu dùng"*
- **Tổ chức minh họa:** Hợp tác xã Nông nghiệp & Dịch vụ Ea H'leo (Km 72, Quốc lộ 14, TT. Ea Drăng, Ea H'leo, Đắk Lắk)
- **Phong cách thiết kế:** Modern Agricultural SaaS Dashboard. Kết hợp màu sắc nông nghiệp Tây Nguyên (Dark Forest Green `#0B3D2E`, Deep Green `#115740`, Primary Green `#208456`, Fresh Green `#3AA66B`) cùng các thẻ trắng thanh lịch, hiệu ứng tinh tế, typography tiếng Việt font **Be Vietnam Pro**.
- **Mục tiêu đạt được:** Xây dựng website Frontend hoàn chỉnh, chất lượng SaaS doanh nghiệp, mô phỏng toàn bộ quy trình:
  $$\text{Lô sản xuất} \longrightarrow \text{Nhật ký canh tác} \longrightarrow \text{Chi phí} \longrightarrow \text{Thu hoạch} \longrightarrow \text{Truy xuất nguồn gốc} \longrightarrow \text{Báo cáo tài chính}$$
  Hệ thống hoạt động mượt mà, tức thì trên trình duyệt Client-side **100% không cần Backend hay Database server**.

---

### 2. CÔNG NGHỆ ĐÃ SỬ DỤNG

- **Framework & Core:** React 18, TypeScript 5, Vite 5
- **Giao diện & Styling:** Tailwind CSS 3.4, PostCSS, Lucide React (Hệ thống icon chuẩn doanh nghiệp, tuyệt đối không dùng emoji làm biểu tượng chính)
- **Typography:** Google Font *Be Vietnam Pro* (các trọng số 300, 400, 500, 600, 700, 800)
- **Điều hướng:** React Router DOM v6 (BrowserRouter)
- **Quản lý trạng thái (State Management):** Zustand v5 kết hợp đồng bộ trình duyệt qua `localStorage` (hỗ trợ versioning, khôi phục dữ liệu mẫu bất kỳ lúc nào)
- **Biểu đồ trực quan:** Recharts (Stacked Bar Chart, Composed Chart kết hợp Cột & Đường 2 trục yAxis, Donut Chart cơ cấu chi phí)
- **Mã QR trực tuyến:** `qrcode` (Tạo mã QR trực tiếp tại client canvas/dataURL độ phân giải cao)
- **Xuất dữ liệu:** `xlsx` (SheetJS xuất file bảng tính Excel đa cột tự động)
- **Xử lý ngày giờ & Tiền tệ:** `date-fns` với locale tiếng Việt, `Intl.NumberFormat('vi-VN')`
- **Thông báo & Tương tác:** Sonner Toast, Dialog xác nhận hành vi nguy hiểm (ConfirmDialog)

---

### 3. DANH SÁCH CHỨC NĂNG ĐÃ TRIỂN KHAI

#### Module 1 — Tổng quan (`/dashboard`)
- **4 Thẻ KPI thời gian thực:**
  1. *Tổng chi phí sản xuất:* Số tiền VNĐ, xu hướng so với kỳ trước, sparkline biểu đồ nhỏ.
  2. *Quy mô lô sản xuất:* Tổng số lô (12 lô), số lô đang canh tác, số lô đã thu hoạch/hoàn thành.
  3. *Sản lượng thực thu:* Tổng kg thực tế từ các đợt thu hoạch (không lấy số liệu dự kiến làm thực thu).
  4. *Giá thành bình quân:* Tính theo công thức chuẩn $\frac{\text{Tổng chi phí các lô đã thu hoạch}}{\text{Tổng sản lượng thực thu tương ứng}}$, có tooltip giải thích chi tiết.
- **Biểu đồ cơ cấu chi phí theo tháng:** Stacked Bar Chart phân loại chi phí (Phân bón, Nhân công, Thuốc BVTV, Tưới tiêu, Vận chuyển, Giống, Khác).
- **Biểu đồ tiến độ & sản lượng thu hoạch:** Composed Chart gồm Bar (Sản lượng thực thu kg) và Line (Số lô đã thu hoạch) trên 2 trục riêng biệt.
- **Bảng danh sách lô gần đây:** Đầy đủ mã lô, tên vườn, diện tích, ngày vụ, sản lượng, đơn giá thành/kg, trạng thái, nút chuyển nhanh chi tiết.
- **Dòng thời gian hoạt động (Activity Timeline):** Cập nhật sự kiện thêm chi phí, ghi nhận thu hoạch, thêm nhật ký, công bố mã QR theo thời gian thực.
- **Bộ lọc kỳ linh hoạt:** Xem cả năm 2026 hoặc lọc theo Quý 1, Quý 2, Quý 3, Quý 4.

#### Module 2 — Chi phí (`/expenses`)
- **4 Thẻ KPI chuyên sâu:** Tổng chi phí, Chi phí phân bón, Chi phí nhân công, Chi phí khác.
- **Bảng kê chi phí đa năng:**
  - Sắp xếp tăng/giảm theo Ngày hoặc Số tiền.
  - Phân trang, tìm kiếm theo từ khóa (nội dung, mã phiếu, người chi, nhà cung cấp).
  - Bộ lọc đa chiều: lọc theo Danh mục, lọc theo Lô sản xuất, lọc theo Tháng phát sinh.
  - Thao tác: Sửa, Xóa (kèm ConfirmDialog), Xem chi tiết.
- **Form Thêm / Sửa chi phí:** Validation chặt chẽ (số tiền > 0, bắt buộc ngày, danh mục, lô liên kết, người chi). Khi thêm/sửa, tự động đồng bộ sang chi phí của Lô, Dashboard và Báo cáo.
- **Biểu đồ Donut cơ cấu chi phí:** Tỷ trọng từng danh mục, tự động tính toán lại khi lọc hoặc thêm chi phí mới.
- **Card thông tin lô được chọn:** Hiển thị ảnh nông sản, diện tích, tổng chi phí của lô, sản lượng thực thu và nút điều hướng tới chi tiết lô.
- **Xuất bảng tính Excel:** Tạo file Excel chi phí trực tiếp trên trình duyệt.

#### Module 3 — Lô sản xuất (`/production-lots` & `/production-lots/:id`)
- **Danh sách lô:**
  - 12 lô sản xuất thực tế bao gồm 5 nông sản chủ lực Tây Nguyên: Sầu riêng (Ri6, Dona), Cà phê (Robusta TRS1, Robusta cao sản, Cà phê cảnh quan), Hồ tiêu (Vĩnh Linh, sẻ đất đỏ), Bơ (Booth 7, Bơ sáp 034), Mắc ca (OC, 246).
  - 2 chế độ hiển thị: **Card View** (giao diện thẻ ảnh hiện đại) và **Table View** (giao diện bảng dữ liệu kế toán).
  - Bộ lọc: Loại nông sản, Vùng trồng / Xã, Trạng thái canh tác (Lên kế hoạch, Đang sản xuất, Đã thu hoạch, Hoàn thành vụ, Tạm dừng).
- **Form Tạo / Sửa lô sản xuất:** Kiểm tra chống trùng mã lô, kiểm tra logic ngày thu hoạch >= ngày bắt đầu, diện tích > 0.
- **Trang chi tiết lô (`/production-lots/:id`) với 5 Tabs nghiệp vụ:**
  - *Tab 1 — Thông tin chung:* Hồ sơ vùng trồng, tiến độ sản lượng vs kế hoạch, năng suất/ha, suất đầu tư/ha.
  - *Tab 2 — Nhật ký canh tác:* Timeline các công đoạn làm đất, tỉa cành, tưới nước, bón phân vi sinh, phun thảo mộc, thu hoạch. Hỗ trợ Thêm, Sửa, Xóa nhật ký, cờ `isPublic` cho phép công khai lên QR.
  - *Tab 3 — Chi phí lô:* Tổng chi phí riêng của lô, chi phí/ha, giá thành/kg, biểu đồ Donut và bảng kê chi phí riêng của lô.
  - *Tab 4 — Thu hoạch:* Bảng ghi nhận các đợt thu hoạch. Form "+ Ghi nhận đợt thu hoạch" tự động cập nhật sản lượng thực tế của lô và tự động tính lại giá thành/kg ngay lập tức.
  - *Tab 5 — Truy xuất:* Mã định danh truy xuất, mã QR tự động tạo, nút bật/tắt công khai, nút tải ảnh QR PNG, nút in tem nhãn.

#### Module 4 — Truy xuất nguồn gốc (`/traceability` & `/trace/:code`)
- **Quản lý danh mục QR:** Danh sách mã truy xuất, trạng thái công bố, số lượt quét mô phỏng, thao tác xem QR, in tem nhãn, bật/tắt công bố.
- **Trang truy xuất công khai dành cho người tiêu dùng (`/trace/:code`):**
  - Route độc lập, **hoàn toàn không có sidebar quản trị**, tối ưu 100% hiển thị trên điện thoại thông minh (Mobile-first).
  - Logo S-TRACE, thông tin đơn vị sản xuất (HTX Ea H'leo, mã số vùng trồng).
  - Ảnh nông sản chất lượng cao, tên giống cây, tiêu chuẩn VietGAP.
  - Hành trình canh tác minh bạch: Chỉ hiển thị các bước nhật ký được đánh dấu công khai (an toàn thông tin, không tiết lộ chi phí nội bộ).
  - Xử lý mã không tồn tại hoặc mã bị tạm ngưng công bố thân thiện, rõ ràng.
- **Tem QR in ấn:** Chuẩn in `@media print`, hiển thị khung viền nhãn dán, logo S-TRACE, tên sản phẩm, tên HTX, hướng dẫn quét camera điện thoại.

#### Module 5 — Báo cáo & Thống kê (`/reports`)
- **4 Phân hệ báo cáo chuyên sâu:**
  1. *Báo cáo chi phí:* So sánh chi phí giữa các lô, cơ cấu chi phí, bảng tổng hợp phân bổ chi phí theo lô.
  2. *Báo cáo sản lượng:* Đối chiếu chỉ tiêu kế hoạch vs thực tế thu mua theo 5 nhóm nông sản, bảng chi tiết theo lô.
  3. *Báo cáo giá thành (VNĐ/kg):* Công thức $\text{Giá thành/kg} = \frac{\text{Tổng chi phí phân bổ}}{\text{Tổng sản lượng thực thu}}$. Chỉ tính toán cho các lô đã thu hoạch có sản lượng và chi phí hợp lệ (không dùng sản lượng kế hoạch để chia).
  4. *Báo cáo hiệu quả kinh tế:* Suất đầu tư/ha, năng suất/ha, giá thành/kg, tỷ lệ hoàn thành kế hoạch.
- **Bộ lọc báo cáo đồng bộ:** Lọc theo Kỳ (Năm, Quý), Lọc theo Loại nông sản, Lọc theo Lô sản xuất.
- **Xuất báo cáo:** Xuất file Excel chuẩn cấu trúc và chức năng in báo cáo qua trình duyệt.

---

### 4. CÁC ROUTE TRONG HỆ THỐNG

| Route | Tên màn hình | Giao diện Layout | Mục đích |
|---|---|---|---|
| `/` | Điều hướng gốc | - | Tự động chuyển hướng về `/dashboard` |
| `/dashboard` | Tổng quan HTX | MainLayout (Sidebar + Header) | Bảng điều hành KPI, biểu đồ chi phí & sản lượng, lô gần đây, timeline |
| `/expenses` | Quản lý chi phí | MainLayout (Sidebar + Header) | Sổ quản lý chi phí, CRUD chi phí, biểu đồ tỷ trọng, xuất Excel |
| `/production-lots` | Danh sách lô sản xuất | MainLayout (Sidebar + Header) | Quản lý 12 lô nông sản, Card View / Table View, bộ lọc nông sản |
| `/production-lots/:id` | Chi tiết lô sản xuất | MainLayout (Sidebar + Header) | 5 Tabs: Thông tin chung, Nhật ký, Chi phí, Thu hoạch, Mã truy xuất QR |
| `/traceability` | Quản lý truy xuất | MainLayout (Sidebar + Header) | Quản trị mã QR, công bố/ngừng công bố, xem và in tem truy xuất |
| `/reports` | Báo cáo & Thống kê | MainLayout (Sidebar + Header) | Báo cáo chi phí, sản lượng, giá thành/kg, hiệu quả kinh tế, xuất Excel/In |
| `/trace/:code` | Truy xuất công khai | **Trang riêng (No Sidebar)** | Giao diện mobile quét mã QR cho người tiêu dùng xem nhật ký và nguồn gốc |
| `*` | 404 Not Found | MainLayout (Sidebar + Header) | Xử lý lỗi điều hướng không tồn tại |

---

### 5. CẤU TRÚC THƯ MỤC SOURCE CODE

```text
d:\CaNhan\VoIU/
├── index.html                       # HTML gốc, tích hợp font Be Vietnam Pro
├── package.json                     # Cấu hình dự án và dependencies
├── tsconfig.json                    # Cấu hình TypeScript
├── vite.config.ts                   # Cấu hình Vite bundler & path alias @/
├── tailwind.config.js               # Tokens màu S-TRACE & typography
├── postcss.config.js
├── dist/                            # Production build hoàn chỉnh
├── src/
│   ├── app/
│   │   └── router.tsx               # Cấu hình React Router DOM
│   ├── types/
│   │   └── index.ts                 # Định nghĩa TypeScript: Lot, Expense, Log, Harvest, Trace
│   ├── utils/
│   │   ├── formatters.ts            # Tiện ích format VNĐ, kg, tấn, ha, ngày tháng
│   │   ├── calculations.ts          # Logic tính toán chi phí, giá thành/kg, năng suất/ha
│   │   └── exportExcel.ts           # Xuất file Excel (.xlsx) trực tiếp trên client
│   ├── data/
│   │   └── seed.ts                  # Dữ liệu mẫu HTX Ea H'leo (12 lô, 50+ CP, 30+ nhật ký, 10 đợt thu hoạch)
│   ├── store/
│   │   └── useStore.ts              # Global store Zustand + lưu bền vững localStorage + nút Reset
│   ├── styles/
│   │   └── globals.css              # Custom scrollbar, Tailwind base, Print styles (@media print)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Sidebar đúng 5 mục chính, thương hiệu S-TRACE, drawer mobile
│   │   │   ├── Header.tsx           # Context HTX Ea H'leo, thông báo, avatar, nút Reset Seed Data
│   │   │   └── MainLayout.tsx       # Bố cục chính bọc nội dung và toast provider
│   │   └── common/
│   │       ├── StatCard.tsx         # KPI card có trend, sparkline, tooltip
│   │       ├── StatusBadge.tsx      # Badge trạng thái lô sản xuất chuẩn màu
│   │       ├── PageHeader.tsx
│   │       ├── EmptyState.tsx       # Màn hình trống thân thiện
│   │       ├── SearchInput.tsx      # Ô tìm kiếm có nút xóa
│   │       ├── Pagination.tsx       # Phân trang bảng dữ liệu
│   │       ├── ConfirmDialog.tsx    # Hộp thoại xác nhận xóa
│   │       └── QRCodeModal.tsx      # Modal tạo QR, tải ảnh PNG và in tem nhãn
│   ├── features/
│   │   ├── dashboard/               # Module 1: Dashboard
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CostDistributionChart.tsx
│   │   │   ├── ProductionYieldChart.tsx
│   │   │   ├── RecentLotsTable.tsx
│   │   │   └── RecentActivitiesTimeline.tsx
│   │   ├── expenses/                # Module 2: Chi phí
│   │   │   ├── ExpensesPage.tsx
│   │   │   ├── ExpenseFormModal.tsx
│   │   │   ├── ExpenseTable.tsx
│   │   │   ├── ExpenseCategoryChart.tsx
│   │   │   └── ExpenseLotDetailCard.tsx
│   │   ├── lots/                    # Module 3: Lô sản xuất
│   │   │   ├── LotsListPage.tsx
│   │   │   ├── LotCard.tsx
│   │   │   ├── LotTable.tsx
│   │   │   ├── LotFormModal.tsx
│   │   │   ├── LotDetailPage.tsx
│   │   │   └── tabs/
│   │   │       ├── GeneralInfoTab.tsx
│   │   │       ├── ProductionLogsTab.tsx
│   │   │       ├── LotExpensesTab.tsx
│   │   │       ├── HarvestTab.tsx
│   │   │       └── LotTraceTab.tsx
│   │   ├── traceability/            # Module 4: Truy xuất nguồn gốc
│   │   │   ├── TraceabilityPage.tsx
│   │   │   └── PublicTracePage.tsx  # Trang công khai mobile cho người tiêu dùng
│   │   ├── reports/                 # Module 5: Báo cáo & Thống kê
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── CostReportSection.tsx
│   │   │   ├── YieldReportSection.tsx
│   │   │   ├── CostPerKgReportSection.tsx
│   │   │   └── EfficiencyReportSection.tsx
│   │   └── NotFoundPage.tsx         # Trang 404
│   ├── App.tsx
│   └── main.tsx
```

---

### 6. NHỮNG PHẦN ĐÃ HOÀN THÀNH

- [x] Khởi tạo dự án Vite + React 18 + TypeScript + Tailwind CSS hoàn chỉnh.
- [x] Thiết lập bộ nhận diện thương hiệu S-TRACE (màu Dark Forest Green, font Be Vietnam Pro, logo chiếc lá cách điệu, slogan chuẩn nông nghiệp).
- [x] Sidebar đúng 5 mục chính, hiệu ứng hover, badge số lượng, hỗ trợ thu gọn trên Desktop và dạng Drawer trên Mobile.
- [x] Xây dựng bộ Mock Data mẫu mực (HTX Ea H'leo, 12 lô cây trồng, 50 khoản chi phí trải khắp các tháng, 30 mục nhật ký thực tế, 10 đợt thu hoạch, 8 bản ghi QR truy xuất).
- [x] Quản lý trạng thái Client-side Zustand lưu bền vững vào `localStorage`, có tính năng "Khôi phục dữ liệu mẫu (Reset)" bất kỳ lúc nào tại Header.
- [x] Hoàn thiện trọn vẹn cả 5 Module:
  1. **Tổng quan:** 4 KPI, biểu đồ cột chồng chi phí theo tháng, biểu đồ kết hợp sản lượng & số lô, bảng lô gần đây, timeline hoạt động.
  2. **Chi phí:** 4 KPI, bảng danh sách (tìm kiếm, lọc danh mục/lô/tháng, sắp xếp theo ngày/tiền, phân trang, CRUD, xuất Excel), form validation, biểu đồ Donut cơ cấu chi phí, card chi tiết lô được chọn.
  3. **Lô sản xuất:** Card View & Table View, bộ lọc đa năng, form tạo/sửa lô có kiểm tra trùng mã, trang chi tiết lô với 5 Tabs nghiệp vụ phong phú.
  4. **Truy xuất nguồn gốc:** Quản trị QR, sinh mã QR trực tiếp trên trình duyệt, tải ảnh PNG, in tem nhãn theo chuẩn `@media print`, trang công khai `/trace/:code` tối ưu điện thoại di động không sidebar.
  5. **Báo cáo & Thống kê:** 4 phân hệ (Chi phí, Sản lượng, Giá thành/kg, Hiệu quả kinh tế), bộ lọc theo kỳ/nông sản/lô, xuất file Excel và in báo cáo.
- [x] Tính toán giá thành thực tế chính xác: $\text{Giá thành/kg} = \frac{\text{Chi phí}}{\text{Sản lượng thực thu}}$, tự động hiển thị "Chưa đủ dữ liệu" nếu chưa có đợt thu hoạch thực tế, không dùng sản lượng kế hoạch để chia sai lệch.
- [x] Build Production (`npm run build`) thành công 100%, không có bất kỳ lỗi TypeScript, Lint hay cảnh báo runtime.

---

### 7. NHỮNG PHẦN NGOÀI PHẠM VI DỰ ÁN (THEO QUY ĐỊNH MASTER PROMPT)

Tuân thủ nghiêm ngặt giới hạn phạm vi:
- Không xây dựng Server Backend (Node/Express/NestJS/Java/Python/Go...).
- Không kết nối cơ sở dữ liệu thật (SQL Server, MySQL, Postgres, MongoDB, Firebase, Supabase...).
- Không kết nối cổng thanh toán, không làm hệ thống xác thực đăng nhập phức tạp.
- Sử dụng Client State và LocalStorage để mô phỏng hoàn toàn trải nghiệm ứng dụng SaaS một cách tự nhiên.

---

### 8. KẾT QUẢ KIỂM THỬ

- **TypeScript Compilation:** `tsc -b` không phát hiện lỗi.
- **Vite Production Bundler:** Build ra thư mục `dist/` trong 9.84 giây, hoàn tất 3.325 modules.
- **Kiểm thử logic nghiệp vụ:** Script xác minh tự động khẳng định giá thành các lô (Ri6: 14.000 VNĐ/kg, Robusta: 16.000 VNĐ/kg, Tiêu: 30.000 VNĐ/kg, Bơ Booth: 8.000 VNĐ/kg, Bơ 034: 9.000 VNĐ/kg) đồng bộ 100% giữa Dashboard, Chi tiết lô và Báo cáo.

---

### 9. HƯỚNG DẪN CHẠY ỨNG DỤNG

#### Yêu cầu môi trường:
- Node.js version 18+ (Dự án đã kiểm thử trên Node v24.16.0).
- Trình duyệt hiện đại (Chrome, Edge, Firefox, Safari).

#### Các bước thực hiện:
```bash
# 1. Di chuyển vào thư mục dự án
cd d:\CaNhan\VoIU

# 2. Khởi động môi trường phát triển (Dev server)
npm run dev

# 3. Mở trình duyệt truy cập:
# http://localhost:3000 (hoặc cổng được hiển thị trong terminal)
```

#### Để kiểm tra bản Production Build:
```bash
# Build mã nguồn
npm run build

# Chạy preview
npm run preview
```

---

### 10. HƯỚNG DẪN KỊCH BẢN DEMO

1. **Khám phá Dashboard:**
   - Xem 4 KPI: Tổng chi phí, Quy mô lô, Sản lượng thực thu, Giá thành bình quân.
   - Thử bấm lọc theo **Quý 1, Quý 2, Quý 3, Quý 4** để thấy biểu đồ và số liệu KPI thay đổi đồng bộ.
2. **Thao tác Chi phí:**
   - Chuyển sang menu **Chi phí** (`/expenses`).
   - Bấm **"+ Thêm chi phí"**, nhập khoản chi mới cho Lô `SR-DL-001` (ví dụ: 10.000.000 VNĐ) rồi bấm Lưu.
   - Quan sát bảng chi phí cập nhật dòng mới, biểu đồ Donut thay đổi tỷ trọng, quay lại Dashboard và Chi tiết lô `SR-DL-001` thấy tổng chi phí tăng đúng 10.000.000 VNĐ.
   - Thử bấm nút **"Xuất Excel"** để tải file bảng tính về máy.
3. **Thao tác Lô sản xuất & Chi tiết 5 Tabs:**
   - Vào menu **Lô sản xuất** (`/production-lots`).
   - Chuyển đổi giữa chế độ **Card View** và **Table View**. Lọc theo nông sản "Sầu riêng" hoặc "Cà phê".
   - Bấm xem chi tiết lô `SR-DL-001`.
   - Xem qua 5 Tabs:
     - *Tab 1 (Thông tin chung):* Xem tiến độ sản lượng và suất đầu tư.
     - *Tab 2 (Nhật ký):* Bấm "+ Thêm nhật ký" ghi nhận hoạt động chăm sóc mới.
     - *Tab 3 (Chi phí):* Xem chi phí riêng của lô này.
     - *Tab 4 (Thu hoạch):* Bấm "+ Ghi nhận đợt thu hoạch" thêm 5.000 kg, quan sát giá thành/kg tự động tính lại ngay lập tức!
     - *Tab 5 (Truy xuất):* Bấm "Mở xem trang truy xuất công khai".
4. **Trải nghiệm trang người tiêu dùng quét QR:**
   - Truy cập liên kết: `http://localhost:3000/trace/TRACE-SR-001` (hoặc nhấn nút trên Header).
   - Chiêm ngưỡng giao diện mobile-first sang trọng dành cho người mua hàng, tra cứu đầy đủ 10 bước hành trình canh tác an toàn.
   - Thử bấm "In tem mẫu" để xem bản in tem QR sắc nét.
5. **Thao tác Báo cáo tài chính:**
   - Vào menu **Báo cáo** (`/reports`).
   - Lần lượt xem 4 tab: Báo cáo chi phí, Báo cáo sản lượng, Báo cáo giá thành (VNĐ/kg) và Báo cáo hiệu quả kinh tế.
   - Thử bấm "In báo cáo" hoặc "Xuất Excel".
6. **Khôi phục dữ liệu mẫu:**
   - Bấm vào menu Avatar tài khoản HTX ở góc trên bên phải Header, chọn **"Khôi phục dữ liệu mẫu (Reset)"** để trả toàn bộ hệ thống về trạng thái chuẩn ban đầu.
