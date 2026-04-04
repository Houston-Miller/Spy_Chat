using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebChat.Models;
using Microsoft.AspNetCore.SignalR;
using WebChat.Data;
using WebChat.Hubs;

namespace WebChat.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public UserController(ChatDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await _context.Users.Select(u => u.Username).ToListAsync();
            return Ok(users);
        }

        [HttpPut("{connectionId}")]
        public async Task<IActionResult> UpdateUsername(string connectionId, [FromBody] string newUsername)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ConnectionId == connectionId);
            if (user == null) 
            {
                user = new User { ConnectionId = connectionId, Username = newUsername };
                _context.Users.Add(user);
            }
            else
            {
                user.Username = newUsername;
            }

            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("UserUpdated", connectionId, newUsername);

            return Ok(new { status = "USERNAME_UPDATED", username = newUsername });
        }
    }
}