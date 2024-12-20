using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.EngineTests.Filtering;

[TestClass]
public class NotificationFilteringTests : EngineTestBase
{
    private INotificationFilteringEngine _notificationFilteringEngine;

    [TestInitialize]
    public override void TestInitialize()
    {
        _notificationFilteringEngine = new FilteringEngine(
            CreateLogger<FilteringEngine>()
        );
    }

    [TestMethod]
    public void Filter_FakeFilterType_ShouldThrow()
    {
        // Arrange
        var filterEvent = DateTime.UtcNow; // Some bogus data type

        // Act + Assert
        Assert.ThrowsExceptionAsync<ArgumentException>(() => _notificationFilteringEngine.Filter(filterEvent));
    }
}