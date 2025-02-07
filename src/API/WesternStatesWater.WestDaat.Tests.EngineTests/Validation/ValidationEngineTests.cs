using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.EngineTests.Validation;

[TestClass]
public class ValidationEngineTests : EngineTestBase
{
    private IValidationEngine _validationEngine = null!;

    private Mock<IContextUtility> _contextUtilityMock = null!;

    private Mock<ISecurityUtility> _securityUtilityMock = null!;

    private Mock<IOrganizationAccessor> _organizationAccessorMock = null!;

    private Mock<IApplicationAccessor> _applicationAccessorMock = null!;

    [TestInitialize]
    public void TestInitialize()
    {
        _contextUtilityMock = new Mock<IContextUtility>(MockBehavior.Strict);
        _securityUtilityMock = new Mock<ISecurityUtility>(MockBehavior.Strict);

        _organizationAccessorMock = new Mock<IOrganizationAccessor>(MockBehavior.Strict);
        _applicationAccessorMock = new Mock<IApplicationAccessor>(MockBehavior.Strict);

        _validationEngine = new ValidationEngine(_contextUtilityMock.Object, _securityUtilityMock.Object, _organizationAccessorMock.Object, _applicationAccessorMock.Object);
    }

    [TestMethod]
    public async Task Validate_UnhandledType_ShouldThrow()
    {
        _contextUtilityMock
            .Setup(util => util.GetContext())
            .Returns(new UserContext());

        _securityUtilityMock
            .Setup(util => util.Get(It.IsAny<PermissionsGetRequestBase>()))
            .Returns(["Permission_1"]);

        var request = new TestType();
        var call = () => _validationEngine.Validate(request);

        await call
            .Should()
            .ThrowAsync<NotImplementedException>()
            .WithMessage("Validation for request type 'TestType' is not implemented.");
    }

    [DataTestMethod]
    [DataRow(true, true, true, true, DisplayName = "User requests estimate for their own Application with matching fields")]
    [DataRow(false, false, false, false, DisplayName = "User requests estimate for Application that does not exist")]
    [DataRow(true, false, true, false, DisplayName = "User requests estimate for a different Application that they own")]
    [DataRow(true, true, false, false, DisplayName = "User requests estimate for their own Application but with an incorrect Funding Organization")]
    public async Task Validate_ValidateEstimateConsumptiveUseRequest_Success(bool applicationExists, bool applicationIdMatches, bool organizationIdMatches, bool shouldSucceed)
    {
        Guid? applicationId = applicationExists ? Guid.NewGuid() : null;
        Guid? organizationId = Guid.NewGuid();

        // Arrange
        _applicationAccessorMock.Setup(x => x.Load(It.IsAny<UnsubmittedApplicationExistsLoadRequest>()))
            .ReturnsAsync(new UnsubmittedApplicationExistsLoadResponse
            {
                InProgressApplicationId = applicationId,
                FundingOrganizationId = organizationId,
            });

        var userId = Guid.NewGuid();
        var userContext = new UserContext()
        {
            UserId = userId,
            ExternalAuthId = "",
            Roles = [],
            OrganizationRoles = [],
        };

        _contextUtilityMock.Setup(x => x.GetContext()).Returns(userContext);
        _contextUtilityMock.Setup(x => x.GetRequiredContext<UserContext>()).Returns(userContext);


        // Act
        var request = new Contracts.Client.Requests.Conservation.EstimateConsumptiveUseRequest
        {
            // relevant properties
            WaterRightNativeId = "xyz",
            WaterConservationApplicationId = applicationIdMatches ? applicationId.Value : Guid.NewGuid(),
            FundingOrganizationId = organizationIdMatches ? organizationId.Value : Guid.NewGuid(),

            // extraneous properties
            DateRangeStart = DateOnly.MinValue,
            DateRangeEnd = DateOnly.MaxValue,
            Model = RasterTimeSeriesModel.SSEBop,
            Polygons = ["polygon"],
        };
        var result = await _validationEngine.Validate(request);

        // Assert
        if (shouldSucceed)
        {
            result.Should().BeNull();
        }
        else
        {
            result.Should().NotBeNull();

            if (!applicationExists)
            {
                result.Should().BeOfType<NotFoundError>();
            }
            else if (!applicationIdMatches || !organizationIdMatches)
            {
                result.Should().BeOfType<ForbiddenError>();
            }
        }
    }

    private class TestType : RequestBase
    {
    }
}