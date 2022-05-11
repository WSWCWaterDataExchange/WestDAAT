using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class NotificationManagerTests : ManagerTestBase
    {
        private readonly Mock<IEmailNotificationSDK> _emailNotificationSDK = new(MockBehavior.Strict);
    }
}
