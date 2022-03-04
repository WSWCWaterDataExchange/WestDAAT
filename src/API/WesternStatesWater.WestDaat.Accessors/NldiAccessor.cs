using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Accessors
{
    public class NldiAccessor : AccessorBase, INldiAccessor
    {
        public NldiAccessor(NldiConfiguration configuration, IUsgsNldiSdk usgsNldiSdk, ILogger<NldiAccessor> logger) : base(logger)
        {
            _configuration = configuration;
            _usgsNldiSdk = usgsNldiSdk;
        }

        private readonly IUsgsNldiSdk _usgsNldiSdk;
        private readonly NldiConfiguration _configuration;
        private readonly Dictionary<NavigationMode, string> _featureTypes = new Dictionary<NavigationMode, string>()
        {
            { NavigationMode.UpstreamMain, "UpstreamMain" },
            { NavigationMode.UpstreamTributaries, "UpstreamTributaries" },
            { NavigationMode.DownstreamMain, "DownstreamMain" },
            { NavigationMode.DownstreamDiversions, "DownstreamDiversions" }
        };

        public async Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            using (new TimerLogger($"Getting NLDI Features [{latitude}] [{longitude}]", base.Logger))
            {
                if (directions == NldiDirections.None)
                {
                    return new FeatureCollection();
                }
                var coordinateFeatures = await _usgsNldiSdk.GetFeatureByCoordinates(latitude, longitude);
                if (!coordinateFeatures.Features[0].Properties.TryGetValue("comid", out var comidVal))
                {
                    throw new WestDaatException($"Unable to find comid for coordinates [{latitude}] [{longitude}]");
                }
                var comid = (comidVal as JsonElement?)?.GetString();
                if (string.IsNullOrWhiteSpace(comid))
                {
                    throw new WestDaatException($"Unable to find comid for coordinates [{latitude}] [{longitude}]");
                }
                var tasks = new List<Task<FeatureCollection>>();
                if (directions.HasFlag(NldiDirections.Upsteam))
                {
                    tasks.Add(GetFlowlines(comid, NavigationMode.UpstreamMain, _configuration.MaxUpstreamMainDistance));
                    tasks.Add(GetFlowlines(comid, NavigationMode.UpstreamTributaries, _configuration.MaxUpstreamTributaryDistance));
                }
                if (directions.HasFlag(NldiDirections.Downsteam))
                {
                    tasks.Add(GetFlowlines(comid, NavigationMode.DownstreamMain, _configuration.MaxDownstreamMainDistance));
                    tasks.Add(GetFlowlines(comid, NavigationMode.DownstreamDiversions, _configuration.MaxDownstreamDiversionDistance));
                }
                var featureCollections = await Task.WhenAll(tasks);
                return new FeatureCollection(featureCollections.SelectMany(a => a.Features).ToList());
            }

        }

        private async Task<FeatureCollection> GetFlowlines(string comid, NavigationMode navigationMode, int distanceInKm)
        {
            var result = await _usgsNldiSdk.GetFlowlines(comid, navigationMode, distanceInKm);
            result.Features.ForEach(a => a.Properties["westdaat_featuretype"] = _featureTypes[navigationMode]);
            return result;
        }
    }
}
