BUỔI 2: Kết nối Cơ sở dữ liệu với Entity Framework Core (EF Core).
KẾT NỐI DATABASE VÀ QUẢN TRỊ DỮ LIỆU THẬT
XÂY DỰNG CƠ SỞ DỮ LIỆU THẬT VỚI ENTITY FRAMEWORK CORE
🎯 Mục tiêu bài học
Sau buổi này,  sẽ:
●	Cài đặt thành công các thư viện EF Core cần thiết.
●	Hiểu và thực hiện được kỹ thuật Code First Migration (Từ code C# sinh ra bảng SQL).
●	Kết nối thành công Project Backend với SQL Server.
●	Thay thế toàn bộ dữ liệu giả ở Buổi 1 bằng dữ liệu thật từ Database.
Nghĩa là:
Sau buổi này, sẽ:
●	Biến các lớp C# (Category, Post, User) thành các bảng trong SQL Server.
●	Biết cách dùng lệnh Migration để quản lý lịch sử thay đổi của Database.
●	Thay thế toàn bộ "dữ liệu giả" của Buổi 1 bằng "dữ liệu thật" từ máy chủ.
________________________________________
🏗️ PHẦN 1: CÀI ĐẶT THƯ VIỆN (NUGET PACKAGES)
cần cài đặt 3 "vũ khí" quan trọng vào Project CMS.Data:
1.	Microsoft.EntityFrameworkCore.SqlServer: Để làm việc với SQL Server.
2.	Microsoft.EntityFrameworkCore.Tools: Để chạy các lệnh tạo bảng (Migration).
3.	Microsoft.EntityFrameworkCore.Design: Hỗ trợ thiết kế DB.
Cụ thể là: CÀI ĐẶT "CÔNG CỤ XÂY DỰNG" (NUGET PACKAGES)
Để C# có thể nói chuyện được với SQL Server, ta cần cài đặt 3 thư viện hỗ trợ.
1.	Tại Visual Studio, vào menu Tools -> NuGet Package Manager -> Manage NuGet Packages for Solution...
2.	Chọn tab Browse và tìm kiếm/cài đặt 3 gói sau vào CẢ 2 Project (CMS.Data và CMS.Backend):
○	Microsoft.EntityFrameworkCore.SqlServer (Kết nối SQL Server).
○	Microsoft.EntityFrameworkCore.Tools (Cung cấp lệnh tạo bảng).
○	Microsoft.EntityFrameworkCore.Design (Hỗ trợ thiết kế DB).
Ghi chú: chọn đúng version tương ứng với version .NET
________________________________________
🗃️ PHẦN 2: TẠO LỚP QUẢN TRỊ KẾT NỐI (APPLICATIONDBCONTEXT)
Đây là "trạm điều khiển" trung tâm để kết nối các Entity (Category, Post, User) với SQL.
Lớp này đóng vai trò như một "người quản kho", giúp chúng ta truy xuất dữ liệu từ các bảng.
1.	Trong Project CMS.Data, tạo một file mới tên là ApplicationDbContext.cs.
2.	Chép nội dung sau (Giải thích: DbSet tương ứng với một bảng trong SQL):
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;

namespace CMS.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) { }

        // Khai báo các bảng dữ liệu
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CategoryProduct> CategoriesProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }

    }
}



________________________________________
⚡ PHẦN 3: KỸ THUẬT CODE FIRST MIGRATION
Đây là phần "thần kỳ" nhất mà rất thích: Biến Class C# thành Bảng SQL Server.
1.	Cấu hình chuỗi kết nối (Connection String): Viết vào file appsettings.json trong Project CMS.Backend.
Cụ thể là: Chúng ta cần chỉ cho trang web biết máy chủ SQL Server đang nằm ở đâu.
-	Mở file appsettings.json trong Project CMS.Backend.
-	Thêm đoạn mã sau (Thay YourServerName bằng tên máy của bạn, thường là . hoặc (localdb)\mssqllocaldb):
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ThaiCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  ...
}
Trường hợp đặc biệt: Dành cho SQL Express (Bản nhẹ đi kèm Visual Studio)
Nhiều không cài bản đầy đủ mà dùng bản rút gọn đi kèm khi cài đặt Visual Studio.
●	Đặc điểm: Tên Server có đuôi \SQLEXPRESS hoặc (localdb).
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ThaiCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
Giải thích: (localdb)\\mssqllocaldb là máy chủ ảo siêu nhẹ tích hợp sẵn, rất phù hợp cho các bài tập nhỏ.

2.	Đăng ký Service: Trong file Program.cs, khai báo cho hệ thống biết cách dùng ApplicationDbContext.
Đây là bước "cắm điện" để hệ thống bắt đầu nhận diện kết nối Database.
-	Mở file Program.cs trong Project CMS.Backend.
-	Thêm 2 dòng này vào đầu file 
using Microsoft.EntityFrameworkCore;
using CMS.Data;
-	Thêm đoạn code sau vào trước dòng var app = builder.Build();
// Đăng ký DbContext vào hệ thống
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

3.	Chạy lệnh tại Package Manager Console: Đây là giây phút quan trọng nhất. Chúng ta sẽ dùng lệnh để SQL Server tự đẻ ra các bảng.
○	Add-Migration InitialCreate: Lập bản vẽ cho Database.
○	Update-Database: Chính thức xây dựng Database trong SQL Server.
Cụ thể là:
1.	Vào menu Tools -> NuGet Package Manager -> Package Manager Console.
2.	Tại ô Default project, chọn CMS.Data.
3.	Gõ lệnh sau và nhấn Enter: Add-Migration InitialCreate (Để lập bản vẽ thiết kế). 
4.	Tiếp tục gõ lệnh: Update-Database (Để chính thức xây nhà - tạo Database).
________________________________________
🚀 PHẦN 4: THAY THẾ DỮ LIỆU GIẢ BẰNG DỮ LIỆU THẬT
quay lại các Controller đã làm ở Buổi 1 và sửa code:
Bây giờ, ta không dùng List giả nữa mà gọi trực tiếp từ Database.
Sửa file CategoryController.cs:
public class CategoryController : Controller {
    private readonly ApplicationDbContext _context;

    // "Tiêm" kết nối vào Controller
    public CategoryController(ApplicationDbContext context) {
        _context = context;
    }

    public IActionResult Index() {
        // Lấy dữ liệu THẬT từ bảng Categories trong SQL
        var data = _context.Categories.ToList(); 
        return View(data);
    }
}

________________________________________
🏁 KẾT QUẢ CẦN ĐẠT (CHECKPOINT)
1.	Mở phần mềm SQL Server Management Studio (SSMS).
2.	Kiểm tra thấy Database ThaiCMS_DB đã xuất hiện.
3.	Chuột phải vào bảng Categories -> Edit Top 200 Rows -> Nhập tay vài dòng (Ví dụ: Tin Công Nghệ, Tin Giáo Dục, Tin Thời sự).
 

4.	Chạy trang web, vào /Category. Nếu dữ liệu bạn vừa nhập hiện lên màn hình →  Bạn đã thành công 100%!
	 


________________________________________
💡 CÁC ĐIỂM CẦN LƯU Ý (TIPS)
●	Kiểm tra SQL Server: Nhắc đảm bảo SQL Server Management Studio (SSMS) đã hoạt động trước khi chạy lệnh Update-Database.
HƯỚNG DẪN KIỂM TRA SQL SERVER TRƯỚC KHI CHẠY MIGRATION
Bước 1: Kiểm tra Dịch vụ (Service) đang chạy
Nhiều trường hợp phần mềm SSMS mở được nhưng "máy chủ ngầm" (Service) bên dưới chưa chạy, dẫn đến lỗi kết nối.
1.	Nhấn phím Windows + R, gõ services.msc và nhấn Enter.
2.	Tìm dòng có tên SQL Server (MSSQLSERVER) hoặc SQL Server (SQLEXPRESS).
3.	Trạng thái (Status): Phải là Running.
○	Nếu trắng trơn: Chuột phải vào nó và chọn Start.
________________________________________
Bước 2: Đăng nhập thử bằng SSMS
Đây là bước xác nhận tên Server (Server Name) chính xác nhất để điền vào chuỗi kết nối.
1.	Mở phần mềm SQL Server Management Studio (SSMS).
2.	Tại bảng hiện ra (Connect to Server):
○	Server type: Database Engine.
○	Server name: Thường là dấu chấm . hoặc (localdb)\mssqllocaldb.
○	Authentication: Windows Authentication.
3.	Nhấn nút Connect.
4.	Kết quả: Nếu bạn nhìn thấy danh sách thư mục (Databases, Security...) ở bên trái là OK.
 
________________________________________
Bước 3: Kiểm tra quyền tạo Database
Để lệnh Update-Database chạy được, tài khoản Windows  phải có quyền tạo file.
●	Trong SSMS, nhấn nút New Query trên thanh công cụ.
Gõ dòng lệnh sau và nhấn F5:

SELECT name FROM sys.databases
●	Nếu hiện ra danh sách các Database mặc định (master, tempdb...), nghĩa là kết nối đã thông suốt và sẵn sàng để EF Core "đẻ" thêm Database mới.

●	Lỗi chuỗi kết nối:  thường sai ở tên Server (Ví dụ: . hoặc (localdb)\mssqllocaldb). Bạn nên chuẩn bị sẵn 1-2 mẫu chuỗi kết nối chuẩn cho chúng ta.
●	Giải thích về Dependency Injection (DI): Đây là khái niệm khó của Chương 2. Bạn chỉ cần giải thích đơn giản: "Hệ thống tự động rót kết nối Database vào Controller cho chúng ta dùng, không cần khởi tạo thủ công".
________________________________________
✅ KẾT QUẢ CẦN ĐẠT CUỐI BUỔI 2
1.	 mở SQL Server thấy xuất hiện Database tên là ThaiCMS_DB.
 
2.	Trong DB có đủ 8 bảng: Categories, CategoriesProducts, Customers, OrderDetails, Orders, Posts, Products,  Users.
3.	Tự tay nhập 1-2 dòng dữ liệu vào SQL, sau đó chạy trang Web và thấy dữ liệu đó hiện lên màn hình.
📝 PHẦN BÀI TẬP RÈN LUYỆN: TỰ LÀM CHỦ DỮ LIỆU VỚI POST VÀ USER
Yêu cầu: Sau khi đã hoàn thành kết nối bảng Category, hãy thực hiện tương tự cho hai thực thể còn lại là bài viết (Post) và người dùng (User).
________________________________________
🏗️ BÀI TẬP 1: QUẢN LÝ BÀI VIẾT (TABLE POST)
Bước 1: Kiểm tra thực thể (Entity)
Đảm bảo trong Project CMS.Data, file Post.cs đã được định nghĩa đầy đủ các trường (Title, Content, CreatedDate, CategoryId...).
Bước 2: Nạp dữ liệu mẫu
1.	Mở SSMS, chuột phải vào bảng Posts -> Edit Top 200 Rows.
2.	Nhập ít nhất 5 bài viết mẫu (Lưu ý: Cột CategoryId phải điền số ID đã có sẵn trong bảng Categories).
 
Bước 3: Tạo Controller và hiển thị dữ liệu
1.	Tạo file PostController.cs trong Project CMS.Backend.
2.	Thực hiện "Tiêm" ApplicationDbContext vào Controller (Constructor Injection).
Viết Action Index() để lấy danh sách bài viết từ Database:

public IActionResult Index() {
    var posts = _context.Posts.ToList(); // Lấy tất cả bài viết
    return View(posts);
}
3.	Tạo View Index.cshtml để hiển thị danh sách dưới dạng bảng (Table) hoặc danh sách thẻ (Card).
 
________________________________________
👤 BÀI TẬP 2: QUẢN LÝ NGƯỜI DÙNG (TABLE USER)
Bước 1: Nạp dữ liệu mẫu
1.	Trong SSMS, nhập ít nhất 2 người dùng mẫu vào bảng Users.
2.	Ví dụ:
 
Bước 2: Tạo chức năng xem danh sách thành viên
1.	Tạo UserController.cs.
2.	Viết Action Index() để lấy danh sách Users.
3.	Tạo View hiển thị thông tin thành viên (Lưu ý: Không nên hiển thị mật khẩu trên giao diện).
 

Bảng dữ liệu mẫu cho  tự nhập vào database

Table Category

Name	Description
Tin tức Công nghệ	Cập nhật xu hướng AI, IoT và lập trình.
Đời sống du lịch	Kinh nghiệm phượt và các điểm đến hấp dẫn.
Sức khỏe Thể thao	Các bài tập và chế độ ăn uống lành mạnh.
Giáo dục Kỹ năng	Phương pháp học tập và kỹ năng mềm .
Góc lập trình viên	Tài liệu ASP.NET Core và SQL Server.

Table Post

Title	Content	ImageUrl	CategoryId	CreatedDate
Lộ trình học ASP.NET	Hướng dẫn chi tiết cho người mới bắt đầu...	/img/dotnet.jpg	5	2026-04-01
Top 5 bãi biển đẹp	Những địa điểm không thể bỏ qua mùa hè này...	/img/beach.jpg	2	2026-04-02
Chạy bộ đúng cách	Lợi ích tuyệt vời của việc chạy bộ mỗi sáng...	/img/run.jpg	3	2026-04-03
AI và tương lai	Trí tuệ nhân tạo đang thay đổi cuộc sống...	/img/ai.jpg	1	2026-04-04
Kỹ năng Teamwork	Cách phối hợp hiệu quả trong nhóm đồ án...	/img/team.jpg	4	2026-04-05


Table User

Username	PasswordHash	FullName	Role
admin	123456	Quản trị viên hệ thống	Admin
thai_gv	thai1969	Nguyễn Cao Thái	Editor
sv_01	student1	Nguyễn Văn A	User
sv_02	student2	Trần Thị B	User
moderator	mod789	Lê Văn C	Moderator

👤 BÀI TẬP 3:  Liệt kê danh sách  (TABLE CategoriesProducts)


👤 BÀI TẬP 4:  Liệt kê danh sách  (TABLE Products)

👤 BÀI TẬP 5:  Liệt kê danh sách  (TABLE Customers)

👤 BÀI TẬP 6:  Liệt kê danh sách  (TABLE Orders)

👤 BÀI TẬP 7:  Liệt kê danh sách  (TABLE OrderDetails)


 
