using Microsoft.Extensions.DependencyInjection;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class UserIntegrationTests : IntegrationTestBase
{
    private CLI.IUserManager _userManager;

    [TestInitialize]
    public void TestInitialize()
    {
        _userManager = Services.GetRequiredService<CLI.IUserManager>();
    }
    
    [TestMethod]
    public void SmokeTest() => _userManager.Should().NotBeNull();
}