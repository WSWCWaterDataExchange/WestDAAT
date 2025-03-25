using Azure.Messaging.ServiceBus;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class MessageBusUtilityTests : UtilityTestBase
{
    [TestMethod]
    public async Task SendMessageAsyncTest_ShouldReceiveMessage()
    {
        // Arrange
        var messageBusUtility = new MessageBusUtility(Configuration.GetMessageBusConfiguration());
        var messageObject = new SmokeTestRequest { Message = "Look Ma! It's working!" };

        try
        {
            // Act
            await messageBusUtility.SendMessageAsync(Queues.SmokeTest, messageObject);
        }
        catch (ServiceBusException e)
        {
            throw new AssertFailedException(
                $"Failed to send message to queue '{Queues.SmokeTest}'. "
                + "Make sure the queue exists and the Azure Service Bus Emulator docker container is running.", e);
        }
    }

    class SmokeTestRequest : RequestBase
    {
        public string Message { get; set; } = null!;
    }
}