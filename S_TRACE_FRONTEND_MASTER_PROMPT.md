# S-TRACE — COMPLETE FRONTEND MASTER PROMPT
## XÂY DỰNG WEBSITE KẾ TOÁN SỐ VÀ QUẢN LÝ TRUY XUẤT NGUỒN GỐC NÔNG SẢN

---

# I. VAI TRÒ CỦA BẠN

Bạn là một đội ngũ phát triển sản phẩm chuyên nghiệp, đảm nhiệm đồng thời các vai trò:

- Senior Frontend Developer
- UI/UX Designer
- Frontend Architect
- Business Analyst
- QA Engineer

Bạn có nhiệm vụ thiết kế và phát triển một website Frontend hoàn chỉnh mang tên:

**S-TRACE — Dịch vụ kế toán số và quản lý truy xuất nguồn gốc nông sản.**

Website phục vụ việc giới thiệu, mô phỏng và trình diễn các nghiệp vụ quản lý sản xuất nông nghiệp của hợp tác xã.

Tôi đã cung cấp 3 hình ảnh giao diện tham khảo.

Hãy quan sát kỹ bố cục, màu sắc, sidebar, dashboard, các bảng dữ liệu và phong cách nông nghiệp trong ảnh.

Bạn ĐƯỢC PHÉP và ĐƯỢC KHUYẾN KHÍCH thiết kế lại những phần chưa hợp lý để tạo ra website đẹp hơn, chuyên nghiệp hơn, đồng bộ hơn và dễ sử dụng hơn.

Không cần sao chép chính xác 100% hình ảnh tham khảo.

Mục tiêu là xây dựng một website hoàn chỉnh có chất lượng giao diện tương đương sản phẩm SaaS hiện đại, không phải một trang HTML demo đơn giản.

# II. GIỚI HẠN PHẠM VI — CỰC KỲ QUAN TRỌNG

Dự án này **CHỈ XÂY DỰNG FRONTEND**.

Tuyệt đối không triển khai:

- Backend.
- REST API server.
- GraphQL server.
- SQL Server.
- MySQL.
- PostgreSQL.
- MongoDB.
- Firebase.
- Supabase.
- Serverless Functions.
- Hệ thống đăng nhập thực tế.
- Dịch vụ xác thực người dùng.
- Hệ thống thanh toán.
- Bất kỳ Database nào.

Không xây dựng code Backend dưới bất kỳ ngôn ngữ nào.

Không cần Docker, microservices hay hệ thống triển khai máy chủ phức tạp.

Tất cả dữ liệu phải sử dụng **Mock Data** bằng TypeScript hoặc JSON.

Sử dụng React State để cập nhật giao diện khi người dùng tương tác.

Có thể sử dụng localStorage để giữ dữ liệu demo khi reload trang. localStorage chỉ đóng vai trò lưu trữ trình duyệt, không phải Database của hệ thống.

Không giả lập việc nhiều thiết bị có thể đồng bộ dữ liệu với nhau.

Không tự mở rộng dự án thành phần mềm kế toán tài chính hoàn chỉnh.

## Kết quả mong muốn

Website phải:

1. Có đầy đủ 5 chức năng chính.
2. Có giao diện đẹp và thống nhất.
3. Có dữ liệu mẫu thực tế.
4. Có biểu đồ trực quan.
5. Có form thêm, sửa, xóa mô phỏng.
6. Có tìm kiếm và bộ lọc.
7. Có trang chi tiết.
8. Có QR truy xuất nguồn gốc.
9. Có báo cáo và xuất dữ liệu trực tiếp trên trình duyệt.
10. Responsive tốt.
11. Các chức năng liên kết với nhau.
12. Chạy được ngay mà không cần Backend.

---

# III. CÔNG NGHỆ SỬ DỤNG

Framework và ngôn ngữ:

- React
- TypeScript
- Vite

UI:

- Tailwind CSS
- shadcn/ui
- Lucide React
- Be Vietnam Pro

Thư viện:

- React Router DOM: điều hướng.
- Recharts: biểu đồ.
- React Hook Form: quản lý form.
- Zod: validation.
- Sonner: thông báo.
- date-fns: xử lý ngày.
- qrcode: tạo QR Code.
- xlsx hoặc thư viện tương đương: xuất Excel.

Có thể sử dụng Zustand nếu cần quản lý state dùng chung giữa nhiều module.

Xuất PDF có thể dùng thư viện chạy trên trình duyệt hoặc bản in HTML được thiết kế phù hợp.

Không thêm thư viện chỉ để trang trí nếu có thể giải quyết bằng CSS.

Tất cả công nghệ phải tương thích với nhau và hoạt động ổn định.

Nếu thư mục dự án đã có code, phải kiểm tra trước khi chỉnh sửa.

Nếu thư mục dự án trống, tự khởi tạo dự án Vite React TypeScript.

---

# IV. NHẬN DIỆN THƯƠNG HIỆU S-TRACE

## 4.1. Thông tin thương hiệu

Tên: S-TRACE

Tên đầy đủ:

**S-TRACE — Dịch vụ kế toán số và quản lý truy xuất nguồn gốc nông sản**

Slogan chính:

"Minh bạch chi phí — Rõ nguồn gốc — Nâng giá trị nông sản"

Slogan phụ:

"Kết nối nông sản với người tiêu dùng"

Đối tượng sử dụng:

- Hợp tác xã nông nghiệp.
- Người quản lý vùng trồng.
- Hộ sản xuất liên kết.
- Đơn vị quản lý nông sản.

Tổ chức minh họa:

**HTX Ea H'leo — Đắk Lắk**

## 4.2. Phong cách UI

Thiết kế theo phong cách:

**Modern Agricultural SaaS Dashboard**

Kết hợp giữa:

- Công nghệ hiện đại.
- Màu xanh nông nghiệp.
- Tính chuyên nghiệp của phần mềm doanh nghiệp.
- Tính trực quan của dashboard phân tích.
- Sự đơn giản, dễ sử dụng.

Không sử dụng giao diện quá nhiều hiệu ứng.

Không thiết kế theo phong cách game, website bán hàng hoặc landing page quảng cáo.

Website phải có cảm giác đây là hệ thống quản lý dành cho doanh nghiệp thực tế.

## 4.3. Màu sắc

Primary:

- Dark Forest Green: #0B3D2E
- Deep Green: #115740
- Primary Green: #208456
- Fresh Green: #3AA66B

Background:

- Main Background: #F6F8F7
- Surface: #FFFFFF
- Border: #E2E9E5

Text:

- Main Text: #17231D
- Secondary Text: #69776F
- Muted Text: #94A39A

Accent:

- Light Green: #E5F4EA
- Light Blue: #E7F2FC
- Light Yellow: #FFF4D9
- Light Orange: #FFF0DF

Status:

- Success: #24965D
- Warning: #E6A23C
- Danger: #D9534F
- Info: #3478C0

Tạo design tokens và sử dụng thống nhất.

## 4.4. Typography

Sử dụng font Be Vietnam Pro.

Phân cấp:

- Page heading.
- Section heading.
- Card heading.
- KPI value.
- Body.
- Caption.

Giá trị tiền, sản lượng và tỷ lệ phải rõ ràng.

Các đơn vị phải thống nhất:

- VNĐ.
- kg.
- tấn.
- ha.
- VNĐ/kg.

Ngày tháng theo định dạng Việt Nam: DD/MM/YYYY.

## 4.5. Components

Thiết kế các component dùng chung:

- AppSidebar
- AppHeader
- PageHeader
- Breadcrumb
- StatCard
- ChartCard
- StatusBadge
- SearchInput
- FilterBar
- DataTable
- Pagination
- EmptyState
- ConfirmDialog
- FormDialog
- DetailDrawer
- Timeline
- DateRangeFilter
- ExportButton
- QRCodeCard

Các component cần có hover, focus, disabled và loading state khi phù hợp.

Không sử dụng emoji làm biểu tượng chính của hệ thống.

---

# V. LAYOUT CHUNG

## 5.1. Sidebar

Sidebar nằm bên trái, nền xanh lá đậm.

Phần đầu sidebar:

Logo chiếc lá cách điệu.

Tên:

S-TRACE

Dòng mô tả:

"Dịch vụ kế toán số & quản lý nguồn gốc nông sản"

**Sidebar có đúng 5 mục chính:**

1. Tổng quan
2. Chi phí
3. Lô sản xuất
4. Truy xuất nguồn gốc
5. Báo cáo

Icon gợi ý:

- Tổng quan: LayoutDashboard
- Chi phí: Wallet
- Lô sản xuất: Sprout
- Truy xuất: MapPin hoặc ScanQrCode
- Báo cáo: ChartColumnIncreasing

Mục đang được chọn phải có background xanh sáng hơn.

Các mục cần có hover animation nhẹ.

Sidebar có thể thu gọn trên desktop.

Trên mobile sử dụng drawer.

Phần chân sidebar hiển thị slogan và hình minh họa nông nghiệp tinh tế.

Không thêm mục thứ sáu.

## 5.2. Header

Header phía trên phần nội dung.

Bao gồm:

- Tiêu đề trang.
- Breadcrumb nếu cần.
- Tìm kiếm theo ngữ cảnh.
- Thông báo.
- Avatar tổ chức.
- Dropdown tài khoản.

Thông tin demo:

HTX Ea H'leo

Quản lý

Dropdown có thể chứa:

- Thông tin tài khoản demo.
- Tùy chỉnh giao diện.
- Khôi phục dữ liệu mẫu.

Không cần chức năng đăng xuất thực tế.

## 5.3. Không gian nội dung

Background xám rất nhạt.

Các section đặt trong card trắng.

Spacing hợp lý.

Responsive grid.

Card bo góc 12–16px.

Shadow nhẹ.

Không dùng viền quá đậm.

---

# VI. MODULE 1 — TỔNG QUAN

Route: `/dashboard`

Đây là dashboard chính.

Thiết kế dựa trên ảnh dashboard mà tôi cung cấp, nhưng cần hiện đại và dễ nhìn hơn.

## 6.1. Khu vực KPI

Hiển thị 4 KPI card ngang trên desktop.

### Tổng chi phí

Hiển thị:

- Tổng chi phí sản xuất trong kỳ.
- Số tiền VNĐ.
- Phần trăm tăng hoặc giảm so với kỳ trước nếu có.
- Sparkline nhỏ.

### Số lô sản xuất

Hiển thị:

- Tổng số lô.
- Số lô đang sản xuất.
- Số lô hoàn thành.
- Biến động so với kỳ trước nếu có.

### Sản lượng

Hiển thị:

- Tổng sản lượng thực tế đã thu hoạch trong kỳ.
- Đơn vị kg hoặc tấn.
- So sánh kỳ trước.

Không lấy sản lượng dự kiến làm sản lượng thực thu.

### Giá thành bình quân

Hiển thị:

- Giá thành bình quân VNĐ/kg.
- So sánh kỳ trước nếu có dữ liệu.
- Tooltip giải thích cách tính.

Chỉ tính từ các lô đủ điều kiện có chi phí và sản lượng thực tế hợp lệ.

Nếu không đủ dữ liệu, hiển thị "Chưa đủ dữ liệu".

## 6.2. Biểu đồ chi phí

Biểu đồ cột chồng theo tháng.

Phân loại:

- Giống.
- Phân bón.
- Thuốc BVTV.
- Nhân công.
- Tưới tiêu.
- Vận chuyển.
- Khác.

Có tooltip.

Có legend.

Có lựa chọn kỳ hiển thị.

## 6.3. Biểu đồ sản lượng

Hiển thị biểu đồ kết hợp cột và đường.

Cột:

Sản lượng thực tế theo tháng.

Đường:

Số lô đã thu hoạch.

Nếu hai chỉ số khác đơn vị, sử dụng hai trục tương ứng và ghi rõ chú giải.

## 6.4. Danh sách lô gần đây

Tạo bảng gồm:

- Mã lô.
- Sản phẩm.
- Diện tích.
- Ngày bắt đầu mùa vụ.
- Ngày dự kiến thu hoạch.
- Sản lượng.
- Giá thành.
- Trạng thái.
- Thao tác.

Có nút "Xem tất cả".

Click mở chi tiết lô.

## 6.5. Hoạt động gần đây

Timeline hoạt động:

- Lô vừa được tạo.
- Chi phí vừa cập nhật.
- Nhật ký vừa ghi nhận.
- Lô vừa thu hoạch.
- QR vừa công bố.

Dữ liệu timeline phải lấy từ dữ liệu demo hoặc các thao tác trong phiên làm việc.

## 6.6. Bộ lọc dashboard

Cho phép chọn:

- Tháng.
- Quý.
- Năm.
- Toàn bộ dữ liệu.

KPI, biểu đồ và danh sách phải phản ánh cùng bộ lọc.

---

# VII. MODULE 2 — CHI PHÍ

Route: `/expenses`

Trang này quản lý các khoản chi phí sản xuất nông nghiệp.

## 7.1. Header

Tiêu đề:

"Quản lý chi phí"

Mô tả:

"Theo dõi, phân loại và phân tích chi phí sản xuất nông nghiệp"

Nút chính:

"+ Thêm chi phí"

Có bộ lọc thời gian.

## 7.2. KPI

Bốn thẻ:

- Tổng chi phí.
- Chi phí phân bón.
- Chi phí nhân công.
- Chi phí khác.

Có icon và màu pastel.

## 7.3. Bảng danh sách chi phí

Các cột:

- Ngày.
- Mã chi phí.
- Khoản mục.
- Lô sản xuất.
- Nội dung.
- Số tiền.
- Ghi chú.
- Thao tác.

Các danh mục:

- Giống.
- Phân bón.
- Thuốc BVTV.
- Nhân công.
- Tưới tiêu.
- Vận chuyển.
- Máy móc.
- Dịch vụ thuê ngoài.
- Khác.

Chức năng:

- Tìm kiếm.
- Lọc danh mục.
- Lọc lô.
- Lọc ngày.
- Sắp xếp.
- Phân trang.
- Xem chi tiết.
- Thêm.
- Sửa.
- Xóa.
- Xuất Excel.

## 7.4. Form thêm chi phí

Các trường:

- Ngày phát sinh.
- Danh mục.
- Lô sản xuất.
- Tên khoản chi.
- Số tiền.
- Người thực hiện.
- Nhà cung cấp.
- Ghi chú.

Có validation đầy đủ.

Không cho nhập số tiền âm hoặc bằng 0.

Nút:

- Hủy.
- Lưu chi phí.

Khi lưu, cập nhật bảng và các KPI liên quan bằng React State.

Khi sửa, hiển thị đúng dữ liệu cũ.

Khi xóa, hiển thị confirm dialog.

## 7.5. Cơ cấu chi phí

Hiển thị donut chart.

Có các danh mục:

- Phân bón.
- Nhân công.
- Thuốc BVTV.
- Giống.
- Tưới tiêu.
- Khác.

Hiển thị:

- Tổng chi phí.
- Tỷ trọng từng danh mục.
- Số tiền.
- Màu tương ứng.

Các tỷ lệ phải tính từ dữ liệu hiện tại.

## 7.6. Thông tin lô sản xuất

Bên phải hoặc bên dưới có card hiển thị lô đang được chọn:

- Ảnh nông sản.
- Mã lô.
- Loại nông sản.
- Diện tích.
- Tổng chi phí.
- Sản lượng.
- Trạng thái.
- Nút xem chi tiết.

Bấm xem chi tiết sẽ mở đúng lô.

## 7.7. Đồng bộ

Nếu thêm chi phí cho lô SR-DL-001, tổng chi phí của lô đó phải tăng.

Trang dashboard, chi tiết lô và báo cáo cũng phải lấy dữ liệu mới.

Không hardcode tổng tiền riêng ở từng trang.

---

# VIII. MODULE 3 — LÔ SẢN XUẤT

Route: `/production-lots`

Đây là module quan trọng nhất của hệ thống.

## 8.1. Trang danh sách

Header:

"Lô sản xuất"

Nút:

"+ Thêm lô sản xuất"

Có tìm kiếm:

"Tìm kiếm mã lô, tên lô, sản phẩm..."

Bộ lọc:

- Loại nông sản.
- Khu vực.
- Trạng thái.
- Thời gian.

Có hai chế độ:

- Card View.
- Table View.

## 8.2. Thông tin lô

Mỗi lô sản xuất hiển thị:

- Mã lô.
- Tên lô.
- Tên sản phẩm.
- Hình ảnh.
- Diện tích.
- Khu vực.
- Số hộ liên kết.
- Ngày bắt đầu mùa vụ.
- Ngày dự kiến thu hoạch.
- Sản lượng dự kiến.
- Sản lượng thực tế.
- Trạng thái.

Các trạng thái:

- Lên kế hoạch.
- Đang sản xuất.
- Đã thu hoạch.
- Hoàn thành.
- Tạm dừng.

Dùng badge màu tương ứng.

Các nút:

- Xem chi tiết.
- Cập nhật nhật ký.
- Truy xuất.

## 8.3. Tạo lô sản xuất

Form gồm:

- Mã lô.
- Tên lô.
- Loại nông sản.
- Giống.
- Diện tích.
- Vùng trồng.
- Địa điểm.
- Ngày bắt đầu mùa vụ.
- Ngày dự kiến thu hoạch.
- Sản lượng dự kiến.
- Số hộ liên kết.
- Người phụ trách.
- Mô tả.

Có validation.

Mã lô không được trùng.

Ngày dự kiến thu hoạch không trước ngày bắt đầu.

## 8.4. Trang chi tiết lô

Route: `/production-lots/:id`

Thiết kế giao diện chi tiết đẹp và trực quan.

Header hiển thị:

- Mã lô.
- Tên sản phẩm.
- Trạng thái.
- Nút chỉnh sửa.
- Nút truy xuất.

Có các tab:

### Tab 1 — Thông tin chung

- Tên lô.
- Mã lô.
- Nông sản.
- Diện tích.
- Vùng trồng.
- Đơn vị sản xuất.
- Ngày bắt đầu mùa vụ.
- Ngày dự kiến thu hoạch.
- Sản lượng dự kiến.
- Sản lượng thực tế.
- Trạng thái.

Hiển thị các card thông tin và tiến độ sản xuất.

### Tab 2 — Nhật ký sản xuất

Hiển thị timeline hoạt động:

- Chuẩn bị đất.
- Chăm sóc.
- Bón phân.
- Tưới nước.
- Phun thuốc.
- Kiểm tra sâu bệnh.
- Thu hoạch.
- Hoạt động khác.

Mỗi mục gồm:

- Ngày thực hiện.
- Loại hoạt động.
- Nội dung.
- Người thực hiện.
- Vật tư sử dụng nếu có.
- Ghi chú.
- Hình ảnh minh họa nếu có.

Có nút:

"+ Thêm nhật ký"

Form nhập nhật ký.

Cho phép sửa/xóa.

Nếu một hoạt động có liên kết tới khoản chi phí, chỉ tính khoản chi đó một lần trong hệ thống.

### Tab 3 — Chi phí

Hiển thị:

- Tổng chi phí của lô.
- Chi phí theo danh mục.
- Biểu đồ donut.
- Danh sách chi phí.
- Chi phí trên ha.
- Giá thành/kg nếu có dữ liệu hợp lệ.

### Tab 4 — Thu hoạch

Hiển thị:

- Sản lượng dự kiến.
- Tổng sản lượng thực tế.
- Số đợt thu hoạch.
- Ngày thu hoạch.
- Ghi chú.

Có thể thêm đợt thu hoạch.

Form:

- Ngày.
- Sản lượng.
- Người ghi nhận.
- Ghi chú.

Các đợt thu hoạch phải được tổng hợp chính xác.

### Tab 5 — Truy xuất

Hiển thị:

- Mã truy xuất.
- QR Code.
- Trạng thái công bố.
- Xem trước trang công khai.
- Tải QR.
- Nút truy cập trang truy xuất.

## 8.5. Dữ liệu demo

Có ít nhất 12 lô nông nghiệp.

Loại nông sản:

- Sầu riêng.
- Cà phê.
- Hồ tiêu.
- Bơ.
- Mắc ca.

Các lô thuộc nhiều giai đoạn khác nhau.

Không để tất cả lô đều "Đang sản xuất".

Phải có lô đã thu hoạch để minh họa tính giá thành.

Lưu ý:

Đối với cây lâu năm như sầu riêng và cà phê, ngày bắt đầu mùa vụ không đồng nghĩa với ngày gieo trồng cây lần đầu.

Không xây dựng dữ liệu nông nghiệp phi thực tế.

---

# IX. MODULE 4 — TRUY XUẤT NGUỒN GỐC

Route: `/traceability`

Đây là tính năng nổi bật của S-TRACE.

## 9.1. Giao diện chính

Header:

"Truy xuất nguồn gốc"

Mô tả:

"Minh bạch hành trình sản xuất nông sản từ vùng trồng đến người tiêu dùng"

KPI:

- Tổng lô.
- Lô đã công bố truy xuất.
- Lô chưa công bố.
- Số mã QR demo.

## 9.2. Danh sách truy xuất

Bảng:

- Mã truy xuất.
- Mã lô.
- Tên sản phẩm.
- Khu vực.
- Ngày tạo.
- Trạng thái.
- QR Code.
- Thao tác.

Có tìm kiếm, lọc và phân trang.

Các thao tác:

- Xem chi tiết.
- Xem QR.
- Tải QR.
- Xem trang công khai.
- Công bố/ngừng công bố mô phỏng.

## 9.3. QR Code

Dùng thư viện tạo QR chạy trực tiếp trong trình duyệt.

QR trỏ đến URL trang truy xuất:

`/trace/:code`

Mỗi mã QR liên kết với một bản ghi truy xuất.

Dữ liệu phải có thể tra cứu được từ mock data.

Không nhúng toàn bộ thông tin vào QR.

Đối với website được triển khai trên static hosting, cần cấu hình fallback cho React Router hoặc sử dụng cơ chế route phù hợp để mở trực tiếp liên kết QR.

Lưu ý:

- QR từ dữ liệu mẫu đã được đóng gói sẵn có thể mở trên thiết bị khác sau khi deploy.
- QR cho bản ghi vừa tạo bằng React State/localStorage không được giả định có thể chia sẻ dữ liệu sang thiết bị khác.
- Nếu website đang chạy localhost, không tuyên bố QR có thể mở từ mọi điện thoại.

## 9.4. Trang truy xuất công khai

Route: `/trace/:code`

Trang này là giao diện riêng, không có sidebar quản trị.

Thiết kế tối ưu điện thoại.

Thông tin gồm:

**Header**

- Logo S-TRACE.
- Tên hợp tác xã.
- Dòng chữ "Thông tin truy xuất nguồn gốc".

**Thông tin sản phẩm**

- Ảnh nông sản.
- Tên sản phẩm.
- Mã truy xuất.
- Mã lô.
- Loại nông sản.

**Nguồn gốc**

- Tên hợp tác xã.
- Tỉnh/thành.
- Khu vực sản xuất.
- Diện tích.
- Ngày bắt đầu mùa vụ.
- Ngày thu hoạch nếu đã có.

**Hành trình sản xuất**

Timeline:

- Chuẩn bị.
- Chăm sóc.
- Bón phân.
- Tưới tiêu.
- Kiểm tra.
- Thu hoạch.

Các hoạt động phải xuất phát từ nhật ký được đánh dấu cho phép công khai.

**Hình ảnh**

Gallery hình ảnh vùng trồng và nông sản.

**Thông tin đơn vị sản xuất**

Hiển thị thông tin tổ chức phù hợp để công khai.

Không công bố dữ liệu cá nhân, chi phí nội bộ hoặc thông tin riêng tư.

**Footer**

Logo S-TRACE.

Slogan.

Dòng thông báo:

"Thông tin do đơn vị sản xuất cung cấp — Dữ liệu minh họa S-TRACE."

Không tự tạo nhãn chứng nhận VietGAP, GlobalGAP hoặc kiểm định chất lượng khi không có dữ liệu xác thực.

## 9.5. Tem QR

Tạo mẫu tem truy xuất gồm:

- Logo.
- Tên nông sản.
- Mã QR.
- Mã lô.
- Tên HTX.
- Hướng dẫn quét.

Cho phép:

- Xem trước.
- Tải hình QR.
- In tem bằng chức năng in của trình duyệt.

Thiết kế CSS riêng cho bản in.

---

# X. MODULE 5 — BÁO CÁO

Route: `/reports`

Trang báo cáo phải được thiết kế hiện đại, không chỉ là một bảng dữ liệu đơn giản.

## 10.1. Header

Tiêu đề:

"Báo cáo & Thống kê"

Mô tả:

"Phân tích chi phí và hiệu quả sản xuất nông nghiệp"

Có nút:

"Xuất báo cáo"

## 10.2. Bộ lọc

Cho phép:

- Chọn loại báo cáo.
- Chọn tháng.
- Chọn quý.
- Chọn năm.
- Chọn khoảng ngày.
- Chọn lô sản xuất.
- Chọn loại nông sản.

## 10.3. Báo cáo chi phí

Có:

- Tổng chi phí.
- Chi phí từng danh mục.
- Biểu đồ cột.
- Biểu đồ donut.
- Bảng tổng hợp theo lô.
- Biến động chi phí theo tháng.

## 10.4. Báo cáo sản lượng

Có:

- Sản lượng dự kiến.
- Sản lượng thực tế.
- Chênh lệch.
- Biểu đồ theo thời gian.
- Sản lượng theo loại nông sản.
- Sản lượng theo lô.

## 10.5. Báo cáo giá thành

Có:

- Tổng chi phí sản xuất.
- Sản lượng đã thu hoạch.
- Giá thành bình quân.
- Giá thành theo lô.
- So sánh các lô.

Công thức giá thành mẫu:

Giá thành/kg = Tổng chi phí được phân bổ / Tổng sản lượng thực thu tương ứng.

Chỉ tính khi đầy đủ dữ liệu.

Không sử dụng sản lượng dự kiến để tính giá thành thực tế.

## 10.6. Báo cáo hiệu quả

Có:

- Chi phí/ha.
- Sản lượng/ha.
- Giá thành/kg.
- Tỷ lệ thực hiện kế hoạch.
- So sánh hiệu quả giữa các lô.

Không hiển thị lợi nhuận hoặc doanh thu nếu không có dữ liệu bán hàng.

## 10.7. Báo cáo truy xuất

Hiển thị:

- Số mã QR.
- Số lô đã công bố.
- Số lô chưa công bố.
- Tỷ lệ đầy đủ nhật ký.
- Danh sách lô có thể truy xuất.

## 10.8. Xuất báo cáo

Có chức năng:

- Xuất Excel.
- In báo cáo.
- Lưu PDF thông qua trình duyệt hoặc thư viện client-side.

File xuất phải lấy dữ liệu từ trạng thái hiện tại và bộ lọc đang chọn.

Không xuất những con số tĩnh không liên quan dữ liệu đang hiển thị.

---

# XI. MOCK DATA

Tạo dữ liệu minh họa phong phú và nhất quán.

Ít nhất:

- 1 hợp tác xã.
- 5 loại nông sản.
- 12 lô sản xuất.
- 50 khoản chi phí.
- 40 hoạt động nhật ký.
- 10 đợt thu hoạch phân bổ trên các lô phù hợp.
- 8 bản ghi truy xuất QR.
- Các hoạt động gần đây.

Thông tin mẫu:

Tên tổ chức:

HTX Ea H'leo

Địa phương:

Đắk Lắk.

Một số mã lô:

- SR-DL-001
- SR-DL-002
- CF-DL-003
- CF-DL-004
- HP-DL-005
- BV-DL-006

Không bắt buộc giữ nguyên các con số trong ảnh tham khảo.

**Ưu tiên tính nhất quán và hợp lý hơn việc sao chép số liệu từ ảnh.**

Ví dụ:

Nếu lô A có tổng chi phí 40.000.000 VNĐ và đã thu hoạch 2.000 kg thì giá thành là 20.000 VNĐ/kg.

Dashboard, chi tiết lô và báo cáo đều phải dùng cùng kết quả.

Không để 3 trang hiển thị 3 kết quả khác nhau.

Tạo helper tính toán chung.

Dữ liệu demo nên trải rộng nhiều tháng để biểu đồ có ý nghĩa.

Sử dụng thời điểm tham chiếu cố định phù hợp với bộ dữ liệu mẫu, tránh dashboard trống khi chạy ứng dụng ở những năm khác.

---

# XII. STATE MANAGEMENT

Không cần Backend.

Toàn bộ ứng dụng sử dụng mock data và state phía Client.

Đề xuất:

- Khởi tạo dữ liệu từ seed.
- Dùng global store để chia sẻ dữ liệu.
- Các trang sử dụng selector/helper chung.
- CRUD thực hiện trên state.
- React tự render lại khi state thay đổi.

Ví dụ:

Khi thêm một khoản chi phí:

1. Expense state được cập nhật.
2. Bảng chi phí cập nhật.
3. KPI chi phí cập nhật.
4. Chi phí lô tương ứng cập nhật.
5. Dashboard cập nhật.
6. Báo cáo cập nhật.

Nếu sử dụng localStorage:

- Lưu dữ liệu demo khi thay đổi.
- Khôi phục khi refresh.
- Kiểm tra dữ liệu lỗi.
- Có version.
- Có nút reset dữ liệu mẫu.

Không cần đồng bộ nhiều thiết bị.

Không viết API giả chỉ để tạo cảm giác có Backend.

---

# XIII. ROUTING

Các route chính:

`/` — Chuyển đến Tổng quan.

`/dashboard` — Tổng quan.

`/expenses` — Chi phí.

`/production-lots` — Danh sách lô.

`/production-lots/:id` — Chi tiết lô.

`/traceability` — Quản lý truy xuất.

`/trace/:code` — Trang truy xuất công khai.

`/reports` — Báo cáo.

`*` — Trang 404.

Các trang chi tiết được tính là route phụ, không tạo mục menu chính mới.

Sidebar phải highlight đúng menu đang truy cập.

Các URL phải hoạt động khi điều hướng và tải lại trên môi trường triển khai đã cấu hình.

---

# XIV. CẤU TRÚC SOURCE CODE

Đề xuất:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│
├── assets/
│   ├── images/
│   └── icons/
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainLayout.tsx
│   ├── ui/
│   ├── charts/
│   ├── tables/
│   ├── forms/
│   └── common/
│
├── features/
│   ├── dashboard/
│   ├── expenses/
│   ├── production-lots/
│   ├── traceability/
│   └── reports/
│
├── data/
│   ├── mock/
│   └── seed.ts
│
├── store/
├── hooks/
├── types/
├── utils/
├── constants/
├── styles/
└── main.tsx
```

Không nhất thiết phải tuân thủ máy móc.

Hãy lựa chọn cấu trúc dễ mở rộng và dễ bảo trì.

Không gom hàng nghìn dòng code vào App.tsx.

Không tạo quá nhiều abstraction không có giá trị.

---

# XV. YÊU CẦU GIAO DIỆN CHI TIẾT

## 15.1. Dashboard cards

Card phải có:

- Icon.
- Tiêu đề.
- Giá trị.
- Xu hướng.
- Sparkline nhỏ nếu phù hợp.
- Background pastel nhẹ.

## 15.2. Tables

Bảng phải có:

- Header rõ ràng.
- Hover row.
- Căn chỉnh số tiền.
- Trạng thái.
- Pagination.
- Empty state.
- Scroll phù hợp trên mobile.
- Search và filter thực tế.

## 15.3. Charts

Biểu đồ phải:

- Responsive.
- Có tooltip.
- Có legend.
- Có label/đơn vị.
- Không bị cắt.
- Dễ đọc.
- Màu đồng nhất.

Không hardcode dữ liệu riêng bên trong component biểu đồ.

## 15.4. Dialog

Form dialog phải:

- Có tiêu đề.
- Có mô tả khi cần.
- Có nút đóng.
- Có validation.
- Có nút lưu/hủy.
- Đóng khi lưu thành công.
- Không mất dữ liệu ngoài ý muốn.

## 15.5. Empty state

Ví dụ:

"Chưa có lô sản xuất nào"

Nút:

"Tạo lô sản xuất"

Hoặc:

"Không tìm thấy dữ liệu phù hợp"

Nút:

"Xóa bộ lọc"

## 15.6. Notification

Sử dụng toast tiếng Việt:

- "Thêm lô sản xuất thành công"
- "Cập nhật chi phí thành công"
- "Đã xóa khoản chi phí"
- "Vui lòng kiểm tra thông tin"
- "Không tìm thấy dữ liệu"
- "Không thể lưu dữ liệu demo"

Không hiển thị thông báo thành công trước khi state được cập nhật hợp lệ.

---

# XVI. RESPONSIVE

Thiết kế phải hoạt động tốt trên:

- 1920px.
- 1440px.
- 1366px.
- 1024px.
- 768px.
- 390px.
- 375px.

Desktop:

- Sidebar cố định.
- Dashboard nhiều cột.
- Table đầy đủ.
- Biểu đồ đặt cạnh nhau.

Tablet:

- Sidebar thu gọn.
- KPI tự thay đổi layout.
- Biểu đồ xếp lại.

Mobile:

- Sidebar dạng drawer.
- KPI 1 hoặc 2 cột.
- Bảng có chế độ xem phù hợp.
- Modal không tràn màn hình.
- Bộ lọc dễ thao tác.
- QR hiển thị rõ.
- Nút bấm đủ lớn để chạm.

Trang truy xuất nguồn gốc công khai phải ưu tiên hiển thị trên điện thoại.

Không có lỗi overflow ngang ngoài ý muốn.

---

# XVII. HÌNH ẢNH VÀ ASSETS

Sử dụng ảnh minh họa phù hợp:

- Vườn sầu riêng.
- Vườn cà phê.
- Hồ tiêu.
- Vùng trồng.
- Người nông dân.
- Nông sản sau thu hoạch.

Ưu tiên ảnh chất lượng cao, có quyền sử dụng phù hợp và lưu thành assets tĩnh khi cần.

Không để ảnh lỗi.

Không dùng emoji để thay ảnh sản phẩm trong giao diện chính.

Nếu chưa có ảnh phù hợp, dùng placeholder đẹp, thống nhất và có thể thay bằng assets thật sau.

Có thể tạo hình minh họa SVG cho phần chân sidebar.

Hình ảnh không được làm dashboard quá nặng hoặc mất tập trung.

---

# XVIII. TƯƠNG TÁC BẮT BUỘC

Website không được chỉ đẹp về hình ảnh.

Những thao tác sau phải hoạt động:

**Tổng quan**

- Lọc thời gian.
- Xem chi tiết lô.
- Điều hướng sang chi phí.
- Hiển thị dữ liệu cập nhật.

**Chi phí**

- Thêm.
- Sửa.
- Xóa.
- Tìm kiếm.
- Lọc.
- Sắp xếp.
- Phân trang.
- Xem chi tiết.
- Xuất Excel.

**Lô sản xuất**

- Tạo lô.
- Sửa lô.
- Tìm kiếm.
- Lọc.
- Xem chi tiết.
- Thêm nhật ký.
- Sửa nhật ký.
- Xóa nhật ký.
- Ghi nhận thu hoạch.
- Xem chi phí.
- Mở truy xuất.

**Truy xuất**

- Tìm kiếm.
- Xem QR.
- Tải QR.
- Xem thông tin nguồn gốc.
- Xem timeline.
- Công bố/ngừng công bố mô phỏng.
- In tem.

**Báo cáo**

- Chọn kỳ.
- Chọn loại báo cáo.
- Chọn lô.
- Biểu đồ cập nhật.
- Bảng cập nhật.
- Xuất Excel.
- In/Lưu PDF.

Mọi nút có thể click phải có chức năng hợp lý.

Không tạo nút trang trí nhưng trông như có thể thao tác.

---

# XIX. LOGIC NGHIỆP VỤ

Mặc dù đây là Frontend demo, cần đảm bảo các quy tắc cơ bản.

## Chi phí

- Không âm.
- Không bằng 0.
- Có ngày phát sinh hợp lệ.
- Có danh mục.
- Có lô liên kết hợp lệ.
- Các khoản chi được tổng hợp một lần.

## Lô sản xuất

- Mã duy nhất.
- Diện tích lớn hơn 0.
- Ngày hợp lệ.
- Sản lượng không âm.
- Không xóa trực tiếp lô có dữ liệu liên kết mà không xử lý các liên kết.

## Thu hoạch

- Sản lượng thực thu không âm.
- Đợt thu hoạch phải liên kết với lô tồn tại.
- Sản lượng thực tế bằng tổng các đợt thu hoạch hợp lệ.

## Giá thành

- Không chia cho 0.
- Không sử dụng số liệu kế hoạch thay số liệu thực tế.
- Nếu không đủ dữ liệu thì hiển thị "Chưa đủ dữ liệu".

## Truy xuất

- Mã duy nhất.
- Liên kết đúng lô.
- Không công bố thông tin chi phí nội bộ.
- Không sử dụng nhãn chứng nhận giả.
- Không tạo cảm giác dữ liệu demo đã được xác thực bởi cơ quan chức năng.

## Báo cáo

- Mọi số liệu phải khớp với các module.
- Bộ lọc phải đúng.
- Đơn vị phải thống nhất.
- Tỷ lệ được tính từ nguồn dữ liệu.
- Dữ liệu rỗng phải được xử lý hợp lý.

---

# XX. YÊU CẦU VỀ HIỆU NĂNG VÀ TRẢI NGHIỆM

- Không dùng animation quá nhiều.
- Hỗ trợ reduced motion.
- Component có thể tái sử dụng.
- Lazy loading route nếu phù hợp.
- Tránh render lại không cần thiết.
- Biểu đồ mượt.
- Không có lỗi console.
- Không có broken link.
- Không có cảnh báo React key.
- Không có lỗi hydration hoặc routing.
- Có focus state.
- Có keyboard navigation.
- Có accessibility label.
- Form có thông báo lỗi rõ ràng.

---

# XXI. TESTING VÀ NGHIỆM THU

Sau khi code xong, kiểm tra toàn bộ.

## Test 1 — Navigation

- Cả 5 menu hoạt động.
- Active menu đúng.
- Route chi tiết đúng.
- 404 hoạt động.
- Public trace không hiển thị sidebar.

## Test 2 — Expense

- Thêm khoản chi.
- Sửa khoản chi.
- Xóa khoản chi.
- Bộ lọc.
- Tổng chi phí cập nhật.
- Dashboard cập nhật.

## Test 3 — Production Lot

- Tạo lô mới.
- Chỉnh sửa lô.
- Mở chi tiết.
- Thêm nhật ký.
- Ghi nhận thu hoạch.
- Kiểm tra sản lượng cập nhật.

## Test 4 — Traceability

- Tạo mã demo.
- QR hiển thị.
- QR chứa URL đúng.
- Trang truy xuất hoạt động.
- Mã không tồn tại có thông báo.
- Ngừng công bố được phản ánh đúng.

## Test 5 — Reports

- Chọn bộ lọc.
- Biểu đồ thay đổi.
- Tổng số liệu đúng.
- Xuất Excel.
- In/PDF.

## Test 6 — Responsive

Kiểm tra:

- Desktop.
- Tablet.
- Mobile.
- Sidebar.
- Tables.
- Forms.
- Charts.
- Public trace page.

## Test 7 — Build

Chạy các lệnh phù hợp:

- TypeScript check.
- ESLint.
- Production build.

Nếu có Playwright, chạy kiểm thử các luồng quan trọng trên trình duyệt.

Không báo cáo test thành công nếu chưa thực sự chạy.

---

# XXII. QUY TRÌNH TRIỂN KHAI

Hãy chủ động thực hiện các giai đoạn sau:

## Phase 1 — Kiểm tra dự án

- Kiểm tra source code hiện tại.
- Kiểm tra package.json.
- Kiểm tra framework.
- Kiểm tra assets.
- Kiểm tra routes.
- Kiểm tra các component có sẵn.

Nếu dự án chưa tồn tại, tạo mới.

Không xóa code hiện tại một cách tùy tiện.

## Phase 2 — Thiết lập nền tảng

- Cấu hình Tailwind.
- Cấu hình shadcn/ui.
- Cấu hình font.
- Tạo design tokens.
- Tạo router.
- Tạo layout.
- Tạo sidebar.
- Tạo topbar.
- Tạo mock data.
- Tạo state management.

## Phase 3 — Triển khai 5 module

Triển khai theo thứ tự:

1. Tổng quan.
2. Chi phí.
3. Lô sản xuất.
4. Truy xuất nguồn gốc.
5. Báo cáo.

Hoàn thiện từng module cả giao diện và tương tác.

## Phase 4 — Liên kết dữ liệu

- Kết nối dữ liệu các module.
- Đồng bộ tổng chi phí.
- Đồng bộ sản lượng.
- Đồng bộ giá thành.
- Đồng bộ nhật ký.
- Đồng bộ truy xuất.
- Đồng bộ báo cáo.

## Phase 5 — Hoàn thiện UI/UX

- Responsive.
- Hiệu ứng.
- Empty state.
- Validation.
- Dialog.
- Loading.
- Toast.
- Chỉnh sửa khoảng cách.
- Kiểm tra typography.
- Kiểm tra màu sắc.

## Phase 6 — Kiểm thử

- Chạy ứng dụng.
- Kiểm tra từng màn hình.
- Kiểm tra các chức năng.
- Kiểm tra build.
- Sửa lỗi.
- Xác nhận kết quả thực tế.

Không dừng ở việc tạo giao diện khi vẫn còn chức năng chưa hoạt động.

---

# XXIII. TIÊU CHUẨN HOÀN THÀNH

Website chỉ đạt yêu cầu khi:

- Có đủ 5 module.
- Giao diện thống nhất.
- Sidebar và topbar chuyên nghiệp.
- Dashboard có KPI và biểu đồ.
- Chi phí có CRUD demo.
- Lô sản xuất có CRUD demo.
- Nhật ký canh tác hoạt động.
- Thu hoạch cập nhật sản lượng.
- QR truy xuất hoạt động trong giới hạn dữ liệu tĩnh.
- Trang truy xuất công khai đẹp.
- Báo cáo sử dụng dữ liệu thống nhất.
- Có xuất file.
- Có tìm kiếm và bộ lọc.
- Có responsive.
- Không có lỗi build.
- Không có lỗi TypeScript.
- Không có lỗi runtime nghiêm trọng.
- Không yêu cầu Backend.
- Không yêu cầu Database.

Không được tuyên bố hoàn thành 100% nếu chưa xác minh các hạng mục tương ứng.

---

# XXIV. KẾT QUẢ BÀN GIAO

Sau khi hoàn thành, tạo file:

`S_TRACE_FRONTEND_REPORT.md`

Báo cáo gồm:

1. Tổng quan website.
2. Công nghệ đã sử dụng.
3. Danh sách chức năng.
4. Các route.
5. Cấu trúc thư mục.
6. Những phần đã hoàn thành.
7. Những phần chưa hoàn thành.
8. Kết quả kiểm thử.
9. Hướng dẫn chạy.
10. Hướng dẫn demo.

Đồng thời tạo:

`S_TRACE_TEST_CHECKLIST.md`

Checklist nghiệm thu toàn bộ 5 module.

Nếu chưa thể kiểm thử một chức năng, phải ghi rõ "Chưa xác minh", không tự đánh dấu hoàn thành.

---

# XXV. CHỈ THỊ CUỐI CÙNG

Tôi muốn bạn trực tiếp xây dựng một website Frontend S-TRACE hoàn chỉnh dựa trên 3 hình ảnh tham khảo.

**Không xây Backend.**

**Không xây Database.**

**Không kết nối API.**

**Không làm hệ thống quá phức tạp.**

Tập trung vào:

1. Giao diện chuyên nghiệp.
2. Thiết kế đẹp, hiện đại.
3. Trải nghiệm người dùng tốt.
4. Đầy đủ 5 chức năng.
5. Tương tác thực tế bằng React State.
6. Mock data phong phú.
7. Biểu đồ và bảng dữ liệu đẹp.
8. QR Code và trang truy xuất.
9. Responsive.
10. Code rõ ràng, dễ bảo trì.

S-TRACE cần có sự liên kết giữa:

**LÔ SẢN XUẤT → NHẬT KÝ SẢN XUẤT → CHI PHÍ → THU HOẠCH → TRUY XUẤT NGUỒN GỐC → BÁO CÁO**

Hãy giữ tinh thần thiết kế từ hình ảnh tham khảo, nhưng nâng cấp lên mức một website SaaS hoàn chỉnh và có tính thẩm mỹ cao.

Bạn được chủ động đưa ra quyết định UI/UX hợp lý khi tài liệu không quy định cụ thể.

Không cần hỏi lại về những lựa chọn thiết kế nhỏ.

Không dừng ở bước phân tích hoặc viết kế hoạch.

**HÃY KIỂM TRA SOURCE CODE HIỆN TẠI, SAU ĐÓ BẮT ĐẦU TRIỂN KHAI WEBSITE FRONTEND S-TRACE CHO ĐẾN KHI HOÀN THIỆN VÀ KIỂM THỬ CÁC CHỨC NĂNG TRONG PHẠM VI ĐÃ YÊU CẦU.**