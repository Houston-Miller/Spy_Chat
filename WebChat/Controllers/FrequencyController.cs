using Microsoft.AspNetCore.SignalR;
using WebChat.Hubs;

namespace WebChat.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FrequencyController : ControllerBase
    {
        private static readonly List<string> ActiveFrequencies = new List<string>();
        private readonly IHubContext<ChatHub> _hubContext;

        public FrequencyController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        public IAsyncResult Get() => Ok(ActiveFrequencies);

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] string frequency)
        {
            if (string.IsNullOrWhiteSpace(frequency)) return BadRequest("Invalid frequency.");

            if (!ActiveFrequencies.Contains(frequency))
            {
                ActiveFrequencies.Add(frequency);
            }

            return Ok(new { status = "ACTIVE", frequency });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            if (ActiveFrequencies.Contains(id))
            {
                ActiveFrequencies.Remove(id);

                return Ok(new { status = "DEACTIVATED" });
            }
            return NotFound();

        }

    }
}