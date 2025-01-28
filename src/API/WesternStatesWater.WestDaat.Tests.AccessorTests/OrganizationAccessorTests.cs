using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests;

[TestClass]
public class OrganizationAccessorTests : AccessorTestBase
{
    private IOrganizationAccessor _organizationAccessor;

    [TestInitialize]
    public void TestInitialize()
    {
        _organizationAccessor = new OrganizationAccessor(
            CreateLogger<OrganizationAccessor>(),
            CreateWestDaatDatabaseContextFactory()
        );
    }

    [TestMethod]
    public void Load_InvalidRequestType_ShouldThrow()
    {
        // Arrange
        var request = new InvalidOrganizationLoadRequest();

        // Act + Assert
        Assert.ThrowsExceptionAsync<NotImplementedException>(() => _organizationAccessor.Load(request));
    }

    private class InvalidOrganizationLoadRequest : OrganizationLoadRequestBase
    {
    }
}