using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        string endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        string partnerCode = "MOMOBKUN20180529";
        string accessKey = "klm05TvNCpectDTA";
        string secretKey = "at67qH6mk8w5c1M940PsuPDoCyp1UvFH";
        
        string orderInfo = "Thanh toan don hang 8";
        string redirectUrl = "http://localhost:3000/profile";
        string ipnUrl = "https://google.com"; // Test public URL
        string amountStr = "13500000";
        long amount = 13500000;
        string orderId = "8_" + DateTime.Now.Ticks.ToString();
        string requestId = Guid.NewGuid().ToString();
        string extraData = "8";

        string rawHash = "accessKey=" + accessKey +
                         "&amount=" + amountStr +
                         "&extraData=" + extraData +
                         "&ipnUrl=" + ipnUrl +
                         "&orderId=" + orderId +
                         "&orderInfo=" + orderInfo +
                         "&partnerCode=" + partnerCode +
                         "&redirectUrl=" + redirectUrl +
                         "&requestId=" + requestId +
                         "&requestType=captureWallet";

        string signature = ComputeHmacSha256(rawHash, secretKey);

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
            requestType = "captureWallet",
            signature = signature
        };

        using var client = new HttpClient();
        string json = System.Text.Json.JsonSerializer.Serialize(message);
        Console.WriteLine("JSON: " + json);
        
        var response = await client.PostAsync(endpoint, new StringContent(json, Encoding.UTF8, "application/json"));
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine("STATUS: " + response.StatusCode);
        Console.WriteLine("RESPONSE: " + responseString);
    }

    static string ComputeHmacSha256(string message, string secretKey)
    {
        byte[] keyByte = Encoding.UTF8.GetBytes(secretKey);
        byte[] messageBytes = Encoding.UTF8.GetBytes(message);
        using (var hmacsha256 = new HMACSHA256(keyByte))
        {
            byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
            return BitConverter.ToString(hashmessage).Replace("-", "").ToLower();
        }
    }
}
