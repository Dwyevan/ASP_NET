BUỔI 1: KHỞI TẠO CẤU TRÚC ĐỒ ÁN TỐT NGHIỆP CMS FULL-STACK
🎯 Mục tiêu bài học
Sau khi kết thúc buổi này, có thể:
●	Tự thiết lập cấu trúc Solution 3 lớp chuyên nghiệp (Data - Backend - Frontend).
●	Định nghĩa toàn bộ các thực thể (Entities) cần thiết cho một hệ thống quản trị nội dung.
●	Hiểu mối quan hệ giữa các bảng trong Cơ sở dữ liệu (Database Design).
 
________________________________________
🏗 Bước 1: Tạo Thùng chứa dự án (Blank Solution)
1.	Mở Visual Studio 2022.
2.	Chọn Create a new project.
3.	Tìm từ khóa "Blank Solution" -> Chọn và bấm Next.
4.	Solution name: ThaiCMS_Solution. Bấm Create.
________________________________________
🛠 Bước 2: Tạo Project 1 - CMS.Data (Lớp Dữ liệu)
Đây là nơi chứa "linh hồn" của ứng dụng: các bảng dữ liệu.
1.	Chuột phải vào Solution -> Add -> New Project.
2.	Chọn mẫu Class Library (.NET Core). Bấm Next.
3.	Project name: CMS.Data. Bấm Create.
4.	Xóa file Class1.cs. Tạo thư mục tên là Entities.
5.	Tạo 8 Class quan trọng sau bên trong thư mục Entities:
2.1. Thực thể Danh mục (Category.cs)
C#
namespace CMS.Data.Entities {
    public class Category {
        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; }
        
        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; } 
    }
}

2.2. Thực thể Bài viết (Post.cs)
C#
namespace CMS.Data.Entities {
    public class Post {
        public int Id { get; set; }
        public string Title { get; set; } // Tiêu đề bài viết
        public string Content { get; set; } // Nội dung chi tiết
        public string ImageUrl { get; set; } // Hình ảnh đại diện
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        // Khóa ngoại liên kết tới Category
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}

2.3. Thực thể Người dùng (User.cs)
Dùng cho chức năng đăng nhập quản trị (Membership).
C#
namespace CMS.Data.Entities {
    public class User {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }
}

2.4. Thực thể Danh mục sản phẩm (CategoryProduct.cs)
C#
using System.ComponentModel.DataAnnotations;
namespace CMS.Data.Entities
{

    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100)]
        public string Name { get; set; }

        public string? Description { get; set; }

        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }
    }
}

2.5.Thực thể Sản phẩm (Product.cs)
C#
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }
    }
}

2.6.Thực thể Khách hàng (Customer.cs)
C#
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    // Khách hàng
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        [Required]
        public string Password { get; set; } // Lưu mật khẩu thô theo yêu cầu tối giản

        public virtual ICollection<Order>? Orders { get; set; }
    }
}


2.7.Thực thể Đơn hàng (Order.cs)
C#
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int CustomerId { get; set; }

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; }

        [ForeignKey("CustomerId")] 
        public virtual Customer? Customer { get; set; }

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}

2.8.Thực thể Chi tiết đơn hàng  (OrderDetail.cs)
C#
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; } // Giá tại thời điểm mua

        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}

________________________________________
⚙️ Bước 3: Tạo Project 2 - CMS.Backend (Lớp Xử lý API)
Project này dùng công nghệ ASP.NET Core MVC để làm trang Admin và WebAPI cho ReactJS.
1.	Chuột phải vào Solution -> Add -> New Project.
2.	Chọn mẫu ASP.NET Core Web App (Model-View-Controller). Bấm Next.
3.	Project name: CMS.Backend. Bấm Create.
4.	Kết nối: Chuột phải vào CMS.Backend -> Add -> Project Reference -> Tích chọn CMS.Data.
Kiểm chứng Project hoạt động chưa? Thiết lập dự án khởi động (Startup Project)
Trong một Solution có nhiều Project, Visual Studio cần biết bạn muốn "chạy" cái nào đầu tiên.
1.	Tại cửa sổ Solution Explorer, tìm project CMS.Backend.
2.	Chuột phải vào tên CMS.Backend -> Chọn dòng Set as Startup Project.
3.	Dấu hiệu thành công: Tên project CMS.Backend sẽ được in đậm lên.
Nhấn phím F5 trên bàn phím (hoặc nhấn vào nút tam giác xanh có chữ CMS.Backend trên thanh công cụ).
Xác nhận bảo mật: Nếu máy hiện bảng hỏi về SSL Certificate (HTTPS), hãy nhấn Yes liên tục để trình duyệt tin cậy địa chỉ localhost.
	Kết quả: 
Phải hiện ra trang chào mừng của ASP.NET Core (Welcome) tại địa chỉ https://localhost:xxxx/
________________________________________
🌐 Bước 4: Tạo Project 3 - CMS.Frontend (Lớp Giao diện)
Project này dùng ReactJS để hiển thị tin tức cho người xem.
Bước 4.1- Cài đặt môi trường chạy ReactJS:
1.	Tải Node.js: Truy cập trang chủ nodejs.org.
2.	Chọn phiên bản: Tải bản LTS (Long Term Support - Bản ổn định nhất).
3.	Cài đặt: Mở file vừa tải về, nhấn Next liên tục cho đến khi hoàn tất. (Lưu ý: Tích chọn vào ô "Automatically install the necessary tools" nếu có).
4.	Khởi động lại: Sau khi cài xong, BẮT BUỘC phải tắt hẳn Visual Studio.
Kiểm chứng Node.js đã hoạt chưa bằng cách gõ lệnh

	node -v 
hay 
npm -v
Bước 4.2- Chạy chương trình Windows Explorer, tìm và mở folder Solution, nhấp chuột vào thanh địa chỉ của folder, gõ lệnh cmd (enter), mục đích để mở cửa sổ lệnh.
Gõ lệnh sau để tạo project React (nhanh và ổn định hơn):
		npx create-react-app cms.frontend
Bước 4.3- Sau khi lệnh chạy xong, quay lại Visual Studio -> Chuột phải Solution -> Add  -> Existing Web Site...
Tìm đến đúng thư mục cms.frontend.
Nhấn Open.
VS Studio 2022 sẽ hỏi xác nhận cập nhật .NET framework 
Lựa chọn: "Update the target to .NET Framework 4.8 (Recommended)"
Sau đó nhấn Continue.
	Giải thích 
Bản chất: Dự án React của chúng ta chạy bằng Node.js, nó hoàn toàn không dùng đến .NET Framework 4.0 hay 4.8.
Mục đích: Việc chọn "Update" chỉ là để Visual Studio tạo ra một file cấu hình tạm thời giúp nó hiển thị được cây thư mục (node_modules, src, public) trong cửa sổ Solution Explorer. Điều này giúp có thể mở file .js hoặc .css để sửa code trực tiếp trong Visual Studio cho tiện.
Kết quả: Thư mục sẽ hiện lên trong Solution Explorer với đầy đủ các file src, public, package.json.
Cách chạy thử Project 3 sau khi đã Add thành công:
Vì đây là "Existing Web Site", nút Play (F5) của Visual Studio có thể sẽ không chạy được trang React này. Hãy hướng dẫn cách chạy "chuẩn" của dân Frontend:
1.	Chuột phải vào folder cms.frontend -> Chọn Open in Terminal.
2.	Gõ lệnh: npm run dev (nếu dùng Vite) hoặc npm start (nếu dùng Create React App).
3.	Mở trình duyệt theo địa chỉ hiện ra trong Terminal (thường là localhost:3000 hoặc 5173).

🚀 BƯỚC 5: XÁC NHẬN THÀNH QUẢ (DEMO HIỂN THỊ ĐẦU TIÊN)
Mục tiêu: Giúp thấy được luồng dữ liệu từ Project Data đi qua Backend và hiện lên trình duyệt.
5.1. Tạo Controller quản trị
1.	Tại Project CMS.Backend, chuột phải vào thư mục Controllers -> Add -> Controller -> Chọn MVC Controller - Empty.
2.	Đặt tên là CategoryController.cs.
3.	Viết code tạo dữ liệu "giả" để hiển thị:
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Kết nối tới lớp dữ liệu bạn vừa tạo

public class CategoryController : Controller {
    public IActionResult Index() {
        // Tạo danh sách dữ liệu mẫu trực tiếp trong code
        var list = new List<Category> {
            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
        };
        return View(list); // Gửi danh sách này sang giao diện
    }
}

5.2. Tạo Giao diện (View)
1.	Trong code trên, chuột phải vào chữ Index -> Chọn Add View.
2.	Chọn Razor View, đặt tên là Index.cshtml.
3.	Dán đoạn code HTML đơn giản sau để hiện bảng:
HTML
@model IEnumerable<CMS.Data.Entities.Category>

<h2 class="text-primary">DANH SÁCH DANH MỤC (DỮ LIỆU MẪU)</h2>
<table class="table table-bordered">
    <thead>
        <tr>
            <th>ID</th> <th>Tên danh mục</th> <th>Mô tả</th>
        </tr>
    </thead>
    <tbody>
        @foreach (var item in Model) {
            <tr>
                <td>@item.Id</td>
                <td>@item.Name</td>
                <td>@item.Description</td>
            </tr>
        }
    </tbody>
</table>

5.3. Chạy dự án
1.	Nhấn F5.
2.	Khi trình duyệt hiện ra, gõ thêm vào thanh địa chỉ: https://localhost:xxxx/Category
3.	Kết quả: sẽ thấy bảng danh mục hiện lên đẹp mắt.
 ________________________________________
💡 TẠI SAO PHẢI LÀM BƯỚC NÀY?
Kiểm tra tính kết nối: Nếu trang web hiện lên đúng tên danh mục, chứng tỏ Project Backend đã tham chiếu (Reference) thành công sang Project Data.

✍️ BÀI TẬP TỰ RÈN LUYỆN (CHALLENGE)
Mục tiêu: Tự tay triển khai luồng dữ liệu cho các thực thể còn lại để làm quen với cấu trúc 3 lớp.
Thử thách 1: Quản lý bài viết (Post)
1.	Tại Project CMS.Data: Đảm bảo bạn đã gõ xong class Post.cs với các thuộc tính: Id, Title, Content, ImageUrl.
2.	Tại Project CMS.Backend:
○	Tạo PostController.cs.
○	Trong hàm Index, hãy tạo một danh sách giả gồm ít nhất 2 bài viết (Ví dụ: "Lộ trình học ASP.NET", "Cài đặt ReactJS").
○	Tạo View Index.cshtml để hiển thị danh sách bài viết dưới dạng bảng hoặc danh sách thẻ (Card).
 
Thử thách 2: Quản lý người dùng (User)
1.	Tại Project CMS.Data: Kiểm tra class User.cs (Id, Username, FullName, Role).
2.	Tại Project CMS.Backend:
○	Tạo UserController.cs.
○	Tạo dữ liệu giả cho 2 tài khoản (Ví dụ: Admin, Editor).
○	Tạo View để hiển thị danh sách thành viên quản trị hệ thống.
 
________________________________________
💡 GIẢI THÍCH  (TẠI SAO PHẢI LÀM?)
●	Sự lặp lại tạo nên kỹ năng: Khi bạn làm lại 3 lần cho 3 thực thể khác nhau, tay bạn sẽ quen với việc tạo Controller và View.
●	Hiểu về kiểu dữ liệu: Bạn sẽ thấy sự khác biệt khi hiển thị một chuỗi ngắn (Name) và một chuỗi dài (Content của bài viết).
●	Sẵn sàng cho Tuần 2: Khi sang tuần sau, chúng ta chỉ cần thay thế phần "Dữ liệu giả" này bằng lệnh gọi từ Database qua EF Core là xong 50% đồ án!
Gợi ý:
Code PostController.cs
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Quan trọng: Phải có dòng này để dùng lớp Post

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // Hàm Index: Hiển thị danh sách bài viết mẫu
        public IActionResult Index()
        {
            // 1. Tạo dữ liệu giả (Mock Data) cho Bài viết
            var posts = new List<Post>
            {
                new Post 
                { 
                    Id = 1, 
                    Title = "Lộ trình học ASP.NET Core cho người mới", 
                    Content = "Nội dung bài viết về lộ trình học .NET...",
                    ImageUrl = "https://via.placeholder.com/150",
                    CreatedDate = DateTime.Now 
                },
                new Post 
                { 
                    Id = 2, 
                    Title = "ReactJS và WebAPI: Xu hướng Fullstack 2026", 
                    Content = "Nội dung bài viết về sự kết hợp React và API...",
                    ImageUrl = "https://via.placeholder.com/150",
                    CreatedDate = DateTime.Now.AddDays(-1) 
                },
                new Post 
                { 
                    Id = 3, 
                    Title = "Hướng dẫn cài đặt môi trường Visual Studio", 
                    Content = "Các bước cài đặt công cụ cần thiết cho lập trình viên...",
                    ImageUrl = "https://via.placeholder.com/150",
                    CreatedDate = DateTime.Now.AddDays(-2) 
                }
            };

            // 2. Gửi danh sách dữ liệu sang View
            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết một bài viết (Bổ sung  khá giỏi)
        public IActionResult Details(int id)
{
    // Giả lập tìm bài viết trong Database bằng Id
    // Trong thực tế tuần sau sẽ là: _context.Posts.Find(id);
    var post = new Post 
    { 
        Id = id, 
        Title = "Nội dung chi tiết bài viết số " + id, 
        Content = "Đây là nội dung đầy đủ của bài viết mà bạn vừa click vào. Ở đây  có thể viết dài hơn để thấy sự khác biệt với trang danh sách.",
        ImageUrl = "https://via.placeholder.com/600x300", // Ảnh to hơn
        CreatedDate = DateTime.Now 
    };

    if (post == null) return NotFound();

    return View(post);
}
    }
}

Code CMS.Backend/Views/Post/Index.cshtml
@model IEnumerable<CMS.Data.Entities.Post>

<div class="container mt-4">
    <h2 class="mb-4 text-danger">DANH SÁCH BÀI VIẾT MỚI NHẤT</h2>
    <div class="row">
        @foreach (var item in Model)
        {
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm">
                    <img src="@item.ImageUrl" class="card-img-top" alt="Thumbnail">
                    <div class="card-body">
                        <h5 class="card-title text-primary">@item.Title</h5>
                        <p class="card-text text-truncate">@item.Content</p>
                        <p class="text-muted small">Ngày đăng: @item.CreatedDate.ToString("dd/MM/yyyy")</p>
                        <a href="/Post/Details/@item.Id" class="btn btn-outline-primary btn-sm">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        }
    </div>
</div>
Code UserController.cs
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public IActionResult Index()
        {
            // 1. Tạo danh sách Người dùng giả (Mock Data)
            var users = new List<User>
            {
                new User 
                { 
                    Id = 1, 
                    Username = "admin_thai", 
                    FullName = "Nguyễn Cao Thái", 
                    Role = "Administrator" 
                },
                new User 
                { 
                    Id = 2, 
                    Username = "editor_01", 
                    FullName = "Trần Văn Biên Tập", 
                    Role = "Editor" 
                },
                new User 
                { 
                    Id = 3, 
                    Username = "author_minh", 
                    FullName = "Lê Quang Minh", 
                    Role = "Author" 
                }
            };

            // 2. Trả về View kèm theo danh sách người dùng
            return View(users);
        }
    }
}
Code CMS.Backend/Views/Post/Index.cshtml
@model IEnumerable<CMS.Data.Entities.User>

<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="text-dark">QUẢN LÝ THÀNH VIÊN</h2>
        <button class="btn btn-success btn-sm">+ Thêm thành viên mới</button>
    </div>

    <table class="table table-hover shadow-sm border">
        <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>Tên Đăng Nhập</th>
                <th>Họ Và Tên</th>
                <th>Quyền Hạn</th>
                <th>Thao Tác</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var user in Model)
            {
                <tr>
                    <td>@user.Id</td>
                    <td><strong>@user.Username</strong></td>
                    <td>@user.FullName</td>
                    <td>
                        @if (user.Role == "Administrator")
                        {
                            <span class="badge bg-danger">@user.Role</span>
                        }
                        else
                        {
                            <span class="badge bg-info text-dark">@user.Role</span>
                        }
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-warning">Sửa</button>
                        <button class="btn btn-sm btn-outline-danger">Xóa</button>
                    </td>
                </tr>
            }
        </tbody>
    </table>
</div>

Code CMS.Backend/Views/Post/Details.cshtml
@model CMS.Data.Entities.Post

<div class="container mt-5">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/Post">Danh sách bài viết</a></li>
            <li class="breadcrumb-item active">Chi tiết bài viết</li>
        </ol>
    </nav>

    <div class="row justify-content-center">
        <div class="col-md-10">
            <h1 class="display-4 fw-bold text-primary">@Model.Title</h1>
            <p class="text-muted">Đăng ngày: @Model.CreatedDate.ToString("dd/MM/yyyy HH:mm")</p>
            <hr />
            
            <div class="text-center mb-4">
                <img src="@Model.ImageUrl" class="img-fluid rounded shadow" alt="Post Image" style="width: 100%;">
            </div>

            <div class="post-content fs-5 leading-lg">
                @Model.Content
            </div>

            <div class="mt-5 border-top pt-3">
                <a href="/Post" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Quay lại danh sách
                </a>
            </div>
        </div>
    </div>
</div>





