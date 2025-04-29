using Azure.Messaging.ServiceBus;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class EmailNotificationSdkTests : UtilityTestBase
{
    [TestMethod]
    [Ignore("For manual testing only. Keep ignored")]
    public async Task SendEmail_SmokeTest_ShouldSend()
    {
        // Arrange
        var emailNotificationSdk = new EmailNotificationSdk(Configuration.GetSmtpConfiguration(), CreateLogger<EmailNotificationSdk>());

        try
        {
            // End transaction
            BaseTestCleanup();

            await emailNotificationSdk.SendEmail(new EmailRequest
            {
                Subject = "Test subject",
                TextContent = "Test text content",
                Body = "Test body",
                From = "no-reply@westernstateswater.org", // Must be verified sender in SendGrid
                FromName = "WestDAAT",
                To = ["bbarber@dontpaniclabs.com"]
            });
        }
        catch (ServiceBusException e)
        {
            throw new AssertFailedException("Failed  to send email. " + e);
        }
    }
}