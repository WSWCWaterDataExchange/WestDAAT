using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Utilities;

internal class OpenEtSdk : IOpenEtSdk
{
    private readonly HttpClient _httpClient;
    private readonly RateLimiter _rateLimiter;
    private readonly ILogger _logger;

    public OpenEtSdk(HttpClient httpClient, RateLimiter rateLimiter, OpenEtConfiguration openEtConfiguration, ILogger<OpenEtSdk> logger)
    {
        _httpClient = httpClient;
        _rateLimiter = rateLimiter;
        _logger = logger;

        _httpClient.DefaultRequestHeaders.Add(HeaderNames.Accept, "application/json");
        _httpClient.DefaultRequestHeaders.Add(HeaderNames.Authorization, openEtConfiguration.ApiKey);
    }

    public async Task<RasterTimeSeriesPolygonResponse> RasterTimeseriesPolygon(RasterTimeSeriesPolygonRequest request)
    {
        using var lease = await _rateLimiter.AcquireAsync();
        if (!lease.IsAcquired)
        {
            throw new ServiceUnavailableException("Rate limit exceeded");
        }

        var jsonString = JsonSerializer.Serialize(request);
        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

        var uri = new Uri("raster/timeseries/polygon", UriKind.Relative);
        var response = await _httpClient.PostAsync(uri, httpContent);

        if (!response.IsSuccessStatusCode)
        {
            throw new WestDaatException($"OpenET API returned status code {response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        var responseData = JsonSerializer.Deserialize<RasterTimeSeriesPolygonResponseDatapoint[]>(responseContent);

        lease.Dispose();

        return new RasterTimeSeriesPolygonResponse
        {
            Data = responseData
        };
    }
}