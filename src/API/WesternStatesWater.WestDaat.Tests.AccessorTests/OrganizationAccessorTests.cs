using WesternStatesWater.WaDE.Database.EntityFramework;
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

    private DatabaseContext _wadeDb;

    [TestInitialize]
    public void TestInitialize()
    {
        var westdaatDbFactory = CreateWestDaatDatabaseContextFactory();
        var wadeDbFactory = CreateDatabaseContextFactory();

        _organizationAccessor = new OrganizationAccessor(
            CreateLogger<OrganizationAccessor>(),
            westdaatDbFactory,
            wadeDbFactory
        );

        _westdaatDb = westdaatDbFactory.Create();
        _wadeDb = wadeDbFactory.Create();
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
    [DataRow(false, false, false, DisplayName = "No water right, should throw")]
    [DataRow(true, false, false, DisplayName = "Water right exists but no organization supports this water right, should throw")]
    [DataRow(true, true, true, DisplayName = "Water right exists and has organization support, success")]
    public async Task Load_GetOrganizationFundingDetails_Success(bool waterRightExists, bool waterRightHasLinkedOrganization, bool shouldSucceed)
    {
        // Arrange
        Database.EntityFramework.Organization organization = null;
        string waterRightNativeId = string.Empty;

        await using var wadeDb = CreateDatabaseContextFactory().Create();
        await using var westDaatDb = CreateWestDaatDatabaseContextFactory().Create();

        if (waterRightExists)
        {
            var waterRightFaker = new AllocationAmountFactFaker();

            if (waterRightHasLinkedOrganization)
            {
                organization = new OrganizationFaker().Generate();
                await westDaatDb.Organizations.AddAsync(organization);
                await westDaatDb.SaveChangesAsync();

                waterRightFaker.RuleFor(x => x.ConservationApplicationFundingOrganizationId, organization.Id);
            }

            var waterRight = waterRightFaker.Generate();
            await wadeDb.AllocationAmountsFact.AddAsync(waterRight);
            await wadeDb.SaveChangesAsync();

            waterRightNativeId = waterRight.AllocationNativeId;
        }


        // Act
        var request = new OrganizationFundingDetailsRequest
        {
            WaterRightNativeId = waterRightNativeId
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