using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class FileFunction : FunctionBase
{
    private readonly IFileManager _fileManager;
    private readonly ILogger _logger;

    private const string RouteBase = "Files";

    public FileFunction(IFileManager fileManager, ILogger<FileFunction> logger) : base(logger)
    {
        _fileManager = fileManager;
        _logger = logger;
    }

    [Function(nameof(GenerateSasToken))]
    [OpenApiOperation(nameof(GenerateSasToken))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(FileSasTokenResponseBase))]
    public async Task<HttpResponseData> GenerateSasToken(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/GenerateSasToken")]
        HttpRequestData req)
    {
        var fileSasTokenRequest = await ParseRequestBody<FileSasTokenRequestBase>(req);
        var result = fileSasTokenRequest switch
        {
            ApplicationDocumentUploadSasTokenRequest request => await _fileManager
                .GenerateFileSasToken<ApplicationDocumentUploadSasTokenRequest, ApplicationDocumentUploadSasTokenResponse>(request),
            _ => throw new NotImplementedException($"Request type {fileSasTokenRequest.GetType().FullName} is not implemented.")
        };
        return await CreateResponse(req, result);
    }
}