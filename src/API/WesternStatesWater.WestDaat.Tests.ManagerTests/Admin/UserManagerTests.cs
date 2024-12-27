using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests.Admin;

[TestClass]
public class UserManagerTests : ManagerTestBase
{
    private IUserManager _userManager = null!;

    [TestInitialize]
    public void TestInitialize()
    {
        _userManager = new AdminManager(
            ManagerRequestHandlerResolverMock.Object,
            CreateLogger<AdminManager>()
        );
    }

    // [TestMethod]
    // public async Task Load_FakeRequest_ShouldThrow()
    // {
    //     // Arrange
    //     var request = new FakeLoadRequest();
    //
    //     // Act + Assert
    //     await Assert.ThrowsExceptionAsync<NotImplementedException>(() => _userManager.Load(request));
    // }

    // private class FakeLoadRequest : UserLoadRequestBase
    // {
    // }
}