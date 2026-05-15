using System;

namespace Cms.data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } // Tên đăng nhập
        public string PasswordHash { get; set; } // Mật khẩu đã mã hóa
        public string FullName { get; set; } // Họ tên đầy đủ
        public string Role { get; set; } // Quyền (ví dụ: Admin, Editor)
    }
}