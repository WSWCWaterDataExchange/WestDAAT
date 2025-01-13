using Microsoft.Extensions.Logging;
using System.Net.Http;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

internal class OpenEtSdk : IOpenEtSdk
{
    private readonly HttpClient _httpClient;
    private readonly ILogger _logger;

    public OpenEtSdk(HttpClient httpClient, ILogger<UsgsNldiSdk> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<RasterTimeseriesPolygonResponse> RasterTimeseriesPolygon(RasterTimeseriesPolygonRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }
}