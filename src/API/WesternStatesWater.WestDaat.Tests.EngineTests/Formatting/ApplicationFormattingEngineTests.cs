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

    private Mock<IUserAccessor> _userAccessorMock;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationAccessorMock = new Mock<IApplicationAccessor>();
        _organizationAccessorMock = new Mock<IOrganizationAccessor>();
        _userAccessorMock = new Mock<IUserAccessor>();

        _applicationFormattingEngine = new FormattingEngine(
            CreateLogger<FormattingEngine>(),
            _applicationAccessorMock.Object,
            _organizationAccessorMock.Object,
            _userAccessorMock.Object
        );
    }

    [TestMethod]
    public async Task Format_FormatDisplayId_Success()
    {
        // Arrange
        var organizationId = Guid.NewGuid();
        var organizationAgencyId = "123";

        _organizationAccessorMock.Setup(x => x.Load(It.IsAny<OrganizationLoadDetailsRequest>()))
            .ReturnsAsync(new OrganizationLoadDetailsResponse
            {
                Organization = new OrganizationSummaryItem
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

        // Act
        var request = new ApplicationFormatDisplayIdRequest
        {
            FundingOrganizationId = organizationId,
        };
        var response = (ApplicationFormatDisplayIdResponse)await _applicationFormattingEngine.Format(request);

        // Assert
        response.DisplayId.Should().Be($"{DateTimeOffset.UtcNow.Year}-{organizationAgencyId}-0004");
    }
}