﻿using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using System.Text.Json;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class NldiAccessorTests : AccessorTestBase
    {
        private readonly Mock<IUsgsNldiSdk> _usgsNldiSdkMock = new Mock<IUsgsNldiSdk>(MockBehavior.Strict);

        [DataTestMethod]
        [DataRow(NldiDirections.None, NldiDataPoints.None)]
        [DataRow(NldiDirections.None, NldiDataPoints.Usgs)]
        [DataRow(NldiDirections.None, NldiDataPoints.Epa)]
        [DataRow(NldiDirections.None, NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.None, NldiDataPoints.Usgs | NldiDataPoints.Epa)]
        [DataRow(NldiDirections.None, NldiDataPoints.Usgs | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.None, NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.None, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.None)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Usgs)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Epa)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Usgs | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.None)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Usgs)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Epa)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.None)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Usgs)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Epa)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeRights)]
        [DataRow(NldiDirections.None, NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.None, NldiDataPoints.Usgs | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.None, NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.None, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Usgs | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.Usgs | NldiDataPoints.Epa | NldiDataPoints.WadeTimeseries)]
        public async Task GetNldiFeatures_Successful(NldiDirections directions, NldiDataPoints dataPoints)
        {
            var faker = new Faker();
            var latitude = faker.Random.Double(34, 46);
            var longitude = faker.Random.Double(-118, -100);
            var comid = faker.Random.AlphaNumeric(10);
            var config = Configuration.GetNldiConfiguration();

            var featureByCoordinatesResult = CreateFeatureByCoordinatesResult(comid);

            _usgsNldiSdkMock.Setup(a => a.GetFeatureByCoordinates(latitude, longitude))
                            .ReturnsAsync(featureByCoordinatesResult)
                            .Verifiable();

            var expectedFeatureCount = 1; // 1 for main point
            var expectedFlowlineCount = 0;
            var expectedPointCount = 1; // 1 for main point
            var expectedMainCount = 0;
            var expectedArmCount = 0;
            var expectedUpstreamCount = 0;
            var expectedDownstreamCount = 0;
            var expectedUsgsCount = 0;
            var expectedEpaCount = 0;
            var expectedWadeRightsCount = 0;
            var expectedWadeTimeseriesCount = 0;

            if (directions.HasFlag(NldiDirections.Upsteam))
            {
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.UpstreamMain, config.MaxUpstreamMainDistance))
                                .ReturnsAsync(CreateFlowlinesResult(1, "Flowline"))
                                .Verifiable();
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.UpstreamTributaries, config.MaxUpstreamTributaryDistance))
                                .ReturnsAsync(CreateFlowlinesResult(5, "Flowline"))
                                .Verifiable();
                expectedFeatureCount += 6;
                expectedFlowlineCount += 6;
                expectedMainCount += 1;
                expectedArmCount += 5;
                expectedUpstreamCount += 6;

                if (dataPoints.HasFlag(NldiDataPoints.Usgs))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.UsgsSurfaceWaterSites, config.MaxUpstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(6, "UsgsSurfaceWaterSite"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamTributaries, FeatureDataSource.UsgsSurfaceWaterSites, config.MaxUpstreamTributaryDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(7, "UsgsSurfaceWaterSite"))
                                    .Verifiable();
                    expectedFeatureCount += 13;
                    expectedPointCount += 13;
                    expectedMainCount += 6;
                    expectedArmCount += 7;
                    expectedUpstreamCount += 13;
                    expectedUsgsCount += 13;
                }
                if (dataPoints.HasFlag(NldiDataPoints.Epa))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.EpaWaterQualitySite, config.MaxUpstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(8, "EpaWaterQualitySite"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamTributaries, FeatureDataSource.EpaWaterQualitySite, config.MaxUpstreamTributaryDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(9, "EpaWaterQualitySite"))
                                    .Verifiable();
                    expectedFeatureCount += 17;
                    expectedPointCount += 17;
                    expectedMainCount += 8;
                    expectedArmCount += 9;
                    expectedUpstreamCount += 17;
                    expectedEpaCount += 17;
                }
                if (dataPoints.HasFlag(NldiDataPoints.WadeRights))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.WadeRights, config.MaxUpstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(10, "WadeRights"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamTributaries, FeatureDataSource.WadeRights, config.MaxUpstreamTributaryDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(11, "WadeRights"))
                                    .Verifiable();
                    expectedFeatureCount += 21;
                    expectedPointCount += 21;
                    expectedMainCount += 10;
                    expectedArmCount += 11;
                    expectedUpstreamCount += 21;
                    expectedWadeRightsCount += 21;
                }
                if (dataPoints.HasFlag(NldiDataPoints.WadeTimeseries))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamMain, FeatureDataSource.WadeTimeseries, config.MaxUpstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(10, "WadeTimeseries"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.UpstreamTributaries, FeatureDataSource.WadeTimeseries, config.MaxUpstreamTributaryDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(11, "WadeTimeseries"))
                                    .Verifiable();
                    expectedFeatureCount += 21;
                    expectedPointCount += 21;
                    expectedMainCount += 10;
                    expectedArmCount += 11;
                    expectedUpstreamCount += 21;
                    expectedWadeTimeseriesCount += 21;
                }
            }

            if (directions.HasFlag(NldiDirections.Downsteam))
            {
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamMain, config.MaxDownstreamMainDistance))
                                .ReturnsAsync(CreateFlowlinesResult(2, "Flowline"))
                                .Verifiable();
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamDiversions, config.MaxDownstreamDiversionDistance))
                                .ReturnsAsync(CreateFlowlinesResult(3, "Flowline"))
                                .Verifiable();
                expectedFeatureCount += 5;
                expectedFlowlineCount += 5;
                expectedMainCount += 2;
                expectedArmCount += 3;
                expectedDownstreamCount += 5;

                if (dataPoints.HasFlag(NldiDataPoints.Usgs))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.UsgsSurfaceWaterSites, config.MaxDownstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(12, "UsgsSurfaceWaterSite"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamDiversions, FeatureDataSource.UsgsSurfaceWaterSites, config.MaxDownstreamDiversionDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(13, "UsgsSurfaceWaterSite"))
                                    .Verifiable();
                    expectedFeatureCount += 25;
                    expectedPointCount += 25;
                    expectedMainCount += 12;
                    expectedArmCount += 13;
                    expectedDownstreamCount += 25;
                    expectedUsgsCount += 25;
                }
                if (dataPoints.HasFlag(NldiDataPoints.Epa))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.EpaWaterQualitySite, config.MaxDownstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(14, "EpaWaterQualitySite"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamDiversions, FeatureDataSource.EpaWaterQualitySite, config.MaxDownstreamDiversionDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(15, "EpaWaterQualitySite"))
                                    .Verifiable();
                    expectedFeatureCount += 29;
                    expectedPointCount += 29;
                    expectedMainCount += 14;
                    expectedArmCount += 15;
                    expectedDownstreamCount += 29;
                    expectedEpaCount += 29;
                }
                if (dataPoints.HasFlag(NldiDataPoints.WadeRights))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.WadeRights, config.MaxDownstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(16, "WadeRights"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamDiversions, FeatureDataSource.WadeRights, config.MaxDownstreamDiversionDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(17, "WadeRights"))
                                    .Verifiable();
                    expectedFeatureCount += 33;
                    expectedPointCount += 33;
                    expectedMainCount += 16;
                    expectedArmCount += 17;
                    expectedDownstreamCount += 33;
                    expectedWadeRightsCount += 33;
                }
                if (dataPoints.HasFlag(NldiDataPoints.WadeTimeseries))
                {
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamMain, FeatureDataSource.WadeTimeseries, config.MaxDownstreamMainDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(16, "WadeTimeseries"))
                                    .Verifiable();
                    _usgsNldiSdkMock.Setup(a => a.GetFeatures(comid, NavigationMode.DownstreamDiversions, FeatureDataSource.WadeTimeseries, config.MaxDownstreamDiversionDistance))
                                    .ReturnsAsync(CreateFlowlinesResult(17, "WadeTimeseries"))
                                    .Verifiable();
                    expectedFeatureCount += 33;
                    expectedPointCount += 33;
                    expectedMainCount += 16;
                    expectedArmCount += 17;
                    expectedDownstreamCount += 33;
                    expectedWadeTimeseriesCount += 33;
                }
            }

            var sut = CreateNldiAccessor();
            var result = await sut.GetNldiFeatures(latitude, longitude, directions, dataPoints);

            _usgsNldiSdkMock.VerifyAll();

            result.Should().NotBeNull();
            result.Features.Should().HaveCount(expectedFeatureCount);
            result.Features.Count(a => a.Properties["westdaat_featuredatatype"] as string == "Flowline").Should().Be(expectedFlowlineCount);
            result.Features.Count(a => a.Properties["westdaat_featuredatatype"] as string == "Point").Should().Be(expectedPointCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_direction") && a.Properties["westdaat_direction"] as string == "Upstream").Should().Be(expectedUpstreamCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_direction") && a.Properties["westdaat_direction"] as string == "Downstream").Should().Be(expectedDownstreamCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_channeltype") && a.Properties["westdaat_channeltype"] as string == "Main").Should().Be(expectedMainCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_channeltype") && a.Properties["westdaat_channeltype"] as string == "Arm").Should().Be(expectedArmCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_pointdatasource") && a.Properties["westdaat_pointdatasource"] as string == "UsgsSurfaceWaterSite").Should().Be(expectedUsgsCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_pointdatasource") && a.Properties["westdaat_pointdatasource"] as string == "EpaWaterQualitySite").Should().Be(expectedEpaCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_pointdatasource") && a.Properties["westdaat_pointdatasource"] as string == "WadeWaterRights").Should().Be(expectedWadeRightsCount);
            result.Features.Count(a => a.Properties.ContainsKey("westdaat_pointdatasource") && a.Properties["westdaat_pointdatasource"] as string == "WadeTimeseries").Should().Be(expectedWadeTimeseriesCount);
        }

        [DataTestMethod]
        [DataRow(null, true)]
        [DataRow("", true)]
        [DataRow(" ", true)]
        [DataRow("\t", true)]
        [DataRow("comid", false)]
        public async Task GetNldiFeatures_Comid(string comid, bool shouldError)
        {
            var faker = new Faker();
            var latitude = faker.Random.Double(34, 46);
            var longitude = faker.Random.Double(-118, -100);
            var config = Configuration.GetNldiConfiguration();

            var featureByCoordinatesResult = CreateFeatureByCoordinatesResult(comid);
            _usgsNldiSdkMock.Setup(a => a.GetFeatureByCoordinates(latitude, longitude))
                            .ReturnsAsync(featureByCoordinatesResult)
                            .Verifiable();

            if (!shouldError)
            {
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.UpstreamMain, config.MaxUpstreamMainDistance))
                                .ReturnsAsync(CreateFlowlinesResult(1, "Flowline"))
                                .Verifiable();
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.UpstreamTributaries, config.MaxUpstreamTributaryDistance))
                                .ReturnsAsync(CreateFlowlinesResult(5, "Flowline"))
                                .Verifiable();
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamMain, config.MaxDownstreamMainDistance))
                                .ReturnsAsync(CreateFlowlinesResult(2, "Flowline"))
                                .Verifiable();
                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamDiversions, config.MaxDownstreamDiversionDistance))
                                .ReturnsAsync(CreateFlowlinesResult(3, "Flowline"))
                                .Verifiable();
            }

            var sut = CreateNldiAccessor();

            if (shouldError)
            {
                Func<Task> call = async () => await sut.GetNldiFeatures(latitude, longitude, NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.None);
                await call.Should().ThrowAsync<WestDaatException>();
            }
            else
            {
                var result = await sut.GetNldiFeatures(latitude, longitude, NldiDirections.Upsteam | NldiDirections.Downsteam, NldiDataPoints.None);
                result.Should().NotBeNull();
            }
            _usgsNldiSdkMock.VerifyAll();
        }

        private FeatureCollection CreateFeatureByCoordinatesResult(string comid)
        {
            var result = CreateFlowlinesResult(1, "Point");
            if (comid != null)
            {
                result.Features[0].Properties.Add("comid", JsonSerializer.SerializeToElement(comid));
            }
            return result;
        }

        private FeatureCollection CreateFlowlinesResult(int featureCount, string dataSource = null)
        {
            var features = Enumerable.Range(0, featureCount)
                                     .Select(i =>
                                     {
                                         var feature = new Feature(new LineString(GetLineStringCoordinates(5)));
                                         if (dataSource != null)
                                         {
                                             if (dataSource == "Flowline")
                                             {
                                                 feature.Properties["westdaat_featuredatatype"] = "Flowline";
                                             }
                                             else
                                             {
                                                 feature.Properties["westdaat_pointdatasource"] = dataSource;
                                                 feature.Properties["westdaat_featuredatatype"] = "Point";
                                             }
                                         }
                                         return feature;
                                     })
                                     .ToList();
            return new FeatureCollection(features);
        }

        private IEnumerable<IEnumerable<double>> GetLineStringCoordinates(int count)
        {
            var faker = new Faker();
            var currentLatitude = faker.Random.Double(34, 46);
            var currentLongitude = faker.Random.Double(-118, -100);
            for (var i = 0; i < count; i++)
            {
                yield return new List<double> { currentLongitude, currentLatitude };
                currentLatitude += faker.Random.Double(-.01, .01);
                currentLongitude += faker.Random.Double(-.01, .01);
            }
        }

        private NldiAccessor CreateNldiAccessor()
        {
            return new NldiAccessor(Configuration.GetNldiConfiguration(), _usgsNldiSdkMock.Object, CreateLogger<NldiAccessor>());
        }
    }
}