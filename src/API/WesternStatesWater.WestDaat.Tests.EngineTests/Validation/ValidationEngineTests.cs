using WesternStatesWater.Shared.DataContracts;
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

    private class TestType : RequestBase
    {
    }
}