using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WebChat.Hubs;
using WebChat.Models;

namespace WebChat.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FrequencyController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public FrequencyController(ChatDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // this endpoint should get /api/frequency
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var codes = await _context.Frequencies.Select(f => f.Code).ToListAsync();
            return Ok(codes);
        }

        // also on /api/frequency
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] string code)
        {
            if (string.IsNullOrWhiteSpace(code)) return BadRequest("Invalid frequency.");
            // new check here to see if the frequency already exists in the database
            var exists = await _context.Frequencies.AnyAsync(f => f.Code == code);

            if (!exists)
            {
                _context.Frequencies.Add(new Frequency {Code = code});
                await _context.SaveChangesAsync();
            }

            return Ok(new { status = "FREQUENCY_ADDED", frequency = code });
        }

        // this should have to hit the specific frequency endpoint, so /api/frequency/{code}
        [HttpDelete]
        public async Task<IActionResult> Delete(string code)
        {
            var freq = await _context.Frequencies.FirstOrDefaultAsync(f => f.Code == code);
            if (freq == null) return NotFound();

            _context.Frequencies.Remove(freq);
            await _context.SaveChangesAsync();
            
            return Ok(new { status = "FREQUENCY_REMOVED"});
            
        }

    }
}