# DuyCMS - Hệ thống Cửa hàng Rượu Ngoại Cao Cấp

![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-8.0-blue.svg?style=flat-square&logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat-square&logo=react)
![Entity Framework Core](https://img.shields.io/badge/EF_Core-8.0-3990c0.svg?style=flat-square&logo=nuget)
![MoMo Payment](https://img.shields.io/badge/Payment-MoMo-A50064.svg?style=flat-square)

**DuyCMS** là một giải pháp thương mại điện tử (E-commerce) toàn diện, được thiết kế chuyên biệt cho hệ thống cửa hàng Rượu Ngoại cao cấp. Dự án bao gồm một hệ thống quản trị nội dung (CMS/Admin Panel) mạnh mẽ và một trang giao diện khách hàng (Storefront) hiện đại, rực rỡ, được tối ưu hóa cho trải nghiệm mua sắm trực tuyến.

---

## 🌟 Kiến trúc Hệ thống

Dự án được phân chia thành 3 lớp chính (N-Tier Architecture):

1. **`CMS.BA` (Backend & Admin Panel)**
   - Xây dựng trên nền tảng **ASP.NET Core MVC** cho giao diện quản trị viên (Admin Panel).
   - Cung cấp **RESTful Web API** (có hỗ trợ Swagger đầy đủ tính năng Lọc/Phân trang/Tìm kiếm) cho Frontend React.
   - Quản lý xác thực và phân quyền bằng **JWT (JSON Web Tokens)** và Cookies.

2. **`Cms.data` (Data Access Layer)**
   - Quản lý cơ sở dữ liệu với **Entity Framework Core**.
   - Chứa toàn bộ các Models/Entities (`Product`, `Category`, `Order`, `OrderDetails`, `User`...).
   - Xử lý các nghiệp vụ truy vấn phức tạp bằng LINQ.

3. **`cms.frontend` (Storefront)**
   - Xây dựng bằng **React (Vite)**.
   - Giao diện người dùng sang trọng, rực rỡ với màu đỏ Burgundy (rượu vang) làm chủ đạo.
   - Tối ưu hóa UI/UX với tính năng Lọc trực tiếp (Client-side), Giỏ hàng Context API, và quy trình Checkout mượt mà.

---

## 🚀 Tính năng Nổi bật

### Dành cho Khách hàng (React Storefront)
- 🛒 **Mua sắm & Giỏ hàng**: Duyệt sản phẩm, lọc theo danh mục, giá tiền, từ khóa. Thêm/bớt sản phẩm vào giỏ hàng real-time.
- 💳 **Thanh toán Đa kênh**: Tích hợp cổng thanh toán **MoMo** (Quét mã QR, Thẻ ATM Nội địa, Thẻ Visa/Mastercard) và thanh toán khi nhận hàng (COD).
- 🧾 **Hóa đơn chuyên nghiệp**: Hiển thị biên lai/hóa đơn điện tử chi tiết, minh bạch ngay sau khi đặt hàng thành công.
- 👤 **Quản lý Hồ sơ**: Xem lịch sử đơn hàng, theo dõi trạng thái đơn hàng và các sản phẩm bị quản trị viên hủy (nếu có).

### Dành cho Quản trị viên (ASP.NET Core MVC Admin)
- 📦 **Quản lý Sản phẩm & Danh mục**: Thêm, sửa, xóa, ẩn sản phẩm. Quản lý kho hàng (`StockQuantity`).
- 🚚 **Xử lý Đơn hàng Thông minh**: 
  - Xem chi tiết đơn đặt hàng của khách.
  - Tính năng **Xử lý Đơn hàng Một phần (Partial Fulfillment)**: Cho phép Admin loại bỏ 1 hoặc vài sản phẩm bị lỗi/hết hàng ra khỏi đơn đã đặt. Hệ thống tự động tính toán lại tổng tiền.
- 💰 **Tự động hóa Tài chính**: Tự động lưu trữ lịch sử **Hoàn tiền (Refund)** đối với những đơn hàng đã thanh toán MoMo/Visa mà bị loại bỏ sản phẩm. Giao diện báo cáo tài chính minh bạch cho bộ phận Kế toán.

---

## 🛠 Công nghệ Sử dụng

### Backend
- **Framework:** ASP.NET Core 8.0 (MVC & Web API)
- **Database:** SQL Server
- **ORM:** Entity Framework Core
- **Authentication:** JWT Bearer Authentication & Cookie Authentication
- **API Documentation:** Swagger UI (OpenAPI)

### Frontend
- **Thư viện chính:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios (kèm Interceptors xử lý token)
- **Styling:** CSS3 (Custom Properties), Bootstrap 5, FontAwesome 6

---

## ⚙️ Hướng dẫn Cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (phiên bản 18+ trở lên)
- SQL Server (hoặc SQL Server Express)

### 2. Thiết lập Backend (ASP.NET Core)
1. Mở file Solution `DuyCMS_Solution.sln` bằng Visual Studio.
2. Mở file `appsettings.json` trong project `CMS.BA`, sửa chuỗi kết nối cơ sở dữ liệu (`DefaultConnection`) cho phù hợp với máy của bạn.
3. Mở Package Manager Console, chọn `Cms.data` làm Default Project và chạy lệnh cập nhật database:
   ```bash
   Update-Database
   ```
4. Đặt `CMS.BA` làm Startup Project và nhấn F5 (hoặc chạy lệnh `dotnet run`) để khởi động Server. Swagger sẽ chạy ở cổng `https://localhost:7226`.

### 3. Thiết lập Frontend (React)
1. Mở một cửa sổ Terminal mới, điều hướng vào thư mục Frontend:
   ```bash
   cd cms.frontend
   ```
2. Cài đặt các gói phụ thuộc (Dependencies):
   ```bash
   npm install
   ```
3. Khởi động máy chủ phát triển React:
   ```bash
   npm run dev
   ```
4. Truy cập giao diện cửa hàng tại `http://localhost:5173`.

---

## 📜 Cấu trúc Thư mục

```text
DuyCMS_Solution/
├── CMS.BA/                  # ASP.NET Core MVC & Web API (Backend)
│   ├── Controllers/         # API Controllers (Swagger) & MVC Controllers (Admin)
│   ├── Views/               # Giao diện quản trị Admin (Razor Views)
│   ├── appsettings.json     # Cấu hình chuỗi kết nối và JWT
│   └── Program.cs           # Khởi tạo Middleware & Services
│
├── Cms.data/                # Entity Framework Core Layer
│   ├── Entities/            # Database Models
│   ├── EF/                  # ApplicationDbContext
│   └── Migrations/          # Lịch sử thay đổi Database
│
└── cms.frontend/            # React Storefront
    ├── src/
    │   ├── api/             # Cấu hình AxiosClient
    │   ├── components/      # React Components (Header, Footer, AuthProvider...)
    │   ├── pages/           # Cấu hình các trang (Home, Shop, Checkout, Profile...)
    │   └── services/        # Các hàm gọi API (productService, orderService...)
    └── package.json         # Danh sách thư viện Node.js
```

---

## 🤝 Sinh viên thực hiện

- **Họ và tên:** Hà Nhật Duy
- **MSSV:** 2123110203

Dự án được xây dựng và phát triển như một sản phẩm đồ án chất lượng cao.
Mọi thắc mắc hoặc đóng góp vui lòng mở **Issue** trên Repository này.
