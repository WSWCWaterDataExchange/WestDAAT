using GeoJSON.Text.Feature;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class UsgsNldiSdk : IUsgsNldiSdk
    {
        public UsgsNldiSdk(HttpClient httpClient, ILogger<UsgsNldiSdk> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        private readonly HttpClient _httpClient;
        private readonly ILogger _logger;
        private readonly Dictionary<NavigationMode, string> _navigationModeStrings = new Dictionary<NavigationMode, string>()
        {
            { NavigationMode.UpstreamMain, "UM" },
            { NavigationMode.UpstreamTributaries, "UT" },
            { NavigationMode.DownstreamMain, "DM" },
            { NavigationMode.DownstreamDiversions, "DD" }
        };
        private readonly Dictionary<FeatureDataSource, string> _featureDataSourceStrings = new Dictionary<FeatureDataSource, string>()
        {
            { FeatureDataSource.UsgsSurfaceWaterSites, "nwissite" },
            { FeatureDataSource.EpaWaterQualitySite, "WQP" },
            { FeatureDataSource.Wade, "wade" }
        };

        public async Task<FeatureCollection> GetFeatureByCoordinates(double latitude, double longitude)
        {
            using (new TimerLogger($"Getting features by coordinates [{latitude}] [{longitude}]", _logger))
            {
                var query = new QueryBuilder();
                query.Add("coords", $"POINT({longitude} {latitude})");
                var response = await _httpClient.GetAsync(new Uri($"linked-data/comid/position{query}", UriKind.Relative));
                return await ProcessFeatureCollectionResponse(response);
            }
        }

        public async Task<FeatureCollection> GetFlowlines(string comid, NavigationMode navigationMode, int distanceInKm)
        {
            using (new TimerLogger($"Getting flowlines [{comid}] [{navigationMode}] [{distanceInKm}]", _logger))
            {
                var query = new QueryBuilder();
                query.Add("distance", distanceInKm.ToString());
                var response = await _httpClient.GetAsync(new Uri($"linked-data/comid/{comid}/navigation/{_navigationModeStrings[navigationMode]}/flowlines{query}", UriKind.Relative));
                return await ProcessFeatureCollectionResponse(response);
            }
        }

        public async Task<FeatureCollection> GetFeatures(string comid, NavigationMode navigationMode, FeatureDataSource featureDataSource, int distanceInKm)
        {
            using (new TimerLogger($"Getting features [{comid}] [{navigationMode}] [{featureDataSource}] [{distanceInKm}]", _logger))
            {
                var query = new QueryBuilder();
                query.Add("distance", distanceInKm.ToString());
                var response = await _httpClient.GetAsync(new Uri($"linked-data/comid/{comid}/navigation/{_navigationModeStrings[navigationMode]}/{_featureDataSourceStrings[featureDataSource]}{query}", UriKind.Relative));
                return await ProcessFeatureCollectionResponse(response);
            }
        }

        private async Task<FeatureCollection> ProcessFeatureCollectionResponse(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                throw new WestDaatException($"Invalid NLDI Response Code [{(int)response.StatusCode} - {response.ReasonPhrase}] [{await response.Content.ReadAsStringAsync()}]");
            }
            var responseContent = await response.Content.ReadAsStringAsync();
            if(string.IsNullOrWhiteSpace(responseContent))
            {
                _logger.LogInformation($"USGS NLDI Api returned a success status code but no payload.");
                return new FeatureCollection();
            }
            try
            {
                return JsonSerializer.Deserialize<FeatureCollection>(responseContent);
            }
            catch (Exception)
            {
                _logger.LogError($"Error deserializing NLDI Response [{responseContent}]");
                throw;
            }
        }
    }
}
