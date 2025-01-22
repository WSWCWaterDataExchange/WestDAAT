using System.Reflection;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Function;

[TestClass]
public class FunctionKeyTests : FunctionTestBase
{
    [TestMethod]
    public void Functions_HttpTriggers_ShouldNotAllowAuthorizationLevelAnonymous()
    {
        var httpFunctionMethods = FunctionHttpTriggers();

        foreach (var functionMethod in httpFunctionMethods)
        {
            var httpTriggerAttribute = functionMethod
                    .GetParameters()
                    .Single(p => p.CustomAttributes.Any(ca => ca.NamedArguments.Any(na => na.MemberName == "Route")))!
                    .GetCustomAttributes()
                    .Single(ca => ca is HttpTriggerAttribute)
                as HttpTriggerAttribute;

            httpTriggerAttribute.AuthLevel.Should().NotBe(AuthorizationLevel.Anonymous,
                $"{functionMethod.Name} should not have an authorization level of Anonymous. All http endpoints must be secured with a valid function key.");
        }
    }
}