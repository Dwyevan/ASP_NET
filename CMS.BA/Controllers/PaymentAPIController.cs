using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace CMS.BA.Controllers
{
    public class MoMoRequest
    {
        public object OrderId { get; set; }
        public object Amount { get; set; }
        public string RequestType { get; set; }
    }

    [Route("api/Payment")]
    [ApiController]
    public class PaymentAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Sandbox MoMo Credentials
        private readonly string endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        private readonly string partnerCode = "MOMOBKUN20180529";
        private readonly string accessKey = "klm05TvNBzhg7h7j";
        private readonly string secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";

        public PaymentAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("MoMo")]
        public async Task<IActionResult> CreateMoMoPayment([FromBody] MoMoRequest request)
        {
            try
            {
                int.TryParse(request.OrderId?.ToString(), out int parsedOrderId);
                var order = _context.Orders.Find(parsedOrderId);
                if (order == null)
                {
                    return BadRequest(new { message = $"Không tìm thấy đơn hàng ID: {request.OrderId}" });
                }

                string orderInfo = "Thanh toan don hang " + parsedOrderId;
                // Tự động lấy đúng port của Frontend từ request Origin/Referer
                string frontendOrigin = Request.Headers["Origin"].FirstOrDefault() 
                    ?? Request.Headers["Referer"].FirstOrDefault()?.TrimEnd('/') 
                    ?? "http://localhost:3001";
                // Loại bỏ path nếu Referer có kèm path
                if (frontendOrigin.Contains("/", StringComparison.Ordinal) && frontendOrigin.Count(c => c == '/') > 2)
                {
                    var uri = new Uri(frontendOrigin);
                    frontendOrigin = $"{uri.Scheme}://{uri.Host}:{uri.Port}";
                }
                string redirectUrl = frontendOrigin + "/payment-result";
                string ipnUrl = "https://google.com"; // Webhook tạm vì Sandbox MoMo chặn localhost
                
                decimal.TryParse(request.Amount?.ToString(), out decimal parsedAmount);
                if (parsedAmount <= 0)
                {
                    return BadRequest(new { message = $"Lỗi: Tổng tiền không hợp lệ ({request.Amount}). Vui lòng không thanh toán giỏ hàng rỗng." });
                }
                long amount = Convert.ToInt64(parsedAmount);
                
                // MẸO BYPASS SANDBOX: MoMo Test giới hạn tối đa 50.000.000 VNĐ.
                // Tránh lỗi khi khách mua nhiều vang cao cấp (VD: 77 triệu)
                if (amount > 50000000)
                {
                    amount = 49900000;
                }
                
                string amountStr = amount.ToString();
                
                string orderId = parsedOrderId.ToString() + "_" + DateTime.Now.Ticks.ToString();
                string requestId = Guid.NewGuid().ToString();
                string extraData = ""; 
                string requestType = !string.IsNullOrEmpty(request.RequestType) ? request.RequestType : "captureWallet";

                // Đảm bảo rawHash đúng thứ tự alpha: accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType
                string rawHash = $"accessKey={accessKey}&amount={amountStr}&extraData={extraData}&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={partnerCode}&redirectUrl={redirectUrl}&requestId={requestId}&requestType={requestType}";

                // Hash HMAC SHA256
                string signature = ComputeHmacSha256(rawHash, secretKey);

                // Build JSON request
                var message = new
                {
                    partnerCode = partnerCode,
                    partnerName = "Test",
                    storeId = "MomoTestStore",
                    requestId = requestId,
                    amount = amount,
                    orderId = orderId,
                    orderInfo = orderInfo,
                    redirectUrl = redirectUrl,
                    ipnUrl = ipnUrl,
                    lang = "vi",
                    extraData = extraData,
                    requestType = requestType,
                    signature = signature
                };

                using var client = new HttpClient();
                var response = await client.PostAsync(endpoint, new StringContent(JsonConvert.SerializeObject(message), Encoding.UTF8, "application/json"));
                var responseString = await response.Content.ReadAsStringAsync();
                
                var jObject = JObject.Parse(responseString);
                string payUrl = jObject.GetValue("payUrl")?.ToString();

                if (string.IsNullOrEmpty(payUrl))
                {
                    return BadRequest(new { message = "Lỗi khi tạo giao dịch MoMo", detail = responseString });
                }

                return Ok(new { payUrl = payUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        public class MoMoResponseDto
        {
            public object resultCode { get; set; }
            public string orderId { get; set; }
            public object amount { get; set; }
            public string transId { get; set; }
        }

        [HttpPost("MoMoReturn")]
        public IActionResult MoMoReturn([FromBody] MoMoResponseDto response)
        {
            try
            {
                // MoMo sends result via IPN
                string resultCodeStr = response.resultCode?.ToString();
                string receivedOrderId = response.orderId;
                
                if (!string.IsNullOrEmpty(receivedOrderId))
                {
                    string idPart = receivedOrderId.Split('_')[0];
                    if (int.TryParse(idPart, out int orderId))
                    {
                        var order = _context.Orders.Find(orderId);
                        if (order != null && order.Status == 0) // Chỉ xử lý nếu đơn hàng đang ở trạng thái chờ duyệt mới
                        {
                            if (resultCodeStr == "0") // Thành công
                            {
                                order.Status = 10; // Đã thanh toán MoMo (Chờ duyệt)
                            }
                            else // Thất bại
                            {
                                order.Status = -1; // -1 là Thanh toán thất bại
                            }
                            _context.SaveChanges();
                        }
                    }
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Helper: HMAC SHA256
        private string ComputeHmacSha256(string message, string secretKey)
        {
            byte[] keyByte = Encoding.UTF8.GetBytes(secretKey);
            byte[] messageBytes = Encoding.UTF8.GetBytes(message);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                string hex = BitConverter.ToString(hashmessage);
                hex = hex.Replace("-", "").ToLower();
                return hex;
            }
        }
    }
}
