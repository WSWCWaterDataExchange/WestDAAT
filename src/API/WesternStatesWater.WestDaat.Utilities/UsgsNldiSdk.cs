using GeoJSON.Text.Feature;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Exceptions;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

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

        private readonly Dictionary<NavigationMode, string> _navigationModeStrings = new()
        {
            { NavigationMode.UpstreamMain, "UM" },
            { NavigationMode.UpstreamTributaries, "UT" },
            { NavigationMode.DownstreamMain, "DM" },
            { NavigationMode.DownstreamDiversions, "DD" }
        };

        private readonly Dictionary<FeatureDataSource, string> _featureDataSourceStrings = new()
        {
            { FeatureDataSource.UsgsSurfaceWaterSites, "nwissite" },
            { FeatureDataSource.EpaWaterQualitySite,   "WQP" },
        };

        public async Task<FeatureCollection> GetFeatureByCoordinates(double latitude, double longitude)
        {
            using (new TimerLogger($"Getting features by coordinates [{latitude}] [{longitude}]", _logger))
            {
                var query = new QueryBuilder();
                query.Add("coords", $"POINT({longitude} {latitude})");
                var uri = new Uri($"linked-data/comid/position{query}", UriKind.Relative);

                var response = await _httpClient.GetAsync(uri);
                return await ProcessFeatureCollectionResponse(response);
            }
        }

        public async Task<FeatureCollection> GetFlowlines(string comid, NavigationMode navigationMode, int distanceInKm)
        {
            using (new TimerLogger($"Getting flowlines [{comid}] [{navigationMode}] [{distanceInKm}]", _logger))
            {
                var query = new QueryBuilder();
                query.Add("distance", distanceInKm.ToString());

                var uri = new Uri(
                    $"linked-data/comid/{comid}/navigation/{_navigationModeStrings[navigationMode]}/flowlines{query}",
                    UriKind.Relative);

                var response = await _httpClient.GetAsync(uri);
                return await ProcessFeatureCollectionResponse(response);
            }
        }

        public async Task<FeatureCollection> GetFeatures(
            string comid,
            NavigationMode navigationMode,
            FeatureDataSource featureDataSource,
            int distanceInKm)
        {
            using (new TimerLogger($"Getting features [{comid}] [{navigationMode}] [{featureDataSource}] [{distanceInKm}]", _logger))
            {
                var query = new QueryBuilder();
                query.Add("distance", distanceInKm.ToString());

                if (featureDataSource == FeatureDataSource.WadeRights)
                {
                    var rightsUri = new Uri(
                        $"linked-data/comid/{comid}/navigation/{_navigationModeStrings[navigationMode]}/wade_rights{query}",
                        UriKind.Relative);

                    var rightsResponse = await _httpClient.GetAsync(rightsUri);
                    return await ProcessFeatureCollectionResponse(rightsResponse);
                }
                else if (featureDataSource == FeatureDataSource.WadeTimeseries)
                {
                    var timeseriesUri = new Uri(
                        $"linked-data/comid/{comid}/navigation/{_navigationModeStrings[navigationMode]}/wade_timeseries{query}",
                        UriKind.Relative);

                    var timeseriesResponse = await _httpClient.GetAsync(timeseriesUri);
                    return await ProcessFeatureCollectionResponse(timeseriesResponse);
                }
                else
                {
                    var endpoint = _featureDataSourceStrings[featureDataSource];
                    var uri = new Uri(
                        $"linked-data/comid/{comid}/navigation/{_navigationModeStrings[navigationMode]}/{endpoint}{query}",
                        UriKind.Relative);

                    var response = await _httpClient.GetAsync(uri);
                    return await ProcessFeatureCollectionResponse(response);
                }
            }
        }

        private async Task<FeatureCollection> ProcessFeatureCollectionResponse(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                throw new WestDaatException($"Invalid NLDI Response: [{(int)response.StatusCode} - {response.ReasonPhrase}] [{body}]");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(responseContent))
            {
                _logger.LogInformation("USGS NLDI Api returned a success status code but empty payload.");
                return new FeatureCollection();
            }
            try
            {
                return JsonSerializer.Deserialize<FeatureCollection>(responseContent) ?? new FeatureCollection();
            }
            catch
            {
                _logger.LogError($"Error deserializing NLDI Response: {responseContent}");
                throw;
            }
        }
    }
}
