zBUỔI 5: BẢO MẬT & PHÂN QUYỀN (SECURITY & IDENTITY)
Thời lượng: 5 tiết 
Mục tiêu bài học:
●	Hiểu và triển khai cơ chế Authentication (Xác thực người dùng).
●	Hiểu và triển khai cơ chế Authorization (Phân quyền quản trị).
●	Nắm vững kỹ thuật Mã hóa mật khẩu (Password Hashing) để bảo vệ dữ liệu thành viên.
________________________________________
1. KHÁI NIỆM TRỌNG TÂM: LOGIN FLOW
Trước khi viết code, chúng ta hiểu luồng hoạt động của một hệ thống có bảo mật:
1.	Người dùng nhập Username/Password.
2.	Hệ thống kiểm tra trong Database (Bảng Users).
3.	Nếu khớp, hệ thống cấp một "chiếc thẻ bài" (Cookie hoặc Token) để người dùng có thể truy cập vào trang Admin.
2. THỰC HÀNH
Phần A: Xây dựng trang đăng nhập (Login)
Mục tiêu:
●	Triển khai cơ chế xác thực người dùng (Authentication) bằng Cookie.
●	Thiết lập phân quyền (Authorization) theo vai trò: Admin và Editor.
●	Thực hiện chức năng Đăng nhập và Đăng xuất cho hệ thống ThaiCMS.
________________________________________
BƯỚC 1: CẤU HÌNH DỊCH VỤ XÁC THỰC (PROGRAM.CS)
Trước khi viết code chức năng, cần khai báo với hệ thống về việc sử dụng xác thực bằng Cookie.
Thao tác: Mở file Program.cs, tìm đoạn trước dòng var app = builder.Build(); và thêm đoạn mã sau:
C#
// 1. Khai báo dịch vụ xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
    });

Lưu ý: Trước dòng app.UseAuthorization(); (phía dưới), phải đảm bảo đã có dòng app.UseAuthentication();.
Nghĩa là 

app.UseAuthentication(); // BƯỚC A: Xác nhận "Anh là ai?" (Kiểm tra thẻ bài)
app.UseAuthorization();  // BƯỚC B: Xác nhận "Anh được làm gì?" (Kiểm tra quyền)


________________________________________
BƯỚC 2: TẠO ACCOUNTCONTROLLER
Controller này đóng vai trò điều hướng các thao tác liên quan đến tài khoản.
Thao tác: Chuột phải vào thư mục Controllers -> Add -> Controller -> MVC Controller - Empty -> Đặt tên AccountController.cs.
Mã nguồn ban đầu:
C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data; // Thay bằng Namespace của project Data

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }
}

________________________________________
BƯỚC 3: THIẾT KẾ GIAO DIỆN ĐĂNG NHẬP (LOGIN.CSHTML)
 
Thao tác: Chuột phải vào thư mục Views -> Tạo thư mục mới tên Account -> Tạo file Login.cshtml.
Mã nguồn giao diện:
Razor CSHTML
@{
    Layout = null; // Trang đăng nhập độc lập, không dùng Layout chung
}
<!DOCTYPE html>
<html>
<head>
    <title>Đăng nhập hệ thống</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card shadow border-0">
                    <div class="card-header bg-primary text-white text-center py-3">
                        <h5 class="mb-0">HỆ THỐNG QUẢN TRỊ CMS</h5>
                    </div>
                    <div class="card-body p-4">
                        <form asp-action="Login" method="post">
                            <div class="mb-3">
                                <label class="form-label">Tên đăng nhập</label>
                                <input type="text" name="username" class="form-control" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mật khẩu</label>
                                <input type="password" name="password" class="form-control" required />
                            </div>
                            @if (ViewBag.Error != null) {
                                <div class="alert alert-danger py-2">@ViewBag.Error</div>
                            }
                            <button type="submit" class="btn btn-primary w-100">ĐĂNG NHẬP</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

________________________________________
BƯỚC 4: XỬ LÝ LOGIC ĐĂNG NHẬP (POST METHOD)
Đây là bước kiểm tra thông tin người dùng và cấp quyền truy cập.
Thao tác: Thêm hàm sau vào AccountController.cs:
C#
[HttpPost]
public async Task<IActionResult> Login(string username, string password)
{
    // 1. Kiểm tra tài khoản trong Database
    var user = _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

    if (user != null)
    {
        // 2. Thiết lập danh tính (Claims)
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role), // Lưu vai trò: Admin/Editor
            new Claim("FullName", user.FullName)
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

        // 3. Đăng nhập và lưu Cookie vào trình duyệt
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, 
            new ClaimsPrincipal(claimsIdentity));

        return RedirectToAction("Index", "Home");
    }

    ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
    return View();
}

// Hàm đăng xuất
public async Task<IActionResult> Logout()
{
    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return RedirectToAction("Login");
}

________________________________________
BƯỚC 5: GIẢI THÍCH CÁC KHÁI NIỆM CƠ BẢN
Để hiểu rõ luồng bảo mật của ASP.NET Core, cần nắm vững 3 thành phần:
1.	Claim: Là một mẩu thông tin về người dùng (ví dụ: Tên, Email, Quyền hạn).
2.	Identity: Là "chứng minh nhân dân" chứa các mẩu thông tin (Claims) trên.
3.	Principal: Là "người sở hữu" chứng minh nhân dân đó. Khi truy cập trang web, hệ thống kiểm tra Principal để cho phép hoặc từ chối vào cửa.
________________________________________
BƯỚC 6: KIỂM CHỨNG KẾT QUẢ (CHECKPOINT)
1.	Đăng nhập thành công: Nhập đúng tài khoản trong bảng Users, hệ thống phải chuyển hướng vào trang quản trị.
2.	Kiểm tra Cookie: Nhấn F12 trên trình duyệt -> Chọn tab Application -> Cookies. Phải thấy xuất hiện dòng .AspNetCore.Cookies.
3.	Thử nghiệm Logout: Nhấn vào link Đăng xuất, hệ thống phải xóa Cookie và quay về trang Login.
Phần B: BẢO VỆ CÁC TRANG QUẢN TRỊ (AUTHORIZATION)
Mục tiêu bài học:
●	Sử dụng thuộc tính [Authorize] để khóa các khu vực nhạy cảm.
●	Thực hiện phân quyền chi tiết theo vai trò (Role-based Authorization).
●	Xử lý lỗi khi người dùng truy cập vào trang không có quyền (Access Denied).
________________________________________
BƯỚC 1: KHÓA TRANG ADMIN (AUTHENTICATION CHECK)
Sau khi đã có chức năng đăng nhập ở Tiết 1 & 2, chúng ta cần chặn tất cả những người chưa đăng nhập không được vào xem dữ liệu.
Thao tác: Mở các Controller sau và thêm thuộc tính [Authorize] lên ngay phía trên tên Class:
●	CategoryController.cs
●	PostController.cs
●	UserController.cs
Mã nguồn ví dụ:
C#
using Microsoft.AspNetCore.Authorization; // Cần thêm namespace này

[Authorize] // Bắt buộc phải đăng nhập mới được vào các hàm bên dưới
public class PostController : Controller
{
    // ... các code hiện tại ...
}

Giải thích: Khi có thuộc tính này, nếu một người dùng cố tình gõ trực tiếp URL /Post/Create mà chưa đăng nhập, hệ thống sẽ tự động "đá" họ về trang /Account/Login như đã cấu hình trong Program.cs.
________________________________________
BƯỚC 2: PHÂN QUYỀN THEO VAI TRÒ (ROLE-BASED)
Trong hệ thống CMS, không phải ai cũng có quyền quản lý thành viên (User). Chúng ta sẽ chỉ cho phép người có Role là "Admin" mới được vào UserController.
Thao tác: Mở file UserController.cs và cập nhật thuộc tính [Authorize] như sau:
C#
[Authorize(Roles = "Admin")] // Chỉ tài khoản có Role là Admin mới được phép vào
public class UserController : Controller
{
    // ... các code hiện tại ...
}

Giải thích: Nếu một người đăng nhập bằng tài khoản có Role là "Editor", họ vẫn xem được Bài viết nhưng khi bấm vào Quản lý thành viên, hệ thống sẽ chặn lại vì không đúng quyền hạn.
________________________________________
BƯỚC 3: HIỂN THỊ THÔNG TIN NGƯỜI DÙNG TRÊN LAYOUT
Để giao diện chuyên nghiệp, chúng ta sẽ hiển thị tên người đang đăng nhập và nút Đăng xuất trên thanh điều hướng.
 
Thao tác: Mở file _LayoutAdmin.cshtml, tìm vị trí Header hoặc Sidebar và thêm đoạn mã sau:
Razor CSHTML
<ul class="navbar-nav ms-auto">
    @if (User.Identity.IsAuthenticated)
    {
        <li class="nav-item">
            <span class="nav-link text-dark">
                Chào, <strong>@User.FindFirst("FullName")?.Value</strong> (@User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value)
            </span>
        </li>
        <li class="nav-item">
            <a class="btn btn-outline-danger btn-sm" asp-controller="Account" asp-action="Logout">Đăng xuất</a>
        </li>
    }
</ul>

________________________________________
BƯỚC 4: XỬ LÝ TRANG TỪ CHỐI TRUY CẬP (ACCESS DENIED)
Khi một Editor cố tình vào trang của Admin, chúng ta cần hiển thị một thông báo lịch sự thay vì để trình duyệt báo lỗi hệ thống.
 
Thao tác: Thêm hàm sau vào AccountController.cs:
C#
[HttpGet]
public IActionResult AccessDenied()
{
    return View();
}

Tạo View AccessDenied.cshtml trong thư mục Views/Account:
Razor CSHTML
@{
    Layout = "_LayoutAdmin";
}
<div class="container mt-5 text-center">
    <h1 class="text-danger">403 - KHÔNG CÓ QUYỀN TRUY CẬP</h1>
    <p>Bạn không có đủ quyền hạn để xem trang này. Vui lòng liên hệ quản trị viên.</p>
    <a href="/" class="btn btn-primary">Quay lại trang chủ</a>
</div>

________________________________________
BƯỚC 5: KIỂM CHỨNG KẾT QUẢ (CHECKPOINT)
1.	Chưa đăng nhập: Mở trình duyệt ẩn danh, gõ /Category. Hệ thống phải chuyển về trang Login.
2.	Đăng nhập quyền Editor: Vào mục Quản lý bài viết (OK), vào mục Quản lý thành viên -> Hệ thống phải chuyển về trang Access Denied.
3.	Đăng nhập quyền Admin: Phải vào được tất cả các trang mà không bị chặn.
Lưu ý:
Trong bài tập này, chúng ta lưu mật khẩu hiện (Plain Text) để dễ học và dễ sửa lỗi. Khi đi làm thực tế, các em sẽ cần thêm một bước mã hóa để bảo mật hơn, bước đó chúng ta sẽ tìm hiểu sau khi đã thành thạo luồng này 
 
