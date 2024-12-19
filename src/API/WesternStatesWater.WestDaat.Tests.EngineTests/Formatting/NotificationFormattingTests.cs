using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.EngineTests.Formatting;

[TestClass]
public class NotificationFormattingTests : EngineTestBase
{
    private INotificationFormattingEngine _notificationFormattingEngine;

    [TestInitialize]
    public override void TestInitialize()
    {
        _notificationFormattingEngine = new FormattingEngine(
            CreateLogger<FormattingEngine>()
        );
    }

    [TestMethod]
    public void Format_FakeFormatType_ShouldThrow()
    {
        // Arrange
        var meta = new NotificationMetaBase[] { new FakeNotificationMeta() };

        // Act + Assert
        Assert.ThrowsException<NotImplementedException>(() => _notificationFormattingEngine.Format(meta));
    }

    private class FakeNotificationMeta : NotificationMetaBase
    {
    }
}