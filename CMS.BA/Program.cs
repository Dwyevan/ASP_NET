using Cms.data;
using CMS.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// 1. BỔ SUNG DÒNG NÀY: Đăng ký dịch vụ Session vào hệ thống (Phải đặt trước builder.Build)
builder.Services.AddSession();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// 1. Thêm cấu hình AddAuthentication
builder.Services.AddAuthentication(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/PageNotFound";
    });

// Thêm cấu hình CORS cho Web API
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");

    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

// Bật CORS ngay sau UseRouting
app.UseCors("AllowAll");

// 2. BỔ SUNG DÒNG NÀY: Kích hoạt Middleware Session (BẮT BUỘC phải đặt giữa UseRouting và UseAuthorization)
app.UseSession();

// 2. BẮT BUỘC ĐẶT ĐÚNG THỨ TỰ (trước UseAuthorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();