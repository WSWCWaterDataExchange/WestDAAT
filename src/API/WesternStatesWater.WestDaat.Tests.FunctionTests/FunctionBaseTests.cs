using FluentAssertions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using System.Net;
using System.Security.Claims;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Client.Functions;

namespace WesternStatesWater.WestDaat.Tests.FunctionTests;

[TestClass]
public class FunctionBaseTests
{
    private readonly TestFunction _function = new();

    [TestMethod]
    public async Task CreateResponse_DescendentOfResponseBase_ShouldReturn200()
    {
        var response = new TestDto { Message = "Hello, world." };
        var result = await _function.CreateResponse(new HttpRequestDataFake(), response);

        result.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await GetJson(result);
        body.Should().Be("{\"message\":\"Hello, world.\"}");
    }

    [TestMethod]
    public async Task CreateResponse_ValidationError_ShouldReturn400()
    {
        var response = new TestDto
        {
            Error = new ValidationError(new Dictionary<string, string[]>
            {
                { "Message", new[] { "Message is required.", "I don't like your attitude" } }
            })
        };

        var result = await _function.CreateResponse(new HttpRequestDataFake(), response);

        result.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var body = await GetJson(result);

        body.Should().Be("{\"" +
                         "type\":\"https://tools.ietf.org/html/rfc7231#section-6.5.1\",\"" +
                         "title\":\"One or more validation errors occurred\",\"" +
                         "status\":400,\"" +
                         "errors\":{\"Message\":[\"Message is required.\",\"I don\\u0027t like your attitude\"]}" +
                         "}");
    }

    [TestMethod]
    public async Task CreateResponse_ForbiddenError_ShouldReturn403()
    {
        var response = new TestDto { Error = new ForbiddenError() };

        var result = await _function.CreateResponse(new HttpRequestDataFake(), response);

        result.StatusCode.Should().Be(HttpStatusCode.Forbidden);

        var body = await GetJson(result);

        body.Should().Be("{\"" +
                         "type\":\"https://tools.ietf.org/html/rfc7231#section-6.5.3\",\"" +
                         "title\":\"Forbidden\",\"" +
                         "status\":403,\"" +
                         "detail\":\"You do not have permission to perform this action.\"" +
                         "}");
    }

    [TestMethod]
    public async Task CreateResponse_NotFoundError_ShouldReturn404()
    {
        var response = new TestDto { Error = new NotFoundError() };

        var result = await _function.CreateResponse(new HttpRequestDataFake(), response);

        result.StatusCode.Should().Be(HttpStatusCode.NotFound);

        var body = await GetJson(result);

        body.Should().Be("{\"" +
                         "type\":\"https://tools.ietf.org/html/rfc7231#section-6.5.4\",\"" +
                         "title\":\"Resource not found\",\"" +
                         "status\":404" +
                         "}");
    }

    [TestMethod]
    public async Task CreateResponse_TooManyRequestsError_ShouldReturn429()
    {
        var response = new TestDto { Error = new TooManyRequestsError() };

        var result = await _function.CreateResponse(new HttpRequestDataFake(), response);

        result.StatusCode.Should().Be(HttpStatusCode.TooManyRequests);

        var body = await GetJson(result);

        body.Should().Be("{\"" +
                         "type\":\"https://tools.ietf.org/html/rfc6585#section-4\",\"" +
                         "title\":\"Too many requests\",\"" +
                         "status\":429" +
                         "}");
    }

    [TestMethod]
    public async Task CreateResponse_InternalServerError_ShouldReturn500()
    {
        var response = new TestDto { Error = new InternalError() };

        var result = await _function.CreateResponse(new HttpRequestDataFake(), response);

        result.StatusCode.Should().Be(HttpStatusCode.InternalServerError);

        var body = await GetJson(result);

        body.Should().Be("{\"" +
                         "type\":\"https://tools.ietf.org/html/rfc7231#section-6.6.1\",\"" +
                         "title\":\"An unexpected error has occurred\",\"" +
                         "status\":500" +
                         "}");
    }

    [TestMethod]
    public async Task CreateResponse_UnhandledError_ShouldReturn500()
    {
        var response = new TestDto { Error = new TestError() };

        var result = await _function.CreateResponse(new HttpRequestDataFake(), response);

        result.StatusCode.Should().Be(HttpStatusCode.InternalServerError);

        var body = await GetJson(result);

        body.Should().Be("{\"" +
                         "type\":\"https://tools.ietf.org/html/rfc7231#section-6.6.1\",\"" +
                         "title\":\"An unexpected error has occurred\",\"" +
                         "status\":500" +
                         "}");
    }

    private static Task<string> GetJson(HttpResponseData data)
    {
        data.Body.Position = 0;

        return new StreamReader(data.Body).ReadToEndAsync();
    }

    private class TestDto : ResponseBase
    {
        public string? Message { get; init; }
    }

    private record TestError : ErrorBase
    {
    }

    private class TestFunction : FunctionBase
    {
        public new Task<HttpResponseData> CreateResponse(HttpRequestData request, ResponseBase response)
        {
            return base.CreateResponse(request, response);
        }
    }

    private class HttpRequestDataFake() : HttpRequestData(new Mock<FunctionContext>().Object)
    {
        public override Stream Body { get; } = new MemoryStream();
        public override HttpHeadersCollection Headers { get; } = [];
        public override IReadOnlyCollection<IHttpCookie> Cookies { get; } = null!;
        public override Uri Url { get; } = null!;
        public override IEnumerable<ClaimsIdentity> Identities { get; } = null!;
        public override string Method { get; } = null!;
        public override HttpResponseData CreateResponse() => new HttpResponseDataFake(FunctionContext);
    }

    private class HttpResponseDataFake(FunctionContext functionContext) : HttpResponseData(functionContext)
    {
        public override HttpStatusCode StatusCode { get; set; }
        public override HttpHeadersCollection Headers { get; set; } = [];
        public override Stream Body { get; set; } = new MemoryStream();
        public override HttpCookies Cookies { get; } = null!;
    }
}