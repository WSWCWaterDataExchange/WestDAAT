using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests.Admin;

[TestClass]
public class OrganizationManagerTests : ManagerTestBase
{
    private IOrganizationManager _organizationManager = null!;

    [TestInitialize]
    public void TestInitialize()
    {
        _organizationManager = new AdminManager(
            ManagerRequestHandlerResolverMock.Object,
            ValidationEngineMock.Object,
            CreateLogger<AdminManager>()
        );
    }
}