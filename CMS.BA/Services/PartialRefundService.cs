using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace CMS.Backend.Services
{
    public class PartialRefundRecord
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal RefundAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
    }

    public static class PartialRefundService
    {
        private static string RefundFilePath => Path.Combine(Directory.GetCurrentDirectory(), "PartialRefunds.json");
        private static string NotificationFilePath => Path.Combine(Directory.GetCurrentDirectory(), "Notifications.json");

        public static void CreateRefundTicket(int orderId, int productId, string productName, decimal amount)
        {
            var records = new List<PartialRefundRecord>();
            try
            {
                if (File.Exists(RefundFilePath))
                {
                    var json = File.ReadAllText(RefundFilePath);
                    records = JsonSerializer.Deserialize<List<PartialRefundRecord>>(json) ?? new List<PartialRefundRecord>();
                }
            }
            catch { }

            records.Add(new PartialRefundRecord
            {
                OrderId = orderId,
                ProductId = productId,
                ProductName = productName,
                RefundAmount = amount,
                CreatedAt = DateTime.Now,
                Status = "Pending"
            });

            File.WriteAllText(RefundFilePath, JsonSerializer.Serialize(records, new JsonSerializerOptions { WriteIndented = true }));
        }

        public static void SendNotification(string customerEmail, string customerName, int orderId, string productName, decimal removedAmount, decimal newTotal, bool isOnlinePayment)
        {
            var notifications = new List<object>();
            try
            {
                if (File.Exists(NotificationFilePath))
                {
                    var json = File.ReadAllText(NotificationFilePath);
                    notifications = JsonSerializer.Deserialize<List<object>>(json) ?? new List<object>();
                }
            }
            catch { }

            string message = $"Kính chào {customerName},\n" +
                             $"Sản phẩm '{productName}' trong đơn hàng #{orderId} của quý khách hiện đã hết hàng hoặc bị hư hỏng nên chúng tôi xin phép loại bỏ khỏi đơn hàng.\n" +
                             $"Tổng tiền mới của đơn hàng là: {newTotal:N0} VNĐ.\n";
            
            if (isOnlinePayment)
            {
                message += $"Số tiền chênh lệch {removedAmount:N0} VNĐ sẽ được hệ thống hoàn lại vào tài khoản của quý khách trong 24h tới.\n";
            }
            else
            {
                message += $"Quý khách vui lòng chỉ thanh toán {newTotal:N0} VNĐ khi nhận hàng.\n";
            }
            message += "Thành thật xin lỗi quý khách vì sự bất tiện này!";

            notifications.Add(new
            {
                To = customerEmail,
                Subject = $"Cập nhật đơn hàng #{orderId} - Sản phẩm không khả dụng",
                Message = message,
                SentAt = DateTime.Now
            });

            File.WriteAllText(NotificationFilePath, JsonSerializer.Serialize(notifications, new JsonSerializerOptions { WriteIndented = true }));
        }
    }
}
