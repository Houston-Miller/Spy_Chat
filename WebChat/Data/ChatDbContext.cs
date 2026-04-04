using Microsoft.EntityFrameworkCore;
using WebChat.Models;

namespace WebChat.Data;

public class ChatDbContext : DbContext
{
    public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options) { }

    public DbSet<Frequency> Frequencies { get; set; }
    public DbSet<User> Users { get; set; }
}

