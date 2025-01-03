using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests.Context;

[TestClass]
public class ContextUtilityTests
{
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();

    [TestMethod]
    public void BuildContext_AnonymousContext_ShouldSetContext()
    {
        StringValues headerValue = default;

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(false);

        var utility = new ContextUtility(_httpContextAccessorMock.Object);

        utility.GetContext().Should().BeOfType<AnonymousContext>();
    }
    
    [TestMethod]
    public void BuildContext_UserContext_ShouldSetContext()
    {
        var jwt = JwtFaker.Generate(Guid.NewGuid(), Guid.NewGuid());
        StringValues headerValue = jwt;

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = new ContextUtility(_httpContextAccessorMock.Object);

        utility.GetContext().Should().BeOfType<UserContext>();
    }
    
    [TestMethod]
    public void GetRequiredContext_ContextMatchesRequestedType_ShouldReturnContext()
    {
        var jwt = JwtFaker.Generate(Guid.NewGuid(), Guid.NewGuid());
        StringValues headerValue = jwt;

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = new ContextUtility(_httpContextAccessorMock.Object);

        utility.GetRequiredContext<UserContext>().Should().BeOfType<UserContext>();
    }

    [TestMethod]
    public void GetRequiredContext_ContextDoesNotMatchRequestedType_ShouldThrow()
    {
        StringValues headerValue = default;

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(false);

        var utility = new ContextUtility(_httpContextAccessorMock.Object);

        Action action = () => utility.GetRequiredContext<UserContext>();

        action.Should().Throw<InvalidOperationException>()
            .WithMessage("Context is of type 'AnonymousContext', not of the requested type 'UserContext'.");
    }
}