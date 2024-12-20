using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WaDE.Contracts.Api;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WaDE.Managers.Tests.Handlers
{
    [TestClass]
    public class RequestHandlerResolverTests
    {
        private readonly RequestHandlerResolver _resolver = new(new ServiceCollection().BuildServiceProvider());

        [TestMethod]
        public void ValidateTypeNamespace_TypesAreInManagerContractNamespace_ShouldNotThrow()
        {
            var action = () =>
                _resolver.ValidateTypeNamespace(typeof(RightNamespaceTestRequestType),
                    typeof(RightNamespaceTestResponseType));

            action.Should().NotThrow();
        }

        [DataTestMethod]
        [DataRow(
            typeof(WrongNamespaceTestRequestType),
            typeof(RightNamespaceTestResponseType),
            "Type WesternStatesWater.WaDE.Managers.Tests.Handlers.WrongNamespaceTestRequestType is not a valid request type. Request types must be in the WesternStatesWater.WaDE.Contracts.Api namespace."
        )]
        [DataRow(
            typeof(RightNamespaceTestRequestType),
            typeof(WrongNamespaceTestResponseType),
            "Type WesternStatesWater.WaDE.Managers.Tests.Handlers.WrongNamespaceTestResponseType is not a valid response type. Response types must be in the WesternStatesWater.WaDE.Contracts.Api namespace."
        )]
        [DataRow(
            typeof(WrongNamespaceTestRequestType),
            typeof(WrongNamespaceTestResponseType),
            "Type WesternStatesWater.WaDE.Managers.Tests.Handlers.WrongNamespaceTestRequestType is not a valid request type. Request types must be in the WesternStatesWater.WaDE.Contracts.Api namespace."
        )]
        public void ValidateTypeNamespace_TypeIsNotInManagerContractNamespace_ShouldThrow(
            Type requestType,
            Type responseType,
            string expectedMessage
        )
        {
            var action = () => _resolver.ValidateTypeNamespace(requestType, responseType);

            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage(expectedMessage);
        }
    }

    public class WrongNamespaceTestRequestType : RequestBase
    {
    }

    public class WrongNamespaceTestResponseType : ResponseBase
    {
    }
}

namespace WesternStatesWater.WaDE.Contracts.Api
{
    public class RightNamespaceTestRequestType : RequestBase
    {
    }

    public class RightNamespaceTestResponseType : ResponseBase
    {
    }
}