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

    private WestDaatDatabaseContext _westdaatDb;

    [TestInitialize]
    public void TestInitialize()
    {
        var westdaatDbFactory = CreateWestDaatDatabaseContextFactory();

        _organizationAccessor = new OrganizationAccessor(
            CreateLogger<OrganizationAccessor>(),
            westdaatDbFactory
        );

        _westdaatDb = westdaatDbFactory.Create();
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

        await _westdaatDb.Organizations.AddAsync(organization);
        await _westdaatDb.SaveChangesAsync();

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

    [DataTestMethod]
    [DataRow(false, false, DisplayName = "Organization does not exist, should throw")]
    [DataRow(true, true, DisplayName = "Organization exists, success")]
    public async Task Load_GetOrganizationFundingDetails_Success(bool organizationExists, bool shouldSucceed)
    {
        Guid? organizationId = null;
        WestDaat.Database.EntityFramework.Organization organization = null;
        if (organizationExists)
        {
            organization = new OrganizationFaker().Generate();
            await _westdaatDb.Organizations.AddAsync(organization);
            await _westdaatDb.SaveChangesAsync();

            organizationId = organization.Id;
        }

        // Act
        var request = new OrganizationFundingDetailsRequest
        {
            OrganizationId = organizationId ?? Guid.NewGuid()
        };
        var call = async () => await _organizationAccessor.Load(request);

        // Assert
        if (shouldSucceed)
        {
            var response = (OrganizationFundingDetailsResponse)await call();

            response.Should().NotBeNull();

            var org = response.Organization;
            org.Should().NotBeNull();
            org.OrganizationId.Should().Be(organization.Id);
            org.OrganizationName.Should().Be(organization.Name);
            org.OpenEtModelDisplayName.Should().Be(Enum.GetName(organization.OpenEtModel));
            org.CompensationRateModel.Should().Be(organization.OpenEtCompensationRateModel);
            org.OpenEtDateRangeStart.Should().Be(
                DateOnly.FromDateTime(
                    new DateTimeOffset(DateTimeOffset.UtcNow.Year - organization.OpenEtDateRangeInYears, 1, 1, 0, 0, 0, TimeSpan.Zero)
                    .UtcDateTime
                )
            );
            org.OpenEtDateRangeEnd.Should().Be(
                DateOnly.FromDateTime(
                    new DateTimeOffset(DateTimeOffset.UtcNow.Year, 1, 1, 0, 0, 0, TimeSpan.Zero)
                    .AddMinutes(-1)
                    .UtcDateTime
                )
            );
        }
        else
        {
            await call.Should().ThrowAsync<InvalidOperationException>();
        }
    }

    private class InvalidOrganizationLoadRequest : OrganizationLoadRequestBase
    {
    }
}