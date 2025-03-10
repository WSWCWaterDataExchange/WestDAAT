using System.Reflection;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Function;

public class FunctionTestBase
{
    public List<MethodInfo> FunctionHttpTriggers()
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


        var httpTriggerMethods = functionClasses.SelectMany(functionClass => functionClass.GetMethods().Where(info =>
                info.IsPublic &&
                info.GetCustomAttributes().Any(attr => attr is FunctionAttribute) &&
                info.GetParameters().Any(
                    paramInfo => paramInfo.GetCustomAttributes().Any(attr =>
                        attr is HttpTriggerAttribute))))
            .ToList();

        return httpTriggerMethods;
    }
}