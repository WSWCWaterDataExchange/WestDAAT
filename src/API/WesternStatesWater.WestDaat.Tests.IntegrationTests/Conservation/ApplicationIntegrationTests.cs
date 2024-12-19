using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Conservation;

[TestClass]
public class ApplicationIntegrationTests : IntegrationTestBase
{
    private IApplicationManager _applicationManager;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationManager = new ConservationManager(
            CreateLogger<ConservationManager>()
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

