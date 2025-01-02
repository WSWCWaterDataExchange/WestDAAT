using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.Extensions;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests.Context;

[TestClass]
public class ContextExtensionTests
{
    [TestMethod]
    public void ToLogString_AnonymousContext_ShouldReturnUnauthenticatedRequest()
    {
        var context = new AnonymousContext();

        var result = context.ToLogString();

        result.Should().Be("Unauthenticated request");
    }

    [TestMethod]
    public void ToLogString_UserContext_ShouldReturnUserWithId()
    {
        var context = new UserContext { UserId = Guid.NewGuid() };

        var result = context.ToLogString();

        result.Should().Be($"User with ID '{context.UserId}'");
    }

    [TestMethod]
    public void ToLogString_UnhandledType_ShouldReturnTypeName()
    {
        var context = new TestContext();

        var result = context.ToLogString();

        result.Should().Be(context.GetType().Name);
    }

    private class TestContext : ContextBase;
}