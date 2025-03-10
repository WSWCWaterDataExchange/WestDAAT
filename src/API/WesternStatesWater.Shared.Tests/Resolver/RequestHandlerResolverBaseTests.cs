using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.Shared.Tests.Helpers;

namespace WesternStatesWater.Shared.Tests.Resolver
{
    [TestClass]
    public class RequestHandlerResolverBaseTests
    {
        private TestRequestHandlerResolver _resolver = null!;

        [TestInitialize]
        public void TestInitialize()
        {
            var serviceProvider = new ServiceCollection()
                .AddTransient<IRequestHandler<TestRequest, TestResponse>, TestRequestHandler>()
                .BuildServiceProvider();

            _resolver = new TestRequestHandlerResolver(serviceProvider);
        }

        [TestMethod]
        public void Resolve_ShouldCallDerivedValidateMethod()
        {
            _resolver.Resolve<TestRequest, TestResponse>();

            _resolver.ValidateTypeNamespaceWasCalled.Should().BeTrue();
        }

        [TestMethod]
        public void Resolve_HandlerNotRegistered_ShouldThrow()
        {
            var action = () => _resolver.Resolve<UnregisteredRequestType, UnregisteredResponseType>();

            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage(
                    "No handler found for request type " +
                    "WesternStatesWater.Shared.Tests.Resolver.UnregisteredRequestType."
                );
        }

        [TestMethod]
        public void Resolve_RequestTypeNamespaceIsNull_ShouldThrow()
        {
            var action = () => _resolver.Resolve<RequestWithoutANamespace, TestResponse>();

            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage(
                    "Type RequestWithoutANamespace is not a valid request type. " +
                    "Request types must be in a namespace."
                );
        }

        [TestMethod]
        public void Resolve_ResponseTypeNamespaceIsNull_ShouldThrow()
        {
            var action = () => _resolver.Resolve<TestRequest, ResponseWithoutANamespace>();

            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage(
                    "Type ResponseWithoutANamespace is not a valid response type. " +
                    "Response types must be in a namespace."
                );
        }
    }

    public class TestRequestHandlerResolver(IServiceProvider serviceProvider)
        : RequestHandlerResolverBase(serviceProvider)
    {
        public bool ValidateTypeNamespaceWasCalled { get; private set; }

        public override void ValidateTypeNamespace(Type requestType, Type responseType)
        {
            ValidateTypeNamespaceWasCalled = true;
        }
    }

    public class UnregisteredRequestType : RequestBase;

    public class UnregisteredResponseType : ResponseBase;

    public class UnregisteredRequestHandler : IRequestHandler<UnregisteredRequestType, UnregisteredResponseType>
    {
        public Task<UnregisteredResponseType> Handle(UnregisteredRequestType request)
        {
            throw new NotImplementedException();
        }
    }
}

public class RequestWithoutANamespace : RequestBase;

public class ResponseWithoutANamespace : ResponseBase;