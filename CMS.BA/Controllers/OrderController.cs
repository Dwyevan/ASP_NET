using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // BẮT BUỘC: Thêm thư viện này để dùng được lệnh .Include()
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        //--------------------------------------------------
        // BÀI TẬP 6: HIỂN THỊ DANH SÁCH ĐƠN HÀNG (INDEX)
        // CÓ TÌM KIẾM VÀ LỌC TRẠNG THÁI
        //--------------------------------------------------
        public IActionResult Index(string searchString, int? statusFilter)
        {
            // Truy vấn cơ bản, kèm thông tin Khách hàng
            var query = _context.Orders.Include(o => o.Customer).AsQueryable();

            // 1. Lọc theo trạng thái (nếu có chọn)
            if (statusFilter.HasValue)
            {
                query = query.Where(o => o.Status == statusFilter.Value);
            }

            // 2. Tìm kiếm theo ID, Tên KH, SĐT, Email
            if (!string.IsNullOrEmpty(searchString))
            {
                var lowerSearch = searchString.ToLower();
                query = query.Where(o => 
                    o.Id.ToString() == lowerSearch ||
                    (o.Customer != null && (
                        o.Customer.FullName.ToLower().Contains(lowerSearch) ||
                        o.Customer.Phone.Contains(lowerSearch) ||
                        o.Customer.Email.ToLower().Contains(lowerSearch)
                    ))
                );
            }

            // Sắp xếp đơn hàng mới nhất lên đầu
            var orders = query.OrderByDescending(o => o.OrderDate).ToList();

            // Tính toán Dashboard Stats
            ViewBag.TotalOrders = _context.Orders.Count();
            ViewBag.TotalRevenue = _context.Orders.Where(o => o.Status == 2 || o.Status == 10 || o.Status == 11 || o.Status == 12).Sum(o => o.TotalAmount);
            ViewBag.PendingOrders = _context.Orders.Count(o => o.Status == 0 || o.Status == 10);

            // Truyền lại giá trị để giữ trạng thái cho giao diện
            ViewBag.CurrentSearch = searchString;
            ViewBag.CurrentFilter = statusFilter;

            return View(orders);
        }

        //--------------------------------------------------
        // BÀI TẬP 7: XEM CHI TIẾT CỦA MỘT ĐƠN HÀNG CỤ THỂ (DETAILS)
        // NÂNG CẤP LẤY TOÀN BỘ THÔNG TIN KHÁCH HÀNG VÀ ĐƠN HÀNG
        //--------------------------------------------------
        public IActionResult Details(int id)
        {
            // Truy vấn đối tượng Order, kéo theo Customer và danh sách OrderDetails (kèm Product)
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            // Đọc lý do hủy đơn (Nếu có)
            if (order.Status == 3 || order.Status == 13 || order.Status == 14)
            {
                try 
                {
                    var filePath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "CancelReasons.json");
                    if (System.IO.File.Exists(filePath))
                    {
                        var json = System.IO.File.ReadAllText(filePath);
                        var reasons = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.Dictionary<string, string>>(json);
                        if (reasons != null && reasons.ContainsKey(id.ToString()))
                        {
                            ViewBag.CancelReason = reasons[id.ToString()];
                        }
                    }
                }
                catch (System.Exception) { }
            }

            // Đọc lịch sử hoàn tiền một phần (Partial Refunds)
            try
            {
                var partialRefundPath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "PartialRefunds.json");
                if (System.IO.File.Exists(partialRefundPath))
                {
                    var json = System.IO.File.ReadAllText(partialRefundPath);
                    var allRefunds = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.List<CMS.Backend.Services.PartialRefundRecord>>(json);
                    if (allRefunds != null)
                    {
                        var orderRefunds = allRefunds.Where(r => r.OrderId == id).ToList();
                        if (orderRefunds.Any())
                        {
                            ViewBag.PartialRefunds = orderRefunds;
                        }
                    }
                }
            }
            catch (System.Exception) { }

            return View(order); // Truyền nguyên object Order sang View
        }

        //--------------------------------------------------
        // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
        //--------------------------------------------------
        [HttpPost]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                order.Status = status; // 0: Chờ duyệt, 1: Đang giao, 2: Hoàn tất, 3: Đã hủy
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        //--------------------------------------------------
        // LOẠI BỎ 1 SẢN PHẨM KHỎI ĐƠN HÀNG (PARTIAL CANCELLATION)
        //--------------------------------------------------
        [HttpPost]
        public IActionResult RemoveOrderItem(int orderId, int productId)
        {
            // 1. Tìm đơn hàng
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .FirstOrDefault(o => o.Id == orderId);

            if (order == null) return NotFound();

            // Chỉ cho phép khi đơn hàng đang ở trạng thái chờ duyệt (0) hoặc đã TT Online chờ duyệt (10, 101, 102)
            if (order.Status != 0 && order.Status != 10 && order.Status != 101 && order.Status != 102)
            {
                return BadRequest("Không thể thay đổi đơn hàng ở trạng thái hiện tại.");
            }

            // 2. Tìm chi tiết sản phẩm cần xóa
            var detailToRemove = order.OrderDetails.FirstOrDefault(d => d.ProductId == productId);
            if (detailToRemove == null) return NotFound("Sản phẩm không có trong đơn hàng này.");

            // 3. Tính toán số tiền bị trừ
            decimal amountToRemove = detailToRemove.UnitPrice * detailToRemove.Quantity;
            string productName = detailToRemove.Product?.Name ?? "Sản phẩm không xác định";

            // 4. Xóa khỏi DB và cập nhật tổng tiền
            _context.OrderDetails.Remove(detailToRemove);
            order.TotalAmount -= amountToRemove;
            
            // Xử lý logic hoàn tiền & Thông báo
            bool isOnlinePayment = (order.Status == 10 || order.Status == 101 || order.Status == 102);
            
            if (isOnlinePayment)
            {
                // Gọi Service tạo Ticket hoàn tiền (Ghi vào JSON)
                CMS.Backend.Services.PartialRefundService.CreateRefundTicket(orderId, productId, productName, amountToRemove);
            }

            // Gọi Service gửi thông báo (Ghi vào JSON)
            CMS.Backend.Services.PartialRefundService.SendNotification(
                customerEmail: order.Customer?.Email ?? "NoEmail",
                customerName: order.Customer?.FullName ?? "Khách hàng",
                orderId: orderId,
                productName: productName,
                removedAmount: amountToRemove,
                newTotal: order.TotalAmount,
                isOnlinePayment: isOnlinePayment
            );

            // NẾU ĐÃ XÓA HẾT TOÀN BỘ SẢN PHẨM TRONG ĐƠN HÀNG -> HỦY ĐƠN
            if (order.OrderDetails.Count == 1) // Count == 1 tức là trước khi SaveChanges, nó chỉ còn 1 cái (chính là cái đang bị xóa)
            {
                if (isOnlinePayment)
                {
                    order.Status = 13; // Chuyển sang Yêu cầu hoàn tiền toàn bộ
                }
                else
                {
                    order.Status = 3; // Hủy đơn COD
                }
                
                // Đồng thời dọn dẹp PartialRefunds.json nếu muốn, nhưng để nguyên cũng không sao, kế toán vẫn hiểu.
            }

            _context.SaveChanges();

            return RedirectToAction(nameof(Details), new { id = orderId });
        }

        //--------------------------------------------------
        // XÓA ĐƠN HÀNG VĨNH VIỄN
        //--------------------------------------------------
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Include(o => o.OrderDetails).FirstOrDefault(o => o.Id == id);
            if (order != null)
            {
                // Xóa chi tiết đơn hàng trước (Tránh lỗi Foreign Key)
                if (order.OrderDetails != null && order.OrderDetails.Any())
                {
                    _context.OrderDetails.RemoveRange(order.OrderDetails);
                }
                // Xóa đơn hàng chính
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}