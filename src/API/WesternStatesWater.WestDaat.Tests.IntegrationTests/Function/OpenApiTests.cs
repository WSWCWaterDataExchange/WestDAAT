using System.Reflection;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Function;

[TestClass]
public class OpenApiTests
{
    [TestMethod]
    public void Functions_OpenApiOperationId_ShouldBeUnique()
    {
        Assembly assembly = typeof(Client.Functions.OpenApiConfiguration).GetTypeInfo()
            .Assembly;

        var @namespace = "WesternStatesWater.WestDaat.Client.Functions";
        var functionClasses = assembly.GetTypes()
            .Where(t =>
                t.FullName != null
                && String.Equals(t.Namespace, @namespace, StringComparison.Ordinal)
                && t.FullName.EndsWith("Function"))
            .ToArray();

        functionClasses.Should().NotBeEmpty();

        HashSet<string> openApiOperations = new();

        foreach (var functionClass in functionClasses)
        {
            var functionMethods = functionClass.GetMethods().Where(info =>
                    info.IsPublic &&
                    info.GetCustomAttributes().Any(attr => attr is FunctionAttribute) &&
                    info.GetParameters().Any(
                        paramInfo => paramInfo.GetCustomAttributes().Any(attr =>
                            attr is HttpTriggerAttribute)))
                .ToArray();


            foreach (var functionMethod in functionMethods)
            {
                var openApiOperationAttribute = functionMethod
                    .GetCustomAttributes()
                    .SingleOrDefault(attribute => attribute is OpenApiOperationAttribute) as OpenApiOperationAttribute;

                openApiOperationAttribute.Should().NotBeNull();

                openApiOperations.Add(openApiOperationAttribute.OperationId).Should().Be(true, $"Duplicate operationId: {openApiOperationAttribute.OperationId}");
            }
        }
    }

    [TestMethod]
    public void Functions_HttpTriggers_ShouldHaveOpenApiAttributes()
    {
        Assembly assembly = typeof(Client.Functions.OpenApiConfiguration).GetTypeInfo()
            .Assembly;

        var @namespace = "WesternStatesWater.WestDaat.Client.Functions";
        var functionClasses = assembly.GetTypes()
            .Where(t =>
                t.FullName != null
                && String.Equals(t.Namespace, @namespace, StringComparison.Ordinal))
            .ToArray();

        functionClasses.Should().NotBeEmpty();

        foreach (var functionClass in functionClasses)
        {
            var functionMethods = functionClass.GetMethods().Where(info =>
                    info.IsPublic &&
                    info.GetCustomAttributes().Any(attr => attr is FunctionAttribute) &&
                    info.GetParameters().Any(
                        paramInfo => paramInfo.GetCustomAttributes().Any(attr =>
                            attr is HttpTriggerAttribute)))
                .ToArray();


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
                    $"{functionClass.Name}.{functionMethod.Name} should have a single HTTP method. To support multiple methods use multiple functions. This is due to OpenApiExtension limitations.");

                CheckRouteParameterAttributePresence(functionMethod, functionClass);
                Console.WriteLine(functionMethod.Name);

                hasOpenApiOperationAttribute.Should().BeTrue(
                    $"{functionClass.Name}.{functionMethod.Name} should be decorated with OpenApiOperation attribute");

                hasOpenApiResponseAttribute.Should().BeTrue(
                    $"{functionClass.Name}.{functionMethod.Name} should be decorated with OpenApiResponseWithBodyAttribute or OpenApiResponseWithoutBodyAttribute attribute");
            }
        }
    }

    private static void CheckRouteParameterAttributePresence(MethodInfo functionMethod, Type functionClass)
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
                        $"{functionClass.Name}.{functionMethod.Name} should be decorated with OpenApiParameter attribute since it contains a route parameter");
                }
            }
        }
    }
}