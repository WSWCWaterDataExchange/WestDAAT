using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Contracts;
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
        private readonly Dictionary<NavigationMode, string> _navigationModeName = new Dictionary<NavigationMode, string>()
        {
            { NavigationMode.UpstreamMain, "Main.Upstream" },
            { NavigationMode.UpstreamTributaries, "Tributary.Upstream" },
            { NavigationMode.DownstreamMain, "Main.Downstream" },
            { NavigationMode.DownstreamDiversions, "Tributary.Downstream" }
        };
        private readonly Dictionary<FeatureDataSource, string> _featureDataSourceName = new Dictionary<FeatureDataSource, string>()
        {
            { FeatureDataSource.UsgsSurfaceWaterSites, "UsgsSurfaceWaterSite" },
            { FeatureDataSource.EpaWaterQualitySite, "EpaWaterQualitySite" },
            { FeatureDataSource.Wade, "Wade" },
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
                    if (dataPoints.HasFlag(NldiDataPoints.Usgs))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxUpstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamTributaries, FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxUpstreamTributaryDistance));
                    }
                    if (dataPoints.HasFlag(NldiDataPoints.Epa))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.EpaWaterQualitySite, _configuration.MaxUpstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamTributaries, FeatureDataSource.EpaWaterQualitySite, _configuration.MaxUpstreamTributaryDistance));
                    }
                    if (dataPoints.HasFlag(NldiDataPoints.Wade))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.Wade, _configuration.MaxUpstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamTributaries, FeatureDataSource.Wade, _configuration.MaxUpstreamTributaryDistance));
                    }
                }
                if (directions.HasFlag(NldiDirections.Downsteam))
                {
                    tasks.Add(GetFlowlines(comid, NavigationMode.DownstreamMain, _configuration.MaxDownstreamMainDistance));
                    tasks.Add(GetFlowlines(comid, NavigationMode.DownstreamDiversions, _configuration.MaxDownstreamDiversionDistance));
                    if (dataPoints.HasFlag(NldiDataPoints.Usgs))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxDownstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamDiversions, FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxDownstreamDiversionDistance));
                    }
                    if (dataPoints.HasFlag(NldiDataPoints.Epa))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.EpaWaterQualitySite, _configuration.MaxDownstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamDiversions, FeatureDataSource.EpaWaterQualitySite, _configuration.MaxDownstreamDiversionDistance));
                    }
                    if (dataPoints.HasFlag(NldiDataPoints.Wade))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.Wade, _configuration.MaxDownstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamDiversions, FeatureDataSource.Wade, _configuration.MaxDownstreamDiversionDistance));
                    }
                }
                var featureCollections = await Task.WhenAll(tasks);
                return new FeatureCollection(featureCollections.SelectMany(a => a.Features).ToList());
            }
        }

        private string GetFlowlineFeatureName(NavigationMode navigationMode)
        {
            return $"Flowline.{GetNavigationModeName(navigationMode)}";
        }

        private string GetPointFeatureName(NavigationMode navigationMode, FeatureDataSource featureDataSource)
        {
            return $"Point.{GetFeatureDataSourceName(featureDataSource)}.{GetNavigationModeName(navigationMode)}";
        }

        private string GetNavigationModeName(NavigationMode navigationMode)
        {
            return _navigationModeName[navigationMode];
        }

        private string GetFeatureDataSourceName(FeatureDataSource featureDataSource)
        {
            return _featureDataSourceName[featureDataSource];
        }

        private async Task<FeatureCollection> GetFlowlines(string comid, NavigationMode navigationMode, int distanceInKm)
        {
            var featureName = GetFlowlineFeatureName(navigationMode);
            var result = await _usgsNldiSdk.GetFlowlines(comid, navigationMode, distanceInKm);
            result.Features.ForEach(a => a.Properties["westdaat_feature"] = featureName);
            return result;
        }

        private async Task<FeatureCollection> GetPointFeatures(string comid, NavigationMode navigationMode, FeatureDataSource featureDataSource, int distanceInKm)
        {
            var featureName = GetPointFeatureName(navigationMode, featureDataSource);
            var result = await _usgsNldiSdk.GetFeatures(comid, navigationMode, featureDataSource, distanceInKm);
            result.Features.ForEach(a => a.Properties["westdaat_feature"] = featureName);
            return result;
        }
    }
}
