using Microsoft.AspNetCore.SignalR;

namespace WebChat.Hubs
{
    public class ChatHub : Hub
    {
        //added roomID to paramerters but i'm not certain how groups work yet
        public async Task SendMessage(string roomID, string message)
        {
            //changed this from Clients.All to Clients.Group(roomID) but again, not sure how groups work yet
            await Clients.Group(roomID).SendAsync("ReceiveMessage", Context.ConnectionId, message);
        }

        // This is untested, it's basically just an autofill after making the Task
        public async Task JoinRoom(string roomID)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomID);
        }

        public async Task MessageEnd(string roomID)
        {
            // This will be used to unlock the send button for the second user
        }

    }
}