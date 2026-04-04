using FluentAssertions; 
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using WebChat.Controllers;
using WebChat.Data;
using WebChat.Models;
using WebChat.Hubs;

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

    // CREATE endpoint test
    [Fact]
    public async Task CreateFrequency()
    {
        var context = GetDatabaseContext();
        var mockHubContext = new Mock<IHubContext<ChatHub>>();
        var controller = new FrequencyController(context, mockHubContext.Object);

        var result = await controller.Post("140.15");

        result.Should().BeOfType<OkObjectResult>();
        context.Frequencies.Should().ContainSingle(f => f.Code == "140.15");
    }

    // READ endpoint test
    [Fact]
    public async Task GetFrequencies()
    {
        var context = GetDatabaseContext();
        context.Frequencies.Add(new Frequency { Code = "140.15" });
        await context.SaveChangesAsync();

        var mockHubContext = new Mock<IHubContext<ChatHub>>();
        var controller = new FrequencyController(context, mockHubContext.Object);

        var result = await controller.Get();

        result.Should().BeOfType<OkObjectResult>();
        var okResult = result as OkObjectResult;
        okResult.Value.Should().BeOfType<List<string>>();
        var frequencies = okResult.Value as List<string>;
        frequencies.Should().Contain("140.15");
    }

    // UPDATE endpoint test
    [Fact]
    public async Task UpdateUsername()
    {
        //needed AI help in setting up mock context for this one, since it needs to hit signalR as well (I think)
        var context = GetDatabaseContext();
        var mockClientProxy = new Mock<IClientProxy>();
        var mockHubContext = new Mock<IHubContext<ChatHub>>();
        mockHubContext.Setup(h => h.Clients.All).Returns(mockClientProxy.Object);
        var controller = new UserController(context, mockHubContext.Object);

        var result = await controller.UpdateUsername("conn123", "GreyFox");

        result.Should().BeOfType<OkObjectResult>();
        context.Users.Should().ContainSingle(u => u.ConnectionId == "conn123" && u.Username == "GreyFox");
    }

    // DELETE endpoint test
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
