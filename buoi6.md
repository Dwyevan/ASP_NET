BUỔI 6: WEB API & RESTFUL SERVICE
Mục tiêu bài học:
●	Hiểu kiến trúc Client - Server và vai trò của Web API.
●	Làm quen với định dạng dữ liệu JSON.
●	Triển khai các chuẩn RESTful: GET, POST, PUT, DELETE.
●	Tạo "cửa ngõ" dữ liệu để Buổi 7 kết nối với giao diện ReactJS.
________________________________________
1. KHÁI NIỆM TRỌNG TÂM: API LÀ GÌ?
Trong các buổi trước, chúng ta dùng MVC (Model-View-Controller) để trả về các trang web (HTML). Tuy nhiên, để làm việc với các ứng dụng hiện đại như ReactJS, Mobile App, Backend không trả về giao diện mà chỉ trả về Dữ liệu thô (JSON).
●	API (Application Programming Interface): Là cầu nối cho phép hai ứng dụng "nói chuyện" với nhau.
●	JSON (JavaScript Object Notation): Là ngôn ngữ chung để truyền tải dữ liệu, có cấu trúc dạng { "key": "value" }.
1. Sự khác biệt giữa Web truyền thống (MVC) và Web hiện đại (API + Frontend)
Cách làm cũ (ASP.NET Core MVC):
●	Cơ chế: Khi người dùng yêu cầu một trang web, Server sẽ thực hiện: Lấy dữ liệu -> Gắn dữ liệu vào file HTML (View) -> Trả về nguyên một trang web hoàn chỉnh.
●	Nhược điểm: Server vừa phải lo dữ liệu, vừa phải lo giao diện. Nếu muốn làm thêm ứng dụng Mobile, bạn phải viết lại toàn bộ từ đầu vì Mobile không đọc được file HTML của Web.
Cách làm hiện đại (Web API):
●	Cơ chế: Server chỉ tập trung làm đúng một việc: Cung cấp dữ liệu thô.
●	Giao diện: ReactJS (Web), Flutter (Mobile) hay Swift (iOS) sẽ tự xây dựng giao diện riêng của mình. Khi cần dữ liệu, chúng "gõ cửa" Server để lấy.
●	Ưu điểm: Một Backend (API) có thể phục vụ cùng lúc cho nhiều nền tảng (Web, App, IoT...).
________________________________________
2. JSON là gì? (Ngôn ngữ chung của thế giới số)
Nếu coi API là một người giao hàng, thì JSON chính là cách đóng gói kiện hàng đó. Trước đây người ta dùng XML (rất rườm rà), nay JSON chiếm ưu thế vì nó cực kỳ nhẹ và dễ đọc.
Cấu trúc đặc trưng:
●	Dữ liệu luôn đi theo cặp Key (Tên trường) và Value (Giá trị).
●	Ví dụ một bài viết khi trả về từ API sẽ trông như thế này:
JSON
{
  "id": 101,
  "title": "Học lập trình Web Buổi 6",
  "author": "Thái GV",
  "isPublished": true,
  "tags": ["API", "Backend", "JSON"]
}

●	Tại sao sinh viên cần biết cái này? Vì khi làm việc với ReactJS, các em sẽ phải viết code để "bóc tách" từng cái key này (như post.title, post.author) để hiển thị lên màn hình.
________________________________________
3. API - "Thực đơn" của Server dành cho Client
Để sinh viên dễ hiểu về API (Application Programming Interface), hãy dùng hình ảnh ẩn dụ về Nhà hàng:
1.	Khách hàng (Frontend/ReactJS): Ngồi ở bàn và muốn ăn món "Danh sách bài viết".
2.	Thực đơn (API Documentation): Liệt kê các món mà nhà hàng có thể phục vụ (Ví dụ: GET /api/posts).
3.	Người bồi bàn (API): Tiếp nhận yêu cầu từ khách, chuyển xuống bếp, và mang món ăn (Dữ liệu JSON) lên cho khách. Khách muốn ăn bằng bát sứ hay đĩa nhựa (Giao diện React hay Mobile) là quyền của khách, bồi bàn không can thiệp.
________________________________________
4. Tại sao Backend chỉ trả về dữ liệu thô?
●	Tiết kiệm băng thông: Thay vì gửi cả một trang HTML nặng 1MB (có cả CSS, JS, giao diện), Server chỉ gửi 1 đoạn chữ JSON nặng 1KB. Website sẽ load cực nhanh.
●	Phân tách trách nhiệm (Decoupling): Đội làm Backend chỉ cần giỏi SQL, C#. Đội làm Frontend chỉ cần giỏi ReactJS, CSS. Hai đội không cần can thiệp vào code của nhau, chỉ cần thống nhất với nhau qua cái "thực đơn" API.

________________________________________
2. NỘI DUNG THỰC HÀNH

________________________________________
Phần 1: KHỞI TẠO API CONTROLLER 
Mục tiêu: Tạo ra một Controller không có giao diện, chỉ làm nhiệm vụ nhận yêu cầu và trả về dữ liệu JSON cho Frontend (ReactJS).
________________________________________
BƯỚC 1: THAO TÁC TẠO FILE TRÊN VISUAL STUDIO
Sinh viên cần thực hiện chính xác trình tự chuột phải để Visual Studio tự động sinh ra các thư viện cần thiết cho API.
1.	Tại cửa sổ Solution Explorer, tìm đến thư mục Controllers.
2.	Chuột phải vào thư mục Controllers -> Chọn Add -> Chọn Controller...
3.	Một bảng hiện ra, hãy nhìn menu bên trái và chọn mục API.
4.	Tại cột giữa, chọn API Controller - Empty.
○	Lưu ý quan trọng: Tuyệt đối không chọn "MVC Controller" vì nó sẽ chứa các hàm trả về View (giao diện), không phù hợp để làm API.
5.	Nhấn nút Add.
6.	Tại ô Controller name, đặt tên là: PostsController.cs (có chữ s số nhiều để phân biệt với bài viết đơn lẻ). Nhấn Add để hoàn tất.
________________________________________
BƯỚC 2: VIẾT MÃ NGUỒN CƠ BẢN
Mở file PostsController.cs vừa tạo và cập nhật nội dung code như sau. Hãy chú ý các dòng chú thích để hiểu ý nghĩa:
C#
using Microsoft.AspNetCore.Mvc;
using CMS.Data; // Thay bằng Namespace của project chứa ApplicationDbContext của bạn

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên "Posts"
    // Khi chạy, địa chỉ sẽ là: https://localhost:xxxx/api/posts
    [Route("api/[controller]")]
    
    // 2. Đánh dấu đây là một API Controller để hệ thống hỗ trợ các tính năng RESTful
    [ApiController]
    
    // 3. API Controller phải kế thừa từ ControllerBase (thay vì Controller như MVC)
    public class PostsController : ControllerBase
    {
        // 4. Khai báo biến kết nối Database
        private readonly ApplicationDbContext _context;

        // 5. Hàm khởi tạo (Constructor): "Tiêm" kết nối Database vào để sử dụng
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}

________________________________________
BƯỚC 3: GIẢI THÍCH CHI TIẾT CÁC THÀNH PHẦN
Để sinh viên không chỉ copy-code mà còn hiểu bài, cần giải thích 3 điểm khác biệt sau:
1.	[Route("api/[controller]")]: Trong MVC truyền thống, đường dẫn thường là /{Controller}/{Action}. Trong API, chúng ta luôn thêm tiền tố api/ phía trước để phân biệt rõ ràng: Đây là đường dẫn lấy dữ liệu, không phải đường dẫn xem trang web.
2.	[ApiController]: Thuộc tính này cực kỳ quyền năng. Nó tự động kiểm tra dữ liệu đầu vào (Validation), tự động trả về lỗi 400 nếu dữ liệu sai, giúp chúng ta bớt phải viết code kiểm tra thủ công.
3.	ControllerBase: Trong các buổi trước (MVC), chúng ta dùng Controller. Nhưng ở API, chúng ta dùng ControllerBase. Lý do là API không cần các tính năng hiển thị giao diện (View), sử dụng ControllerBase sẽ giúp ứng dụng nhẹ hơn và tối ưu hơn.
________________________________________
BƯỚC 4: KIỂM CHỨNG (CHECKPOINT)
Sau khi viết xong đoạn code trên, hãy yêu cầu sinh viên:
1.	Nhấn Build (Ctrl + Shift + B) để đảm bảo không có lỗi cú pháp.
2.	Giải thích câu hỏi: "Tại sao hiện tại truy cập vào đường dẫn api/posts vẫn chưa thấy gì?".
○	Đáp án: Vì chúng ta mới chỉ xây dựng "cái khung" (Class), chưa viết các "hành động" (Action) như lấy danh sách hay chi tiết bài viết. Các hành động này sẽ được thực hiện ở Tiết 2.

________________________________________

 
Phần 2: API LẤY DANH SÁCH BÀI VIẾT (GET METHOD)
Mục tiêu: Xây dựng các hàm để lấy dữ liệu bài viết từ Database và trả về dưới dạng JSON. Đây chính là "nguồn thức ăn" để giao diện ReactJS có thể hiển thị danh sách bài viết lên trang chủ.
________________________________________
BƯỚC 1: VIẾT HÀM LẤY TOÀN BỘ BÀI VIẾT
Chúng ta sẽ viết hàm GetAll để lấy các bài viết mới nhất. Hãy thêm đoạn code này vào bên trong Class PostsController.
Mã nguồn chi tiết:
C#
// 1. Chỉ định đây là phương thức GET (Dùng để lấy dữ liệu)
[HttpGet]
public IActionResult GetAll()
{
    // Lấy dữ liệu từ bảng Posts
    var posts = _context.Posts
        .OrderByDescending(p => p.Id) // Sắp xếp bài mới nhất lên đầu
        .Select(p => new {            // "Gọt tỉa" dữ liệu: chỉ lấy những trường cần thiết
            p.Id,
            p.Title,
            p.ImageUrl,
            p.CreatedAt,
            CategoryName = p.Category.Name // Lấy tên danh mục thay vì chỉ lấy ID
        })
        .ToList();

    // Trả về kết quả cho Frontend kèm mã trạng thái 200 (Thành công)
    return Ok(posts); 
}

Giải thích:
●	[HttpGet]: Khi ReactJS gọi đến địa chỉ api/posts bằng phương thức GET, hàm này sẽ tự động chạy.
●	.Select(...): Trong Database có rất nhiều thông tin (như Password người đăng, nội dung chi tiết rất dài...), nhưng trang danh sách chỉ cần Tiêu đề và Ảnh. Việc Select giúp gói tin JSON nhẹ hơn, giúp web load nhanh hơn.
●	return Ok(posts): Lệnh này sẽ tự động biến danh sách C# thành định dạng JSON.
________________________________________
BƯỚC 2: VIẾT HÀM LẤY BÀI VIẾT THEO DANH MỤC
Khi người dùng nhấn vào một danh mục (ví dụ: "Tin tức"), chúng ta chỉ muốn hiện các bài thuộc danh mục đó.
Mã nguồn chi tiết:
C#
// 2. Định nghĩa đường dẫn có tham số: api/posts/category/{id}
[HttpGet("category/{categoryId}")]
public IActionResult GetByCategory(int categoryId)
{
    // Lọc các bài viết có CategoryId trùng với ID truyền vào từ URL
    var posts = _context.Posts
        .Where(p => p.CategoryId == categoryId)
        .Select(p => new {
            p.Id,
            p.Title,
            p.ImageUrl,
            p.CreatedAt
        })
        .ToList();

    return Ok(posts);
}

Giải thích cho sinh viên:
●	{categoryId}: Đây là một biến động trên URL. Ví dụ nếu gõ api/posts/category/1, hệ thống sẽ hiểu categoryId = 1.
●	.Where(...): Đây là câu lệnh lọc dữ liệu (tương đương lệnh WHERE trong SQL).
________________________________________
BƯỚC 3: THAO TÁC KIỂM TRA (TESTING)
Vì chưa có giao diện ReactJS, chúng ta sẽ dùng trình duyệt hoặc Swagger để kiểm tra xem "bồi bàn" API có làm việc đúng không.
1.	Nhấn F5 để chạy dự án Backend.
2.	Nếu hiện ra trang Swagger, tìm đến mục GET /api/Posts, nhấn Try it out -> Execute.
3.	Quan sát kết quả (Response body): Bạn sẽ thấy dữ liệu hiện ra trong dấu ngoặc vuông [...], bên trong là các đối tượng nằm trong dấu {...}. Đó chính là JSON.
________________________________________
💡 LƯU Ý
Checkpoint: Nếu sinh viên thấy được danh sách bài viết hiện ra trong trình duyệt dưới dạng chữ thô (JSON), nghĩa là các em đã thành công 50% chặng đường của Buổi 6!


________________________________________

Phần 3: API CHI TIẾT BÀI VIẾT (GET BY ID)
Mục tiêu: Xây dựng hàm lấy đầy đủ thông tin của một bài viết cụ thể dựa trên ID. Đây là dữ liệu quan trọng để ReactJS hiển thị nội dung bài báo khi người dùng nhấn vào tiêu đề hoặc ảnh ở trang chủ.
________________________________________
BƯỚC 1: VIẾT HÀM LẤY CHI TIẾT BÀI VIẾT
Chúng ta sẽ sử dụng tham số ngay trên đường dẫn URL (ví dụ: api/posts/5) để xác định bài viết cần lấy.
Thao tác: Thêm đoạn mã này vào sau hàm GetByCategory trong file PostsController.cs.
C#
// 1. Định nghĩa đường dẫn nhận ID: api/posts/{id}
[HttpGet("{id}")]
public IActionResult GetDetail(int id)
{
    // 2. Tìm bài viết đầu tiên có Id khớp với tham số truyền vào
    var post = _context.Posts
        .FirstOrDefault(p => p.Id == id);

    // 3. Xử lý trường hợp không tìm thấy (ID không tồn tại)
    if (post == null) 
    {
        // Trả về lỗi 404 kèm thông báo dưới dạng JSON
        return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
    }

    // 4. Trả về bài viết tìm thấy kèm mã 200 (Thành công)
    return Ok(post);
}

________________________________________
BƯỚC 2: GIẢI THÍCH CHI TIẾT 

1.	Tham số {id}: Đây là placeholder. Khi chạy thực tế, {id} sẽ được thay bằng số cụ thể.
○	Ví dụ: Gọi api/posts/10 -> hệ thống tự gán id = 10.
2.	FirstOrDefault: Lệnh này sẽ quét trong bảng Posts. Nếu tìm thấy, nó trả về đối tượng bài viết; nếu không thấy, nó trả về null.
3.	Tại sao không dùng .Select() như Tiết 2?:
○	Ở trang danh sách (Tiết 2), chúng ta chỉ lấy một vài trường cho nhẹ.
○	Ở trang chi tiết này, chúng ta cần toàn bộ nội dung (bao gồm cả trường Content chứa mã HTML từ trình soạn thảo) nên chúng ta trả về nguyên đối tượng post.
4.	Thông báo lỗi NotFound: Trong API, thay vì chuyển hướng người dùng sang trang báo lỗi 404 rườm rà, chúng ta chỉ cần trả về mã lỗi 404 kèm một "gói tin" JSON nhỏ để Frontend tự quyết định cách hiển thị thông báo cho người dùng.
________________________________________
BƯỚC 3: THAO TÁC KIỂM TRA (CHECKPOINT)
Sinh viên thực hiện kiểm tra theo 2 kịch bản:
●	Kịch bản 1 (Thành công): 1. Chạy dự án.
●	2. Gõ lên trình duyệt: https://localhost:xxxx/api/posts/1 (Thay 1 bằng một ID đang có trong DB).
●	3. Kết quả: Phải hiện ra dữ liệu của duy nhất 1 bài viết đó.
●	Kịch bản 2 (Thất bại):
1.	Gõ lên trình duyệt một ID chắc chắn không có (ví dụ: 9999).
2.	Kết quả: Trình duyệt báo lỗi 404 hoặc hiện dòng chữ JSON: {"message": "Không tìm thấy bài viết này trong hệ thống"}.
________________________________________
💡 MẸO 
Lưu ý về thứ tự code: Dặn sinh viên các hàm có [HttpGet] phải đặt tên Route khác nhau hoặc có tham số khác nhau để tránh bị lỗi "AmbiguousMatchException" (Hệ thống không biết gọi hàm nào).
●	Kiểm tra dữ liệu: Nhắc sinh viên nếu bài viết có nội dung là HTML (từ CKEditor), dữ liệu trả về sẽ có các thẻ <p>, <strong>... Điều này là hoàn toàn chính xác vì ReactJS sẽ cần những thẻ này để hiển thị đúng định dạng.


________________________________________

Phần 4: KIỂM TRA API VỚI SWAGGER (TESTING API)
Mục tiêu: Vì Web API không có giao diện (HTML) để chúng ta nhấn nút như trang Web thông thường, chúng ta cần sử dụng Swagger – một công cụ được tích hợp sẵn trong .NET 8 để "nhìn" thấy các API và chạy thử chúng.
________________________________________
BƯỚC 1: KHỞI ĐỘNG CÔNG CỤ SWAGGER
Mặc định, khi chúng ta tạo dự án Web API trong .NET 8, Microsoft đã cài đặt sẵn thư viện Swashbuckle để tự động tạo trang tài liệu API.
Thao tác:
1.	Tại Visual Studio, nhấn phím F5 (hoặc nút Play màu xanh) để chạy dự án.
2.	Trình duyệt sẽ tự động mở ra. Nếu đường dẫn chưa đúng, bạn hãy thêm /swagger vào sau địa chỉ web (Ví dụ: https://localhost:7xxx/swagger/index.html).
3.	Bạn sẽ thấy danh sách các Controller hiện ra, trong đó có Posts.
________________________________________
BƯỚC 2: THAO TÁC CHẠY THỬ (TRY IT OUT)
Chúng ta sẽ thử nghiệm lấy danh sách bài viết để xem dữ liệu có trả về đúng không.
Thao tác:
1.	Nhấn vào dòng GET /api/Posts (Hàm lấy toàn bộ bài viết).
2.	Nhấn vào nút Try it out ở góc bên phải.
3.	Nhấn nút Execute (màu xanh to) để thực hiện lệnh.
________________________________________
BƯỚC 3: PHÂN TÍCH KẾT QUẢ TRẢ VỀ (RESPONSE)
Sau khi nhấn Execute, bạn cuộn xuống phần Responses, đây là nơi quan trọng nhất để sinh viên quan sát:
1.	Code (Mã trạng thái): Nếu hiện số 200, nghĩa là API hoạt động hoàn hảo.
2.	Response body (Dữ liệu): Đây là dữ liệu JSON thực tế từ Database.
○	Kiểm tra xem có đúng định dạng dấu ngoặc vuông [...] cho danh sách không.
○	Các trường dữ liệu (id, title, imageUrl...) có đúng như chúng ta đã lập trình không.
3.	Request URL: Đây là địa chỉ mà sau này chúng ta sẽ copy để dán vào code bên ReactJS.
________________________________________
BƯỚC 4: GIẢI THÍCH CHO SINH VIÊN
Giảng viên cần giải thích ý nghĩa của việc này đối với quy trình làm việc thực tế:
●	Tài liệu sống: Swagger không chỉ để test, nó còn là "bản cam kết" giữa người làm Backend và người làm Frontend. Nhìn vào đây, người làm ReactJS biết chính xác phải gọi địa chỉ nào và nhận về dữ liệu gì.
●	Không cần giao diện vẫn làm được Backend: Sinh viên có thể hoàn thiện toàn bộ tính năng thêm, xóa, sửa bài viết thông qua Swagger trước khi bắt tay vào làm giao diện ReactJS.
________________________________________
💡 MẸO "CẦM TAY CHỈ VIỆC" CHO SINH VIÊN
●	Lỗi không hiện Swagger: Nếu chạy F5 mà báo lỗi trang trắng, hãy nhắc sinh viên kiểm tra file Program.cs xem đã có dòng app.UseSwagger(); và app.UseSwaggerUI(); chưa (thường nằm trong khối if (app.Environment.IsDevelopment())).
●	Sử dụng Postman (Mở rộng): Nếu sinh viên muốn chuyên nghiệp hơn, giảng viên có thể hướng dẫn tải Postman. Thao tác tương tự: Dán URL vào -> Chọn phương thức GET -> Nhấn Send. Postman giúp lưu lại các lượt test cũ rất tiện lợi.
Checkpoint: Nếu sinh viên nhấn Execute và thấy danh sách bài viết hiện ra trong ô Response body, nghĩa là API của các em đã sẵn sàng để "xuất xưởng" cho phía Frontend sử dụng!


________________________________________

Phần 5: CẤU HÌNH CORS (BẬT ĐÈN XANH CHO REACTJS)
Mục tiêu: Cho phép ứng dụng Frontend (ReactJS) có thể truy cập và lấy dữ liệu từ Backend (Web API). Nếu không có bước này, trình duyệt sẽ chặn mọi dữ liệu vì lý do bảo mật, khiến website của chúng ta không thể hiển thị nội dung.
________________________________________
BƯỚC 1: TẠI SAO PHẢI CẤU HÌNH CORS?
Giải thích cho sinh viên:
●	CORS (Cross-Origin Resource Sharing): Là một cơ chế bảo mật của trình duyệt.
●	Tình huống: Web API của chúng ta đang chạy ở một "nhà" (ví dụ: localhost:7000), còn ReactJS chạy ở một "nhà" khác (localhost:3000).
●	Vấn đề: Theo mặc định, trình duyệt không cho phép "nhà này" sang "nhà kia" lấy đồ. Lỗi này thường hiện màu đỏ trong cửa sổ Inspect (F12) của trình duyệt với dòng chữ: "...blocked by CORS policy".
●	Giải pháp: Chúng ta phải cấu hình Backend để xác nhận rằng: "Tôi cho phép ReactJS được quyền lấy dữ liệu của tôi".
________________________________________
BƯỚC 2: THAO TÁC CẤU HÌNH TRONG FILE PROGRAM.CS
Sinh viên thực hiện theo 2 giai đoạn: Đăng ký dịch vụ và Kích hoạt dịch vụ.
Giai đoạn 1: Đăng ký chính sách (Policy)
Thao tác: Mở file Program.cs, tìm vị trí trước dòng var app = builder.Build(); và thêm đoạn mã sau:
C#
// 1. Khai báo chính sách CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        // Cho phép mọi nguồn (Origin), mọi phương thức (GET, POST...), mọi tiêu đề (Header)
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

Giai đoạn 2: Kích hoạt chính sách (Middleware)
Thao tác: Vẫn trong file Program.cs, tìm vị trí sau dòng app.UseRouting(); và thêm dòng này:
C#
// 2. Kích hoạt chính sách CORS đã khai báo ở trên
app.UseCors("AllowAll");

________________________________________
BƯỚC 3: GIẢI THÍCH CHI TIẾT CODE CHO SINH VIÊN
●	AllowAnyOrigin(): Chấp nhận yêu cầu từ bất kỳ địa chỉ nào (rất tiện khi đang học và thực hành).
●	AllowAnyMethod(): Chấp nhận tất cả các kiểu gọi như lấy dữ liệu (GET), thêm mới (POST), sửa (PUT), xóa (DELETE).
●	AllowAnyHeader(): Chấp nhận mọi thông tin đi kèm trong gói tin yêu cầu.
●	Tên chính sách "AllowAll": Đây là cái tên chúng ta tự đặt, bạn có thể đặt tên khác nhưng phải đảm bảo ở Bước 1 và Bước 2 phải viết giống hệt nhau.
________________________________________
BƯỚC 4: LƯU Ý QUAN TRỌNG (CẦM TAY CHỈ VIỆC)
1.	Vị trí đặt code: Nhắc sinh viên phải đặt app.UseCors("AllowAll"); nằm giữa app.UseRouting(); và app.UseAuthorization();. Nếu đặt sai thứ tự, CORS có thể không hoạt động.
2.	Môi trường thực tế: Giảng viên cần lưu ý sinh viên rằng cách cấu hình AllowAnyOrigin chỉ dùng để học tập. Khi đi làm thực tế, chúng ta chỉ nên điền đúng địa chỉ của trang web Frontend vào (ví dụ: .WithOrigins("https://mywebsite.com")) để đảm bảo an toàn, tránh bị hacker đánh cắp dữ liệu từ các trang web lạ.
________________________________________
BƯỚC 5: KIỂM CHỨNG (CHECKPOINT)
Sau khi lưu file và chạy lại dự án:
1.	Nhấn F5 chạy Backend.
2.	Sử dụng Swagger để test lại các API như ở Tiết 4.
3.	Nếu dữ liệu vẫn trả về bình thường và không có lỗi hệ thống, nghĩa là cấu hình CORS đã sẵn sàng để phục vụ cho buổi học kết nối ReactJS tiếp theo.
Ghi chú cho giáo trình: "Đây là bước cuối cùng của phần Backend. Sau khi hoàn thành Tiết 5, các em đã xây dựng xong một hệ thống Web API chuẩn chỉnh, sẵn sàng cung cấp dữ liệu cho bất kỳ ứng dụng Frontend nào trên thế giới!"


________________________________________
Ghi chú 1: GIẢI THÍCH CÁC TRẠNG THÁI HTTP (STATUS CODES)
Mục tiêu: Giúp sinh viên hiểu cách Server "trả lời" cho Client. Trong lập trình API, Server không chỉ trả về dữ liệu mà còn gửi kèm một con số (mã trạng thái) để báo cho Frontend biết việc lấy dữ liệu đó thành công hay thất bại.
________________________________________
1. TẠI SAO PHẢI CÓ HTTP STATUS CODE?
Giải thích cho sinh viên:
Hãy tưởng tượng việc gọi API giống như việc bạn gửi tin nhắn cho một cửa hàng:
●	Nếu họ trả lời: "Đã nhận đơn", đó là Thành công.
●	Nếu họ trả lời: "Món này hết rồi", đó là Lỗi phía người mua chọn sai.
●	Nếu họ không trả lời vì máy điện thoại bị hỏng, đó là Lỗi phía cửa hàng.
Trong lập trình, Frontend (ReactJS) dựa vào các con số này để hiển thị thông báo phù hợp cho người dùng (ví dụ: hiện dấu tích xanh khi lưu thành công, hoặc hiện thông báo "Vui lòng kiểm tra lại dữ liệu").
________________________________________
2. CÁC NHÓM MÃ TRẠNG THÁI PHỔ BIẾN
Giảng viên hướng dẫn sinh viên nhớ theo "đầu số" để dễ phân loại:
Nhóm 2xx: Thành công (Success)
●	200 OK: Mọi thứ đều ổn. Server đã tìm thấy dữ liệu và gửi về cho bạn. (Dùng cho lệnh lấy danh sách, chi tiết bài viết).
●	201 Created: Yêu cầu đã thành công và một dữ liệu mới đã được tạo ra. (Thường dùng sau khi gọi lệnh Thêm mới bài viết thành công).
Nhóm 4xx: Lỗi phía Client (Client Error)
Đây là lỗi do người gửi yêu cầu làm sai (như sai đường dẫn, thiếu dữ liệu).
●	400 Bad Request: Server không hiểu yêu cầu hoặc dữ liệu gửi lên bị sai định dạng (ví dụ: yêu cầu nhập số nhưng gửi vào chữ).
●	401 Unauthorized: Bạn chưa đăng nhập nên không có quyền lấy dữ liệu này.
●	404 Not Found: Đường dẫn (URL) sai hoặc ID bài viết không tồn tại trong hệ thống.
Nhóm 5xx: Lỗi phía Server (Server Error)
Đây là lỗi do code Backend của chúng ta bị "sập".
●	500 Internal Server Error: Một lỗi không mong muốn xảy ra trên Server (ví dụ: quên kết nối Database, code bị chia cho số 0, hoặc null reference...).
________________________________________
3. CÁCH KIỂM TRA MÃ TRẠNG THÁI TRÊN TRÌNH DUYỆT
Sinh viên cần biết cách "soi" các con số này khi làm việc thực tế:
1.	Nhấn F12 trên trình duyệt (Chrome/Edge).
2.	Chọn tab Network (Mạng).
3.	Nhấn nút chạy API (hoặc F5 lại trang).
4.	Nhìn vào cột Status. Các dòng màu đỏ thường là lỗi (4xx, 5xx), các dòng màu đen/xanh là thành công (2xx).
________________________________________
4. VÍ DỤ MINH HỌA TRONG CODE (CẦM TAY CHỈ VIỆC)
Giảng viên chỉ cho sinh viên thấy các mã này xuất hiện ở đâu trong code C# của các buổi học trước:
C#
[HttpGet("{id}")]
public IActionResult GetDetail(int id)
{
    var post = _context.Posts.Find(id);

    if (post == null) 
    {
        // Trả về mã 404
        return NotFound(); 
    }

    // Trả về mã 200 kèm dữ liệu
    return Ok(post); 
}

________________________________________
💡 LƯU Ý KHI GIẢNG DẠY
●	Mẹo ghi nhớ: "2xx là OK, 4xx là do Bạn (Client), 5xx là do Tôi (Server)".
●	Tầm quan trọng: Nhấn mạnh rằng nếu Backend trả về dữ liệu nhưng lại gửi sai mã Status (ví dụ: lỗi mà vẫn gửi mã 200), thì ứng dụng Frontend sẽ bị "loạn" và không biết phải báo lỗi như thế nào cho người dùng.
Checkpoint: Yêu cầu sinh viên thử gõ một địa chỉ API sai (ví dụ: api/postsssss) và quan sát mã 404 hiện ra trong tab Network. Nếu sinh viên thấy và hiểu được con số đó, các em đã nắm vững kiến thức này.

________________________________________
Ghi chú 2: CHECKPOINT KẾT THÚC BUỔI 6 (KIỂM TRA CUỐI GIỜ)
Mục tiêu: Đây là bước quan trọng nhất để sinh viên tự đánh giá xem hệ thống Backend API đã hoạt động đúng yêu cầu hay chưa trước khi ra về. Nếu bước này không chạy, các em sẽ không thể thực hành được Buổi 7 (ReactJS).
________________________________________
BƯỚC 1: KIỂM TRA DANH SÁCH TOÀN BỘ BÀI VIẾT
Thao tác:
1.	Tại Visual Studio, nhấn F5 để chạy ứng dụng.
2.	Mở trình duyệt Web (Chrome, Edge...), nhập địa chỉ sau vào thanh URL:
3.	https://localhost:xxxx/api/posts
4.	(Lưu ý: xxxx là số cổng Port mà Visual Studio tự cấp cho máy của các em).
Kết quả mong đợi:
●	Trình duyệt hiển thị một chuỗi văn bản dạng JSON bắt đầu bằng dấu ngoặc vuông [ và kết thúc bằng ].
●	Bên trong có các thông tin như: id, title, imageUrl, categoryName.
________________________________________
BƯỚC 2: KIỂM TRA CHI TIẾT MỘT BÀI VIẾT
Thao tác:
1.	Nhìn vào danh sách JSON vừa lấy được ở Bước 1, chọn một id bất kỳ (ví dụ: số 1 hoặc số 5).
2.	Sửa địa chỉ trên thanh URL thành:
3.	https://localhost:xxxx/api/posts/1 (Thay 1 bằng ID bạn đã chọn).
Kết quả mong đợi:
●	Dữ liệu trả về chỉ gồm duy nhất một đối tượng nằm trong dấu ngoặc nhọn { }.
●	Phải xuất hiện thêm trường content (Nội dung chi tiết bài viết) mà ở Bước 1 không có.
________________________________________
BƯỚC 3: KIỂM TRA TRƯỜNG HỢP LỖI (404 NOT FOUND)
Thao tác:
1.	Nhập một ID bài viết chắc chắn không tồn tại vào URL, ví dụ:
2.	https://localhost:xxxx/api/posts/999999
Kết quả mong đợi:
●	Trình duyệt hiển thị thông báo lỗi hoặc chuỗi JSON: {"message": "Không tìm thấy bài viết này trong hệ thống"}.
●	Nhấn F12, chọn tab Network, cột Status phải hiện màu đỏ với mã 404.
________________________________________
💡 HƯỚNG DẪN XỬ LÝ LỖI NHANH (TROUBLESHOOTING)
Giảng viên yêu cầu sinh viên tự kiểm tra nếu gặp các trường hợp sau:
1.	Lỗi trang trắng / Không tìm thấy trang: Kiểm tra xem đã gõ đúng chữ api/posts chưa (thiếu chữ api là lỗi phổ biến nhất).
2.	Lỗi 500 (Internal Server Error): Thường do Database chưa có dữ liệu hoặc chuỗi kết nối (Connection String) bị sai. Hãy mở SQL Server ra kiểm tra lại bảng Posts.
3.	Dữ liệu hiện ra bị dính chùm, khó đọc: Hướng dẫn sinh viên cài thêm tiện ích mở rộng (Extension) tên là JSON Viewer trên Chrome để dữ liệu JSON được xuống dòng và tô màu đẹp mắt, dễ quan sát.
________________________________________
🎯 YÊU CẦU HOÀN THÀNH:
Sinh viên chỉ được coi là hoàn thành buổi học khi chụp màn hình được kết quả JSON của cả 2 đường dẫn (Danh sách và Chi tiết) và dán vào báo cáo thực hành.

Tóm lại: "Dữ liệu JSON các em thấy hôm nay chính là 'nguyên liệu thô'. Buổi sau, chúng ta sẽ dùng ReactJS để biến những dòng chữ này thành một giao diện báo chí chuyên nghiệp."






===
1.	Table CategoriesProduct (Danh mục sản phẩm): liệt kê danh mục các loại sản phẩm thuộc về.
Trường dữ liệu: Id, Name,Description 
2.	Table Products (Sản phẩm):
○	Trường dữ liệu: Id, Name, Description,  Price, StockQuantity (Số lượng tồn), ImageUrl, CategoryProducId (Khóa ngoại).
3.	Table Customers (Khách hàng): Lưu thông tin người mua (khác với bảng Users của nhân viên quản trị).
○	Trường dữ liệu: Id, FullName, Email, Phone, Address, Password.
4.	Table Orders (Đơn hàng): Lưu thông tin tổng quát của một lần mua.
○	Trường dữ liệu: Id, OrderDate, CustomerId (Khóa ngoại), Status (0: Chờ duyệt, 1: Đang giao, 2: Đã xong), Notes.
5.	Table OrderDetails (Chi tiết đơn hàng): Một đơn hàng có nhiều sản phẩm.
○	Trường dữ liệu:  Id, OrderId (Khóa ngoại). , ProductId (Khóa ngoại)., Quantity, UnitPrice (Giá tại thời điểm mua).

