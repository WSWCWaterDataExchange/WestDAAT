using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests;

[TestClass]
public class OrganizationAccessorTests : AccessorTestBase
{
    private IOrganizationAccessor _organizationAccessor;

    private WestDaatDatabaseContext _db;

    [TestInitialize]
    public void TestInitialize()
    {
        var dbFactory = CreateWestDaatDatabaseContextFactory();

        _organizationAccessor = new OrganizationAccessor(
            CreateLogger<OrganizationAccessor>(),
            dbFactory
        );

        _db = dbFactory.Create();
    }

    [TestMethod]
    public void Load_InvalidRequestType_ShouldThrow()
    {
        // Arrange
        var request = new InvalidOrganizationLoadRequest();

        // Act + Assert
        Assert.ThrowsExceptionAsync<NotImplementedException>(() => _organizationAccessor.Load(request));
    }

    [TestMethod]
    public async Task Load_GetOrganizationDetails_ShouldReturnOrganization()
    {
        // Arrange
        var organization = new OrganizationFaker().Generate();

        await _db.Organizations.AddAsync(organization);
        await _db.SaveChangesAsync();

        var request = new OrganizationLoadDetailsRequest
        {
            OrganizationId = organization.Id
        };

        // Act
        var response = (OrganizationLoadDetailsResponse)await _organizationAccessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.Organization.Should().NotBeNull();
        response.Organization.OrganizationId.Should().Be(organization.Id);
        response.Organization.AbbreviatedName.Should().Be(organization.AbbreviatedName);
    }

    [TestMethod]
    public async Task Load_GetOrganizationDetails_InvalidOrganizationId_ShouldThrow()
    {
        // Arrange
        var request = new OrganizationLoadDetailsRequest
        {
            OrganizationId = Guid.NewGuid()
        };

        // Act + Assert
        var call = () => _organizationAccessor.Load(request);

        await call.Should().ThrowAsync<WestDaatException>();
    }

    private class InvalidOrganizationLoadRequest : OrganizationLoadRequestBase
    {
    }
}