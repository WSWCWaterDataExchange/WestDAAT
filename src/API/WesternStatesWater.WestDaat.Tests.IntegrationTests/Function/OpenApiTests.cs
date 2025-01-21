using System.Reflection;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Function;

[TestClass]
public class OpenApiTests : FunctionTestBase
{
    [TestMethod]
    public void Functions_OpenApiOperationId_ShouldBeUnique()
    {
        var functionMethods = FunctionHttpTriggers();

        HashSet<string> openApiOperations = new();
        foreach (var functionMethod in functionMethods)
        {
            var openApiOperationAttribute = functionMethod
                .GetCustomAttributes()
                .SingleOrDefault(attribute => attribute is OpenApiOperationAttribute) as OpenApiOperationAttribute;

            openApiOperationAttribute.Should().NotBeNull();

            openApiOperations.Add(openApiOperationAttribute.OperationId).Should().Be(true, $"Duplicate operationId: {openApiOperationAttribute.OperationId}");
        }
    }

    [TestMethod]
    public void Functions_HttpTriggers_ShouldHaveOpenApiAttributes()
    {
        var functionMethods = FunctionHttpTriggers();

        foreach (var functionMethod in functionMethods)
        {
            var hasOpenApiOperationAttribute = functionMethod
                .GetCustomAttributes()
                .Any(attribute => attribute is OpenApiOperationAttribute);

            var hasOpenApiResponseAttribute = functionMethod
                .GetCustomAttributes()
                .Any(attribute =>
                    attribute is OpenApiResponseWithBodyAttribute or OpenApiResponseWithoutBodyAttribute);

            var httpTriggerAttribute = functionMethod
                    .GetParameters()
                    .Single(p => p.CustomAttributes.Any(ca => ca.NamedArguments.Any(na => na.MemberName == "Route")))!
                    .GetCustomAttributes()
                    .Single(ca => ca is HttpTriggerAttribute)
                as HttpTriggerAttribute;

            var hasSingleHttpMethod = httpTriggerAttribute?.Methods?.Length == 1;

            hasSingleHttpMethod.Should().BeTrue(
                $"{functionMethod.Name} should have a single HTTP method. To support multiple methods use multiple functions. This is due to OpenApiExtension limitations.");

            CheckRouteParameterAttributePresence(functionMethod);
            Console.WriteLine(functionMethod.Name);

            hasOpenApiOperationAttribute.Should().BeTrue(
                $"{functionMethod.Name} should be decorated with OpenApiOperation attribute");

            hasOpenApiResponseAttribute.Should().BeTrue(
                $"{functionMethod.Name} should be decorated with OpenApiResponseWithBodyAttribute or OpenApiResponseWithoutBodyAttribute attribute");
        }
    }

    private static void CheckRouteParameterAttributePresence(MethodInfo functionMethod)
    {
        var httpRequestDataParam = functionMethod.GetParameters()
            .FirstOrDefault(p => p.CustomAttributes.Any(ca => ca.NamedArguments.Any(na => na.MemberName == "Route")));

        if (httpRequestDataParam != null)
        {
            var route = httpRequestDataParam.CustomAttributes.FirstOrDefault()?.NamedArguments.FirstOrDefault(na => na.MemberName == "Route");
            var routeStr = route?.TypedValue.Value;
            if (routeStr is string s && s.Contains('{'))
            {
                var hasOpenApiParameterAttribute = functionMethod
                    .GetCustomAttributes()
                    .Any(attribute =>
                        attribute is OpenApiParameterAttribute);
                if (!hasOpenApiParameterAttribute)
                {
                    hasOpenApiParameterAttribute.Should().BeTrue(
                        $"{functionMethod.Name} should be decorated with OpenApiParameter attribute since it contains a route parameter");
                }
            }
        }
    }
}