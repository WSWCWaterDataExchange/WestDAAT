using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests.Conservation;

[TestClass]
public class ApplicationManagerTests : ManagerTestBase
{
    private IApplicationManager _applicationManager = null!;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationManager = new ConservationManager(
            ManagerRequestHandlerResolverMock.Object,
            ValidationEngineMock.Object,
            CreateLogger<ConservationManager>()
        );
    }
}