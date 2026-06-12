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

namespace CMS.BA.Controllers
{
    public class MoMoRequest
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
    }

    [Route("api/Payment")]
    [ApiController]
    public class PaymentAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Sandbox MoMo Credentials
        private readonly string endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        private readonly string partnerCode = "MOMOBKUN20180529";
        private readonly string accessKey = "klm05TvNCpectDTA";
        private readonly string secretKey = "at67qH6mk8w5c1M940PsuPDoCyp1UvFH";

        public PaymentAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("MoMo")]
        public async Task<IActionResult> CreateMoMoPayment([FromBody] MoMoRequest request)
        {
            try
            {
                var order = _context.Orders.Find(request.OrderId);
                if (order == null)
                {
                    return BadRequest(new { message = "Không tìm thấy đơn hàng" });
                }

                string orderInfo = "Thanh toan don hang " + request.OrderId;
                string redirectUrl = "http://localhost:3000/profile";
                string ipnUrl = "https://google.com"; // Webhook tạm vì Sandbox MoMo chặn localhost
                
                long amount = Convert.ToInt64(request.Amount);
                string amountStr = amount.ToString();
                
                string orderId = request.OrderId.ToString() + "_" + DateTime.Now.Ticks.ToString();
                string requestId = Guid.NewGuid().ToString();
                string extraData = ""; 
                string requestType = "captureWallet";

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

        [HttpPost("MoMoReturn")]
        public IActionResult MoMoReturn([FromBody] JObject response)
        {
            try
            {
                // MoMo sends result via IPN
                string resultCode = response.GetValue("resultCode")?.ToString();
                string extraData = response.GetValue("extraData")?.ToString(); // This contains original OrderId
                
                if (resultCode == "0") // Success
                {
                    // Lấy orderId từ chuỗi "8_63851..."
                    string receivedOrderId = response.GetValue("orderId")?.ToString();
                    if (!string.IsNullOrEmpty(receivedOrderId))
                    {
                        string idPart = receivedOrderId.Split('_')[0];
                        if (int.TryParse(idPart, out int orderId))
                        {
                            var order = _context.Orders.Find(orderId);
                            if (order != null && order.Status == 0)
                            {
                                order.Status = 10; // Đã thanh toán MoMo (Chờ duyệt)
                                _context.SaveChanges();
                            }
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
