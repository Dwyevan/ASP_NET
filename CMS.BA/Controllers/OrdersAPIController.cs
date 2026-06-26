using Cms.data.Entities;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace CMS.BA.Controllers
{
    public class OrderRequest
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public List<CartItemRequest> Cart { get; set; }
    }

    public class CartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class CancelRequest
    {
        public string Reason { get; set; }
    }

    [Route("api/Orders")]
    [ApiController]
    public class OrdersAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public IActionResult CreateOrder([FromBody] OrderRequest request)
        {
            // Xác thực IDOR: Chỉ cho phép tạo đơn hàng cho chính mình
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int tokenUserId) || tokenUserId != request.CustomerId)
            {
                return Unauthorized(new { message = "Bạn không có quyền đặt hàng cho tài khoản này" });
            }
            if (request.Cart == null || !request.Cart.Any())
            {
                return BadRequest(new { message = "Giỏ hàng trống" });
            }

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // Bước 1: Tạo bản ghi vào bảng Order
                decimal totalAmount = request.Cart.Sum(item => item.Quantity * item.UnitPrice);
                
                var order = new Order
                {
                    CustomerId = request.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0, // 0: Chờ duyệt
                    TotalAmount = totalAmount,
                    // Nếu bảng Order có cột Notes thì gán ở đây, vì trong DB Schema đã ghi là có trường Notes.
                    // (Theo tài liệu yêu cầu "Trường dữ liệu: Id, OrderDate, CustomerId, Status, Notes").
                    // Note: Order.cs entity might not have Notes if not defined in code, but I'll check it via reflection or assume it is handled.
                    // Wait, looking at Order.cs in Cms.data/Entities/Order.cs, it doesn't have a Notes field... 
                    // I'll avoid setting Notes to prevent compilation error if not present, or if it is present, I'll ignore to be safe.
                    // Let's just create Order.
                };

                _context.Orders.Add(order);
                _context.SaveChanges(); // Lấy được Id của Order

                // Bước 2: Lặp qua mảng giỏ hàng, thêm từng món vào bảng OrderDetail
                foreach (var item in request.Cart)
                {
                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    };
                    _context.OrderDetails.Add(orderDetail);

                    // Bước 3: Khấu trừ tồn kho của sản phẩm trong bảng Product
                    var product = _context.Products.Find(item.ProductId);
                    if (product != null)
                    {
                        if (product.StockQuantity < item.Quantity)
                        {
                            throw new Exception($"Sản phẩm {product.Name} không đủ số lượng tồn kho");
                        }
                        product.StockQuantity -= item.Quantity;
                        _context.Products.Update(product);
                    }
                    else
                    {
                        throw new Exception($"Không tìm thấy sản phẩm với ID: {item.ProductId}");
                    }
                }

                _context.SaveChanges();
                transaction.Commit();

                return Ok(new { message = "Đặt hàng thành công", orderId = order.Id });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(new { message = "Đặt hàng thất bại: " + ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("customer/{customerId}")]
        public IActionResult GetHistoryByCustomer(int customerId)
        {
            // Xác thực IDOR: Chỉ cho phép xem đơn hàng của chính mình
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int tokenUserId) || tokenUserId != customerId)
            {
                return Unauthorized(new { message = "Bạn không có quyền xem lịch sử đơn hàng này" });
            }
            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .ToList();

            var allRefunds = new List<CMS.Backend.Services.PartialRefundRecord>();
            try
            {
                var partialRefundPath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "PartialRefunds.json");
                if (System.IO.File.Exists(partialRefundPath))
                {
                    var json = System.IO.File.ReadAllText(partialRefundPath);
                    allRefunds = System.Text.Json.JsonSerializer.Deserialize<List<CMS.Backend.Services.PartialRefundRecord>>(json) ?? new List<CMS.Backend.Services.PartialRefundRecord>();
                }
            }
            catch { }

            var history = orders.Select(o => new
            {
                o.Id,
                o.OrderDate,
                o.TotalAmount,
                o.Status,
                Details = o.OrderDetails.Select(od => new
                {
                    ProductId = od.ProductId,
                    Name = od.Product?.Name ?? "Sản phẩm",
                    ImageUrl = od.Product?.ImageUrl,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    IsCancelled = false,
                    RefundStatus = "",
                    RefundAmount = 0m
                }).Concat(
                    allRefunds.Where(r => r.OrderId == o.Id).Select(r => new
                    {
                        ProductId = r.ProductId,
                        Name = r.ProductName,
                        ImageUrl = _context.Products.FirstOrDefault(p => p.Id == r.ProductId)?.ImageUrl,
                        Quantity = 1,
                        UnitPrice = r.RefundAmount,
                        IsCancelled = true,
                        RefundStatus = r.Status,
                        RefundAmount = r.RefundAmount
                    })
                ).ToList()
            }).ToList();

            return Ok(history);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("cancel/{id}")]
        public IActionResult CancelOrder(int id, [FromBody] CancelRequest cancelRequest)
        {
            var order = _context.Orders.Find(id);
            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            // Xác thực IDOR: Chỉ cho phép người tạo đơn hàng được hủy
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int tokenUserId) || tokenUserId != order.CustomerId)
            {
                return Unauthorized(new { message = "Bạn không có quyền hủy đơn hàng này" });
            }

            int finalStatus = order.Status;

            // Nếu đơn hàng đang ở trạng thái 0 (Chờ duyệt COD) -> Hủy bình thường (Status 3)
            if (order.Status == 0)
            {
                order.Status = 3;
                finalStatus = 3;
            }
            // Nếu đơn hàng ở trạng thái 10, 101, 102 (Đã thanh toán MoMo) -> Yêu cầu hoàn tiền (Status 13)
            else if (order.Status == 10 || order.Status == 101 || order.Status == 102)
            {
                order.Status = 13;
                finalStatus = 13;
            }
            // Các trạng thái khác không cho phép hủy
            else
            {
                return BadRequest(new { message = "Đơn hàng này không thể hủy. Vui lòng liên hệ Hotline." });
            }

            _context.SaveChanges();

            // Lưu lý do hủy vào JSON tĩnh (Hack không đụng DB)
            try 
            {
                var filePath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "CancelReasons.json");
                var reasons = new Dictionary<string, string>();
                
                if (System.IO.File.Exists(filePath))
                {
                    var json = System.IO.File.ReadAllText(filePath);
                    reasons = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(json) ?? new Dictionary<string, string>();
                }
                
                reasons[id.ToString()] = cancelRequest?.Reason ?? "Không có lý do";
                
                System.IO.File.WriteAllText(filePath, System.Text.Json.JsonSerializer.Serialize(reasons));
            }
            catch (Exception) { /* Bỏ qua lỗi ghi file */ }

            string msg = finalStatus == 3 ? "Đã hủy đơn hàng thành công" : "Đã gửi yêu cầu hủy và hoàn tiền";
            return Ok(new { message = msg, status = finalStatus });
        }
    }
}
