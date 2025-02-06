using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.EngineTests.Formatting;

[TestClass]
public class ApplicationFormattingEngineTests : EngineTestBase
{
    private IApplicationFormattingEngine _applicationFormattingEngine;

    private Mock<IApplicationAccessor> _applicationAccessorMock;

    private Mock<IOrganizationAccessor> _organizationAccessorMock;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationAccessorMock = new Mock<IApplicationAccessor>();
        _organizationAccessorMock = new Mock<IOrganizationAccessor>();

        _applicationFormattingEngine = new FormattingEngine(
            CreateLogger<FormattingEngine>(),
            _applicationAccessorMock.Object,
            _organizationAccessorMock.Object
        );
    }

    [TestMethod]
    public async Task FormatStoreRequest_FormatWaterConservationApplicationCreateRequest_Success()
    {
        // Arrange
        var organizationId = Guid.NewGuid();
        var organizationAgencyId = "123";
        var userId = Guid.NewGuid();

        _organizationAccessorMock.Setup(x => x.Load(It.IsAny<OrganizationLoadDetailsRequest>()))
            .ReturnsAsync(new OrganizationLoadDetailsResponse
            {
                Organization = new OrganizationDetails
                {
                    OrganizationId = organizationId,
                    AbbreviatedName = organizationAgencyId,
                }
            });

        _applicationAccessorMock.Setup(x => x.Load(It.IsAny<ApplicationFindSequentialIdLoadRequest>()))
            .ReturnsAsync(new ApplicationFindSequentialIdLoadResponse
            {
                LastDisplayIdSequentialNumber = 3,
            });

        var request = new WaterConservationApplicationCreateRequest
        {
            ApplicantUserId = userId,
            FundingOrganizationId = organizationId,
            ApplicationDisplayId = null,
        };

        // Act
        await _applicationFormattingEngine.FormatStoreRequest(request);

        // Assert
        request.ApplicationDisplayId.Should().Be($"{DateTimeOffset.UtcNow.Year}-{organizationAgencyId}-0004");
    }
}