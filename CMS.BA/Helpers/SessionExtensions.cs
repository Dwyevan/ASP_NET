using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace CMS.BA.Helpers
{
    public static class SessionExtensions
    {
        // Hàm lưu Object vào Session dưới dạng chuỗi JSON
        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, JsonSerializer.Serialize(value));
        }

        // Hàm lấy chuỗi JSON từ Session và dịch ngược lại thành Object
        public static T Get<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default : JsonSerializer.Deserialize<T>(value);
        }
    }
}