using WesternStatesWater.Shared.Resolver;

namespace WesternStatesWater.Shared.Tests.Helpers;

public class TestRequestHandler : IRequestHandler<TestRequest, TestResponse>
{
    public Task<TestResponse> Handle(TestRequest request) => Task.FromResult(new TestResponse());
}