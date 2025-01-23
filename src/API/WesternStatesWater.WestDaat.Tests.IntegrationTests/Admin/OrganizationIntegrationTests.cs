using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class OrganizationIntegrationTests : IntegrationTestBase
{
    private CLI.IOrganizationManager _organizationManager; 
    
    [TestInitialize]
    public void TestInitialize()
    {
        _organizationManager = Services.GetRequiredService<CLI.IOrganizationManager>();
    }

    [TestMethod]
    public void SmokeTest() => _organizationManager.Should().NotBeNull();
}