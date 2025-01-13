using Microsoft.Extensions.Logging;
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

        _httpClient.DefaultRequestHeaders.Add("accept", "application/json");
        _httpClient.DefaultRequestHeaders.Add("Authorization", openEtConfiguration.ApiKey);
    }

    public async Task<RasterTimeseriesPolygonResponse> RasterTimeseriesPolygon(RasterTimeseriesPolygonRequest request)
    {
        var requestDictionary = new Dictionary<string, object>
        {
            {
                "date_range", 
                new string[] 
                {
                    request.DateRangeStart.ToString("yyyy-MM-dd"), 
                    request.DateRangeEnd.ToString("yyyy-MM-dd")
                }
            },
            { "file_format", request.OutputExtension.ToString() },
            { "geometry", ConvertGeometryBoundingBoxCoordinatesToFlattenedArray(request.Geometry) },
            { "interval", request.Interval.ToString() },
            { "model", request.Model.ToString() },
            { "reducer", request.PixelReducer.ToString() },
            { "reference_et", request.ReferenceEt.ToString() },
            { "units", ConvertRasterTimeseriesUnits(request.OutputUnits) },
            { "variable", request.Variable.ToString() },
        };

        var jsonString = JsonSerializer.Serialize(requestDictionary);
        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

        var uri = new Uri("raster/timeseries/polygon", UriKind.Relative);
        var response = await _httpClient.PostAsync(uri, httpContent);

        if (!response.IsSuccessStatusCode)
        {
            throw new WestDaatException($"OpenET API returned status code {response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        var responseData = JsonSerializer.Deserialize<RasterTimeseriesPolygonResponseDatapoint[]>(responseContent);

        return new RasterTimeseriesPolygonResponse
        {
            Data = responseData
        };
    }

    private double[] ConvertGeometryBoundingBoxCoordinatesToFlattenedArray(NetTopologySuite.Geometries.Geometry geometry)
    {
        return geometry.Envelope.Coordinates.Select(c => new double[] { c.X, c.Y }).SelectMany(x => x).ToArray();
    }

    private string ConvertRasterTimeseriesUnits(RasterTimeseriesOutputUnits outputUnits)
    {
        return outputUnits switch
        {
            RasterTimeseriesOutputUnits.Millimeters => "mm",
            _ => throw new NotImplementedException($"Output units {outputUnits} not implemented"),
        };
    }
}