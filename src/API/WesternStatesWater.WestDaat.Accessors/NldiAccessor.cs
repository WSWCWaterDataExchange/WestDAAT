using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using Microsoft.Extensions.Logging;
using System.IO;
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
        private readonly Dictionary<NavigationMode, string> _directionNames = new Dictionary<NavigationMode, string>()
        {
            { NavigationMode.UpstreamMain, "Upstream" },
            { NavigationMode.UpstreamTributaries, "Upstream" },
            { NavigationMode.DownstreamMain, "Downstream" },
            { NavigationMode.DownstreamDiversions, "Downstream" }
        };
        private readonly Dictionary<NavigationMode, string> _channelTypes = new Dictionary<NavigationMode, string>()
        {
            { NavigationMode.UpstreamMain, "Main" },
            { NavigationMode.UpstreamTributaries, "Arm" },
            { NavigationMode.DownstreamMain, "Main" },
            { NavigationMode.DownstreamDiversions, "Arm" }
        };
        private readonly Dictionary<FeatureDataSource, string> _pointFeatureDataSourceNames = new Dictionary<FeatureDataSource, string>()
        {
            { FeatureDataSource.UsgsSurfaceWaterSites, "UsgsSurfaceWaterSite" },
            { FeatureDataSource.EpaWaterQualitySite, "EpaWaterQualitySite" },
            { FeatureDataSource.Wade, "Wade" },
        };

        public async Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            using (new TimerLogger($"Getting NLDI Features [{latitude}] [{longitude}]", base.Logger))
            {
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
                tasks.Add(GetMainPoint(coordinateFeatures));
                var featureCollections = await Task.WhenAll(tasks);
                return new FeatureCollection(featureCollections.SelectMany(a => a.Features).ToList());
            }
        }

        private async Task<FeatureCollection> GetFlowlines(string comid, NavigationMode navigationMode, int distanceInKm)
        {
            var directionName = _directionNames[navigationMode];
            var channelType = _channelTypes[navigationMode];
            var result = await _usgsNldiSdk.GetFlowlines(comid, navigationMode, distanceInKm);
            result.Features.ForEach(a =>
            {
                a.Properties["westdaat_featuredatatype"] = "Flowline";
                a.Properties["westdaat_direction"] = directionName;
                a.Properties["westdaat_channeltype"] = channelType;
            });
            return result;
        }

        private async Task<FeatureCollection> GetPointFeatures(string comid, NavigationMode navigationMode, FeatureDataSource featureDataSource, int distanceInKm)
        {
            var directionName = _directionNames[navigationMode];
            var channelType = _channelTypes[navigationMode];
            var dataSource = _pointFeatureDataSourceNames[featureDataSource];
            var result = await _usgsNldiSdk.GetFeatures(comid, navigationMode, featureDataSource, distanceInKm);
            result.Features.ForEach(a =>
            {
                a.Properties["westdaat_featuredatatype"] = "Point";
                a.Properties["westdaat_direction"] = directionName;
                a.Properties["westdaat_channeltype"] = channelType;
                a.Properties["westdaat_pointdatasource"] = dataSource;
            });
            return result;
        }

        private Task<FeatureCollection> GetMainPoint(FeatureCollection coordinateFeatures)
        {
            var result = new FeatureCollection();
            if (coordinateFeatures.Features[0].Geometry is LineString ls)
            {
                var geoJsonlineString = JsonSerializer.Serialize(ls);
                var g1 = GeometryHelpers.GetGeometryByGeoJson(geoJsonlineString) as NetTopologySuite.Geometries.LineString;

                var ll = NetTopologySuite.LinearReferencing.LengthLocationMap.GetLocation(g1, g1.Length / 2);
                var c = ll.GetCoordinate(g1);
                result.Features.Add(new Feature(new Point(new Position(c.Y, c.X))));
                result.Features[0].Properties["westdaat_featuredatatype"] = "Point";
                result.Features[0].Properties["westdaat_pointdatasource"] = "Location";
            }
            else
            {
                var geoJsonString = JsonSerializer.Serialize(coordinateFeatures.Features[0].Geometry);
                var g1 = GeometryHelpers.GetGeometryByGeoJson(geoJsonString);

                var c = g1.Centroid;
                result.Features.Add(new Feature(new Point(new Position(c.Y, c.X))));
                result.Features[0].Properties["westdaat_featuredatatype"] = "Point";
                result.Features[0].Properties["westdaat_pointdatasource"] = "Location";
            }
            return Task.FromResult(result);
        }
    }
}
