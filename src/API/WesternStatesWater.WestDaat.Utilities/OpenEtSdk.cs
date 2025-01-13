using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Utilities;

internal class OpenEtSdk : IOpenEtSdk
{
    private readonly HttpClient _httpClient;
    private readonly ILogger _logger;

    public OpenEtSdk(HttpClient httpClient, ILogger<OpenEtSdk> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
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
            { "geometry", request.Geometry.Envelope.Coordinates.Select(c => new double[] { c.X, c.Y }).SelectMany(x => x).ToArray() },
            { "interval", request.Interval.ToString() },
            { "model", request.Model.ToString() },
            { "reducer", request.PixelReducer.ToString() },
            { "reference_et", request.ReferenceEt.ToString() },
            { "units", request.OutputUnits.ToString() },
            { "variable", request.Variable.ToString() },
        };

        var jsonString = JsonSerializer.Serialize(requestDictionary);
        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

        var uri = new Uri("https://openet-api.org/raster/timeseries/polygon");
        var response = await _httpClient.PostAsync(uri, httpContent);

        if (!response.IsSuccessStatusCode)
        {
            throw new WestDaatException($"OpenET API returned status code {response.StatusCode}");
        }

        // convert response to RasterTimeseriesPolygonResponse
        var responseContent = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<RasterTimeseriesPolygonResponse>(responseContent);
    }
}