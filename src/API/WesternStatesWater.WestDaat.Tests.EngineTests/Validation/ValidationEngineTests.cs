using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common;
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

    private Mock<IUserAccessor> _userAccessorMock = null!;

    [TestInitialize]
    public void TestInitialize()
    {
        _contextUtilityMock = new Mock<IContextUtility>(MockBehavior.Strict);
        _securityUtilityMock = new Mock<ISecurityUtility>(MockBehavior.Strict);

        _organizationAccessorMock = new Mock<IOrganizationAccessor>(MockBehavior.Strict);
        _applicationAccessorMock = new Mock<IApplicationAccessor>(MockBehavior.Strict);
        _userAccessorMock = new Mock<IUserAccessor>(MockBehavior.Strict);

        _validationEngine = new ValidationEngine(_contextUtilityMock.Object, _securityUtilityMock.Object, _organizationAccessorMock.Object, _applicationAccessorMock.Object,
            _userAccessorMock.Object);
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
    [DataRow(true, true, true, false, true, DisplayName = "User requests estimate for their own Application with matching fields")]
    [DataRow(false, false, false, false, false, DisplayName = "User requests estimate for Application that does not exist")]
    [DataRow(true, false, true, false, false, DisplayName = "User requests estimate for a different Application that they own")]
    [DataRow(true, true, true, true, false, DisplayName = "User requests estimate for their own Application with intersecting polygons")]
    public async Task Validate_ValidateEstimateConsumptiveUseRequest_Success(
        bool applicationExists,
        bool applicationIdMatches,
        bool organizationIdMatches,
        bool polygonsIntersect,
        bool shouldSucceed
    )
    {
        Guid? applicationId = applicationExists ? Guid.NewGuid() : null;
        Guid? organizationId = Guid.NewGuid();

        // Arrange
        _applicationAccessorMock.Setup(x => x.Load(It.IsAny<ApplicationExistsLoadRequest>()))
            .ReturnsAsync(new ApplicationExistsLoadResponse
            {
                ApplicationExists = applicationExists,
                ApplicationId = applicationId,
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
        string polygonWkt = "POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))";
        var polygonDetails = new Contracts.Client.MapPolygon
        {
            PolygonWkt = polygonWkt,
            DrawToolType = DrawToolType.Freeform,
        };

        var request = new Contracts.Client.Requests.Conservation.EstimateConsumptiveUseApplicantRequest
        {
            WaterRightNativeId = "xyz",
            WaterConservationApplicationId = applicationIdMatches ? applicationId.Value : Guid.NewGuid(),
            Polygons = polygonsIntersect ? [polygonDetails, polygonDetails] : [polygonDetails],
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
            else if (polygonsIntersect)
            {
                result.Should().BeOfType<ValidationError>();
            }
        }
    }

    [DataTestMethod]
    [DataRow(false, false, false, false, DisplayName = "User is not logged in")]
    [DataRow(true, false, false, false, DisplayName = "User is logged in but Application does not exist")]
    [DataRow(true, true, false, false, DisplayName = "User is logged in and Application exists but they are not the Applicant")]
    [DataRow(true, true, true, true, DisplayName = "User is logged in and Application exists and they are the Applicant")]
    public async Task Validate_ValidateApplicantConservationApplicationLoadRequest_Success(
        bool isUserLoggedIn,
        bool applicationExists,
        bool userIsApplicant,
        bool shouldSucceed
    )
    {
        // Arrange
        var userId = Guid.NewGuid();

        var getContextMock = _contextUtilityMock.Setup(mock => mock.GetContext());
        var getRequiredContextMock = _contextUtilityMock.Setup(mock => mock.GetRequiredContext<UserContext>());
        if (isUserLoggedIn)
        {
            var userContext = new UserContext
            {
                UserId = userId,
                ExternalAuthId = "",
                Roles = [],
                OrganizationRoles = [],
            };
            getContextMock.Returns(userContext);
            getRequiredContextMock.Returns(userContext);
        }
        else
        {
            getContextMock.Returns<UserContext>(null);
            getRequiredContextMock.Throws<InvalidOperationException>();
        }

        _securityUtilityMock.Setup(mock => mock.Get(It.IsAny<PermissionsGetRequestBase>()))
            .Returns([Permissions.ApplicationReview]);

        var applicationAccessorMock = _applicationAccessorMock.Setup(mock => mock.Load(It.IsAny<ApplicationExistsLoadRequest>()));
        if (applicationExists)
        {
            applicationAccessorMock.ReturnsAsync(new ApplicationExistsLoadResponse
            {
                ApplicationExists = true,
                ApplicantUserId = userIsApplicant ? userId : Guid.NewGuid(),
                FundingOrganizationId = Guid.NewGuid(),
            });
        }
        else
        {
            applicationAccessorMock.ReturnsAsync(new ApplicationExistsLoadResponse
            {
                ApplicationExists = false,
            });
        }

        // Act
        var request = new Contracts.Client.Requests.Conservation.ApplicantConservationApplicationLoadRequest
        {
            ApplicationId = Guid.NewGuid(),
        };
        var call = async () => await _validationEngine.Validate(request);

        // Assert
        if (shouldSucceed)
        {
            var response = await call();
            response.Should().BeNull();
        }
        else
        {
            if (isUserLoggedIn)
            {
                var response = await call();
                if (applicationExists)
                {
                    response.Should().BeOfType<ForbiddenError>();
                }
                else
                {
                    response.Should().BeOfType<NotFoundError>();
                }
            }
            else
            {
                await call.Should().ThrowAsync<InvalidOperationException>();
            }
        }
    }

    [DataTestMethod]
    [DataRow(false, false, false, false, false, DisplayName = "User is not logged in")]
    [DataRow(true, false, false, false, false, DisplayName = "User is logged in but Application does not exist")]
    [DataRow(true, true, false, false, false, DisplayName = "User is logged in and Application exists but they are not an org member")]
    [DataRow(true, true, true, false, false, DisplayName = "User is logged in, Application exists, and they are an org member, but do not have permission")]
    [DataRow(true, true, true, true, true, DisplayName = "User is logged in, Application exists, they are an org member, and they have permission")]
    public async Task Validate_ValidateReviewerConservationApplicationLoadRequest(
        bool isUserLoggedIn,
        bool applicationExists,
        bool isUserMemberOfOrg,
        bool doesUserHaveCorrectPermission,
        bool shouldSucceed
    )
    {
        // Arrange
        var userId = Guid.NewGuid();
        var organizationId = Guid.NewGuid();

        var getContextMock = _contextUtilityMock.Setup(mock => mock.GetContext());
        var getRequiredContextMock = _contextUtilityMock.Setup(mock => mock.GetRequiredContext<UserContext>());
        if (isUserLoggedIn)
        {
            var userContext = new UserContext
            {
                UserId = userId,
                ExternalAuthId = "",
                Roles = [],
                OrganizationRoles = isUserMemberOfOrg
                    ?
                    [
                        new OrganizationRole
                        {
                            OrganizationId = organizationId,
                            RoleNames = [Roles.TechnicalReviewer],
                        }
                    ]
                    : [],
            };
            getContextMock.Returns(userContext);
            getRequiredContextMock.Returns(userContext);
        }
        else
        {
            getContextMock.Returns<UserContext>(null);
            getRequiredContextMock.Throws<InvalidOperationException>();
        }

        _securityUtilityMock.Setup(mock => mock.Get(It.IsAny<PermissionsGetRequestBase>()))
            .Returns(doesUserHaveCorrectPermission ? [Permissions.ApplicationReview] : []);

        var applicationAccessorMock = _applicationAccessorMock.Setup(mock => mock.Load(It.IsAny<ApplicationExistsLoadRequest>()));
        if (applicationExists)
        {
            applicationAccessorMock.ReturnsAsync(new ApplicationExistsLoadResponse
            {
                ApplicationExists = true,
                ApplicantUserId = Guid.NewGuid(),
                FundingOrganizationId = organizationId,
            });
        }
        else
        {
            applicationAccessorMock.ReturnsAsync(new ApplicationExistsLoadResponse
            {
                ApplicationExists = false,
            });
        }

        // Act
        var request = new Contracts.Client.Requests.Conservation.ReviewerConservationApplicationLoadRequest
        {
            ApplicationId = Guid.NewGuid(),
        };
        var call = async () => await _validationEngine.Validate(request);

        // Assert
        if (shouldSucceed)
        {
            var response = await call();
            response.Should().BeNull();
        }
        else
        {
            if (isUserLoggedIn)
            {
                var response = await call();

                if (applicationExists)
                {
                    response.Should().BeOfType<ForbiddenError>();
                }
                else
                {
                    response.Should().BeOfType<NotFoundError>();
                }
            }
            else
            {
                await call.Should().ThrowAsync<InvalidOperationException>();
            }
        }
    }

    private class TestType : RequestBase
    {
    }
}