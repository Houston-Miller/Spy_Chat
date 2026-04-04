using WebChat.Hubs;
using WebChat.Models;
using WebChat.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddRazorPages();
// This CORS policy is required to allow the React frontend to connect to the SignalR hub
builder.Services.AddCors(options => {
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseSqlite("Data Source=codec.db"));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("ReactPolicy");
app.UseAuthorization();

app.MapStaticAssets();
app.MapHub<ChatHub>("/chatHub");
//Update this to map Controllers:
app.MapControllers();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();