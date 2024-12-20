using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class MessageBusUtilityTests : UtilitiesTestBase
{
    [TestMethod]
    // TODO enable the ignore
    // [Ignore("Smoke test. Not ran as part of CI pipeline.")]
    public async Task SendMessageAsyncTest_ShouldReceiveMessage()
    {
        // Arrange
        var messageBusUtility = new MessageBusUtility(Configuration.GetMessageBusConfiguration());
        var messageObject = new SmokeTestRequest{ Message = "Look Ma! It's working!" };

        // Act
        await messageBusUtility.SendMessageAsync(Queues.SmokeTest, messageObject);
    }
    
    class SmokeTestRequest : RequestBase
    {
        public string Message { get; set; }
    }
}