using Xunit;
using FluentAssertions; 
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using WebChat.Controllers;
using WebChat.Data;
using WebChat.Models;
using WebChat.Hubs;
using System;
using System.Threading.Tasks;

namespace SpyChat.Tests;

public class APITests
{
        //AI produced block to assist with testing in-memory, so I don't have to hit the actual DB
        private ChatDbContext GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<ChatDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;
            return new ChatDbContext(options);
        }
        // End of AI produced block
        [Fact]
        public async Task DeleteFrequency()
        {
            var context = GetDatabaseContext();
            context.Frequencies.Add(new Frequency { Code = "140.15" });
            await context.SaveChangesAsync();

            var mockHubContext = new Mock<IHubContext<ChatHub>>();
            var controller = new FrequencyController(context, mockHubContext.Object);

            var result = await controller.Delete("140.15");

            result.Should().BeOfType<OkObjectResult>();
            context.Frequencies.Should().BeEmpty();
        }
}
