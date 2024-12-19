using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests.Conservation;

[TestClass]
public class ApplicationManagerTests : ManagerTestBase
{
    private IApplicationManager _applicationManager = null!;
    
    private Mock<IApplicationAccessor> _applicationAccessorMock = new(MockBehavior.Strict);

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationManager = new ConservationManager(
            CreateLogger<ConservationManager>(),
            _applicationAccessorMock.Object
        );
    }

    [TestMethod]
    public async Task Load_FakeRequest_ShouldThrow()
    {
        // Arrange
        var request = new FakeLoadRequest();

        // Act + Assert
        await Assert.ThrowsExceptionAsync<NotImplementedException>(() => _applicationManager.Load(request));
    }

    [TestMethod]
    public async Task Store_FakeRequest_ShouldThrow()
    {
        // Arrange
        var request = new FakeStoreRequest();

        // Act + Assert
        await Assert.ThrowsExceptionAsync<NotImplementedException>(() => _applicationManager.Store(request));
    }

    private class FakeLoadRequest : ApplicationLoadRequestBase
    {
    }
    
    private class FakeStoreRequest : ApplicationStoreRequestBase
    {
    }
}