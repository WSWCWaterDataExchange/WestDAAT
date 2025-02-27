using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Utilities;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Accessors
{
    public class NldiAccessor : AccessorBase, INldiAccessor
    {
        private readonly IUsgsNldiSdk _usgsNldiSdk;
        private readonly NldiConfiguration _configuration;

        public NldiAccessor(
            NldiConfiguration configuration,
            IUsgsNldiSdk usgsNldiSdk,
            ILogger<NldiAccessor> logger)
            : base(logger)
        {
            _configuration = configuration;
            _usgsNldiSdk = usgsNldiSdk;
        }

        private readonly Dictionary<NavigationMode, string> _directionNames = new()
        {
            { NavigationMode.UpstreamMain, "Upstream" },
            { NavigationMode.UpstreamTributaries, "Upstream" },
            { NavigationMode.DownstreamMain, "Downstream" },
            { NavigationMode.DownstreamDiversions, "Downstream" }
        };

        private readonly Dictionary<NavigationMode, string> _channelTypes = new()
        {
            { NavigationMode.UpstreamMain, "Main" },
            { NavigationMode.UpstreamTributaries, "Arm" },
            { NavigationMode.DownstreamMain, "Main" },
            { NavigationMode.DownstreamDiversions, "Arm" }
        };

        private readonly Dictionary<FeatureDataSource, string> _pointFeatureDataSourceNames = new()
        {
            { FeatureDataSource.UsgsSurfaceWaterSites, "UsgsSurfaceWaterSite" },
            { FeatureDataSource.EpaWaterQualitySite, "EpaWaterQualitySite" },
            { FeatureDataSource.WadeRights, "WadeWaterRights" },
            { FeatureDataSource.WadeTimeseries, "WadeTimeseries" }
        };

        public async Task<FeatureCollection> GetNldiFeatures(
            double latitude,
            double longitude,
            NldiDirections directions,
            NldiDataPoints dataPoints)
        {
            using (new TimerLogger($"Getting NLDI Features [{latitude}] [{longitude}]", base.Logger))
            {
                var coordinateFeatures = await _usgsNldiSdk.GetFeatureByCoordinates(latitude, longitude);
                if (!coordinateFeatures.Features.Any()
                    || !coordinateFeatures.Features[0].Properties.TryGetValue("comid", out var comidVal))
                {
                    throw new WestDaatException($"Unable to find comid for [{latitude}, {longitude}]");
                }

                var comid = (comidVal as JsonElement?)?.GetString();
                if (string.IsNullOrWhiteSpace(comid))
                {
                    throw new WestDaatException($"No valid COMID found for [{latitude}, {longitude}]");
                }

                var tasks = new List<Task<FeatureCollection>>();

                if (directions.HasFlag(NldiDirections.Upsteam))
                {
                    tasks.Add(GetFlowlines(comid, NavigationMode.UpstreamMain, _configuration.MaxUpstreamMainDistance));
                    tasks.Add(GetFlowlines(comid, NavigationMode.UpstreamTributaries,
                        _configuration.MaxUpstreamTributaryDistance));

                    if (dataPoints.HasFlag(NldiDataPoints.Usgs))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamMain,
                            FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxUpstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamTributaries,
                            FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxUpstreamTributaryDistance));
                    }

                    if (dataPoints.HasFlag(NldiDataPoints.Epa))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamMain,
                            FeatureDataSource.EpaWaterQualitySite, _configuration.MaxUpstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamTributaries,
                            FeatureDataSource.EpaWaterQualitySite, _configuration.MaxUpstreamTributaryDistance));
                    }

                    if (dataPoints.HasFlag(NldiDataPoints.WadeRights))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.WadeRights,
                            _configuration.MaxUpstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamTributaries,
                            FeatureDataSource.WadeRights, _configuration.MaxUpstreamTributaryDistance));
                    }

                    if (dataPoints.HasFlag(NldiDataPoints.WadeTimeseries))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.WadeTimeseries,
                            _configuration.MaxUpstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.UpstreamTributaries,
                            FeatureDataSource.WadeTimeseries, _configuration.MaxUpstreamTributaryDistance));
                    }
                }

                if (directions.HasFlag(NldiDirections.Downsteam))
                {
                    tasks.Add(GetFlowlines(comid, NavigationMode.DownstreamMain,
                        _configuration.MaxDownstreamMainDistance));
                    tasks.Add(GetFlowlines(comid, NavigationMode.DownstreamDiversions,
                        _configuration.MaxDownstreamDiversionDistance));

                    if (dataPoints.HasFlag(NldiDataPoints.Usgs))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamMain,
                            FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxDownstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamDiversions,
                            FeatureDataSource.UsgsSurfaceWaterSites, _configuration.MaxDownstreamDiversionDistance));
                    }

                    if (dataPoints.HasFlag(NldiDataPoints.Epa))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamMain,
                            FeatureDataSource.EpaWaterQualitySite, _configuration.MaxDownstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamDiversions,
                            FeatureDataSource.EpaWaterQualitySite, _configuration.MaxDownstreamDiversionDistance));
                    }

                    if (dataPoints.HasFlag(NldiDataPoints.WadeRights))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.WadeRights,
                            _configuration.MaxDownstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamDiversions,
                            FeatureDataSource.WadeRights, _configuration.MaxDownstreamDiversionDistance));
                    }

                    if (dataPoints.HasFlag(NldiDataPoints.WadeTimeseries))
                    {
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamMain,
                            FeatureDataSource.WadeTimeseries, _configuration.MaxDownstreamMainDistance));
                        tasks.Add(GetPointFeatures(comid, NavigationMode.DownstreamDiversions,
                            FeatureDataSource.WadeTimeseries, _configuration.MaxDownstreamDiversionDistance));
                    }
                }

                tasks.Add(GetMainPoint(coordinateFeatures));

                var featureCollections = await Task.WhenAll(tasks);
                return new FeatureCollection(featureCollections.SelectMany(fc => fc.Features).ToList());
            }
        }

        private async Task<FeatureCollection> GetFlowlines(string comid, NavigationMode mode, int distanceInKm)
        {
            var directionName = _directionNames[mode];
            var channelType = _channelTypes[mode];

            var result = await _usgsNldiSdk.GetFlowlines(comid, mode, distanceInKm);
            result.Features.ForEach(a =>
            {
                a.Properties["westdaat_featuredatatype"] = "Flowline";
                a.Properties["westdaat_direction"] = directionName;
                a.Properties["westdaat_channeltype"] = channelType;
            });
            return result;
        }

        private async Task<FeatureCollection> GetPointFeatures(
            string comid,
            NavigationMode mode,
            FeatureDataSource dataSource,
            int distanceInKm)
        {
            var directionName = _directionNames[mode];
            var channelType = _channelTypes[mode];

            var labelForPoints = _pointFeatureDataSourceNames[dataSource];

            var result = await _usgsNldiSdk.GetFeatures(comid, mode, dataSource, distanceInKm);
            result.Features.ForEach(a =>
            {
                a.Properties["westdaat_featuredatatype"] = "Point";
                a.Properties["westdaat_direction"] = directionName;
                a.Properties["westdaat_channeltype"] = channelType;
                a.Properties["westdaat_pointdatasource"] = labelForPoints;
            });
            return result;
        }

        private Task<FeatureCollection> GetMainPoint(FeatureCollection coordinateFeatures)
        {
            var result = new FeatureCollection();

            if (coordinateFeatures.Features[0].Geometry is LineString ls)
            {
                var geoJsonlineString = JsonSerializer.Serialize(ls);
                var g1 = GeometryHelpers.GetGeometryByGeoJson(geoJsonlineString)
                    as NetTopologySuite.Geometries.LineString;

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