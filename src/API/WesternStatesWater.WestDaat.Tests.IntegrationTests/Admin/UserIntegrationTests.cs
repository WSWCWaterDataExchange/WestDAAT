using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Tests.IntegrationTests.Conservation;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class UserIntegrationTests : IntegrationTestBase
{
    private CLI.IUserManager _userManager;

    [TestInitialize]
    public void TestInitialize()
    {
        _userManager = new AdminManager(
            CreateLogger<AdminManager>()
        );
    }

    [TestMethod]
    public async Task Load_FakeRequest_ShouldThrow()
    {
        // Arrange
        var request = new FakeRequest();

        // Act + Assert
        await Assert.ThrowsExceptionAsync<NotImplementedException>(() => _userManager.Load(request));
    }
    
    private class FakeRequest : CLI.RequestBase
    {
    }
}