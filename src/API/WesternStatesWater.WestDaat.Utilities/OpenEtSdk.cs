using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Utilities;

internal class OpenEtSdk : IOpenEtSdk
{
    private readonly HttpClient _httpClient;
    private readonly ILogger _logger;

    public OpenEtSdk(HttpClient httpClient, OpenEtConfiguration openEtConfiguration, ILogger<OpenEtSdk> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _httpClient.DefaultRequestHeaders.Add(HeaderNames.Accept, "application/json");
        _httpClient.DefaultRequestHeaders.Add(HeaderNames.Authorization, openEtConfiguration.ApiKey);
    }

    public async Task<RasterTimeSeriesPolygonResponse> RasterTimeseriesPolygon(RasterTimeSeriesPolygonRequest request)
    {
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

        return new RasterTimeSeriesPolygonResponse
        {
            Data = responseData
        };
    }

    private double[] ConvertGeometryBoundingBoxCoordinatesToFlattenedArray(NetTopologySuite.Geometries.Geometry geometry)
    {
        return geometry.Envelope.Coordinates.Select(c => new double[] { c.X, c.Y }).SelectMany(x => x).ToArray();
    }

    private string ConvertRasterTimeseriesUnits(RasterTimeSeriesOutputUnits outputUnits)
    {
        return outputUnits switch
        {
            RasterTimeSeriesOutputUnits.Millimeters => "mm",
            _ => throw new NotImplementedException($"Output units {outputUnits} not implemented"),
        };
    }
}