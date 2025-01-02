using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Validation;

[TestClass]
public class ValidationIntegrationTests : IntegrationTestBase
{
    private IValidationEngine _validationEngine;

    [TestInitialize]
    public void TestInitialize()
    {
        _validationEngine = Services.GetRequiredService<IValidationEngine>();
    }

    [TestMethod]
    public void SmokeTest() => _validationEngine.Should().NotBeNull();
}