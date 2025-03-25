using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.EngineTests.Formatting;

[TestClass]
public class NotificationFormattingEngineTests : EngineTestBase
{
    private INotificationFormattingEngine _notificationFormattingEngine;

    private Mock<IApplicationAccessor> _applicationAccessorMock;

    private Mock<IOrganizationAccessor> _organizationAccessorMock;

    private Mock<IUserAccessor> _userAccessorMock;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationAccessorMock = new Mock<IApplicationAccessor>();
        _organizationAccessorMock = new Mock<IOrganizationAccessor>();
        _userAccessorMock = new Mock<IUserAccessor>();

        _notificationFormattingEngine = new FormattingEngine(
            CreateLogger<FormattingEngine>(),
            Services.GetRequiredService<EnvironmentConfiguration>(),
            _applicationAccessorMock.Object,
            _organizationAccessorMock.Object,
            _userAccessorMock.Object
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