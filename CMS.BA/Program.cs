using Cms.data;
using CMS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR(); // Kích hoạt SignalR cho real-time

// 1. BỔ SUNG DÒNG NÀY: Đăng ký dịch vụ Session vào hệ thống (Phải đặt trước builder.Build)
builder.Services.AddSession();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// 1. Thêm cấu hình AddAuthentication cho Cookie (Admin) và JWT (API)
var jwtSecretKey = builder.Configuration["Jwt:Key"] ?? "Duylution_Secret_Key_For_JWT_Authentication_12345!@#";

builder.Services.AddAuthentication(options => {
    // Để mặc định là Cookie để không làm vỡ Admin UI
    options.DefaultScheme = Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/PageNotFound";
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecretKey)),
        ValidateIssuer = false, // Trong thực tế nên để true và config
        ValidateAudience = false
    };
});

// Thêm cấu hình CORS cho Web API (cho phép React Frontend gọi API)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy => {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "https://localhost:3000",
                "https://localhost:3001"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Cấu hình Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

var app = builder.Build();

// Sử dụng Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

// Bật CORS ngay sau UseRouting (TRƯỚC UseAuthorization)
app.UseCors("AllowReactApp");

// 2. BỔ SUNG DÒNG NÀY: Kích hoạt Middleware Session (BẮT BUỘC phải đặt giữa UseRouting và UseAuthorization)
app.UseSession();

// 2. BẮT BUỘC ĐẶT ĐÚNG THỨ TỰ (trước UseAuthorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.MapHub<CMS.BA.Hubs.AdminHub>("/adminHub"); // Định tuyến tới SignalR Hub

app.Run();