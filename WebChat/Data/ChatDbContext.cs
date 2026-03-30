using Microsoft.EntityFrameworkCore;
using WebChat.Models;

namespace WebChat.Models
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options) { }

        public DbSet<Frequency> Frequencies { get; set; }
    }
}
