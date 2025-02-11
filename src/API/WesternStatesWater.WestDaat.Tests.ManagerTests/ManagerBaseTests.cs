using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Contracts.Clients;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class ManagerBaseTests
    {
        private TestManager _manager;

        private readonly Mock<IRequestHandler<TestRequest, TestResponse>>
            _requestHandlerMock = new(MockBehavior.Strict);

        private readonly Mock<IValidationEngine> _validationEngineMock = new(MockBehavior.Strict);

        [TestInitialize]
        public void TestInitialize()
        {
            var serviceProvider = new ServiceCollection()
                .AddLogging(config => config.AddConsole())
                .AddTransient<IManagerRequestHandlerResolver, RequestHandlerResolver>()
                .AddTransient(_ => _requestHandlerMock.Object)
                .BuildServiceProvider();

            var resolver = serviceProvider.GetRequiredService<IManagerRequestHandlerResolver>();
            var logger = serviceProvider.GetRequiredService<ILoggerFactory>().CreateLogger<TestManager>();

            _manager = new TestManager(resolver, _validationEngineMock.Object, logger);
        }

        [TestMethod]
        public async Task ExecuteAsync_InputValidationFails_ShouldReturnValidationError()
        {
            var request = new TestRequest { Id = 43 };
            var response = await _manager.ExecuteAsync<TestRequest, TestResponse>(request);

            response.Should().NotBeNull();
            response.Should().BeOfType<TestResponse>();
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<ValidationError>();

            var error = (ValidationError)response.Error!;
            error.Errors.Keys.Count.Should().Be(1);
            error.Errors["Id"].Should().Contain("'Id' must be less than '43'.");
        }

        [TestMethod]
        public async Task ExecuteAsync_EmptyBody_ShouldReturnValidationError()
        {
            // Can happen when request body is empty
            var response = await _manager.ExecuteAsync<TestRequest, TestResponse>(null);

            response.Should().NotBeNull();
            response.Should().BeOfType<TestResponse>();
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<ValidationError>();

            var error = (ValidationError)response.Error!;
            error.Errors.Keys.Count.Should().Be(1);
            error.Errors["request"].Should().Contain("Request object is null");
        }

        [TestMethod]
        public async Task ExecuteAsync_EngineValidationFails_ShouldHaltAndReturnError()
        {
            var request = new TestRequest { Id = 42 };

            _validationEngineMock
                .Setup(engine => engine.Validate(request))
                .ReturnsAsync(new NotFoundError());

            _requestHandlerMock
                .Setup(handler => handler.Handle(request))
                .ReturnsAsync(new TestResponse { Message = "Success" })
                .Verifiable();

            var response = await _manager.ExecuteAsync<TestRequest, TestResponse>(request);

            _requestHandlerMock.Verify(handler => handler.Handle(request), Times.Never);

            response.Error.Should().BeOfType<NotFoundError>();
        }

        [TestMethod]
        public async Task ExecuteAsync_ValidationSucceeds_ShouldReturnHandlerResult()
        {
            var request = new TestRequest { Id = 42 };

            _validationEngineMock
                .Setup(engine => engine.Validate(request))
                .ReturnsAsync(default(ErrorBase))
                .Verifiable();

            _requestHandlerMock
                .Setup(handler => handler.Handle(request))
                .ReturnsAsync(new TestResponse { Message = "Success" });

            var response = await _manager.ExecuteAsync<TestRequest, TestResponse>(request);

            _validationEngineMock.Verify();

            response.Message.Should().Be("Success");
        }

        [TestMethod]
        public async Task ExecuteAsync_ServiceUnavailableException_ShouldReturnServiceUnavailableError()
        {
            var request = new TestRequest { Id = 42 };

            _requestHandlerMock
                .Setup(handler => handler.Handle(request))
                .ThrowsAsync(new ServiceUnavailableException("Service is down"));

            var response = await _manager.ExecuteAsync<TestRequest, TestResponse>(request);

            response.Should().NotBeNull();
            response.Error.Should().BeOfType<ServiceUnavailableError>();
        }

        [TestMethod]
        public async Task ExecuteAsync_UnhandledException_ShouldReturnInternalError()
        {
            var request = new TestRequest { Id = 42 };

            _requestHandlerMock
                .Setup(handler => handler.Handle(request))
                .ThrowsAsync(new InvalidOperationException("Whoopsie daisy"));

            var response = await _manager.ExecuteAsync<TestRequest, TestResponse>(request);

            response.Should().NotBeNull();
            response.Should().BeOfType<TestResponse>();
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<InternalError>();
        }

        private class TestManager(
            IManagerRequestHandlerResolver resolver,
            IValidationEngine validationEngine,
            ILogger<TestManager> logger
        )
            : ManagerBase(resolver, validationEngine, logger)
        {
            public new async Task<TResponse> ExecuteAsync<TRequest, TResponse>(TRequest request)
                where TRequest : TestRequestBase
                where TResponse : TestResponse
            {
                return await base.ExecuteAsync<TRequest, TResponse>(request);
            }
        }
    }
}

namespace WesternStatesWater.WestDaat.Contracts.Clients
{
    public abstract class TestRequestBase : RequestBase
    {
    }

    public class TestRequest : TestRequestBase
    {
        public long Id { get; init; }
    }

    public sealed class TestRequestValidator : AbstractValidator<TestRequest>
    {
        public TestRequestValidator()
        {
            RuleFor(x => x.Id).LessThan(43).GreaterThan(41);
        }
    }

    public class TestResponse : ResponseBase
    {
        public string Message { get; init; }
    }
}