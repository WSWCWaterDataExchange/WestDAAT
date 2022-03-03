
using GeoJSON.Text.Feature;

using GeoJSON.Text.Geometry;

using System.Text.Json;
using WesternStatesWater.WestDaat.Accessors;

using WesternStatesWater.WestDaat.Common.Configuration;

using WesternStatesWater.WestDaat.Common.Exceptions;

using WesternStatesWater.WestDaat.Utilities;



namespace WesternStatesWater.WestDaat.Tests.AccessorTests

{
    [TestClass]

    [TestCategory("Accessor Tests")]

    public class NldiAccessorTests : AccessorTestBase

    {

        private readonly Mock<IUsgsNldiSdk> _usgsNldiSdkMock = new Mock<IUsgsNldiSdk>(MockBehavior.Strict);



        [DataTestMethod]

        [DataRow(NldiDirections.None)]

        [DataRow(NldiDirections.Upsteam)]

        [DataRow(NldiDirections.Downsteam)]

        [DataRow(NldiDirections.Upsteam | NldiDirections.Downsteam)]

        public async Task GetNldiFeatures_Successful(NldiDirections directions)

        {

            var faker = new Faker();

            var latitude = faker.Random.Double(34, 46);

            var longitude = faker.Random.Double(-118, -100);

            var comid = faker.Random.AlphaNumeric(10);

            var config = Configuration.GetNldiConfiguration();



            var featureByCoordinatesResult = CreateFeatureByCoordinatesResult(comid);



            if (directions != NldiDirections.None)

            {

                _usgsNldiSdkMock.Setup(a => a.GetFeatureByCoordinates(latitude, longitude))

                            .ReturnsAsync(featureByCoordinatesResult)

                            .Verifiable();

            }



            var expectedFeatureCount = 0;

            if (directions.HasFlag(NldiDirections.Upsteam))

            {

                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.UpstreamMain, config.MaxUpstreamMainDistance))

                            .ReturnsAsync(CreateFlowlinesResult(1))

                            .Verifiable();



                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.UpstreamTributaries, config.MaxUpstreamTributaryDistance))

                            .ReturnsAsync(CreateFlowlinesResult(5))

                            .Verifiable();

                expectedFeatureCount += 6;

            }



            if (directions.HasFlag(NldiDirections.Downsteam))

            {

                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamMain, config.MaxDownstreamMainDistance))

                            .ReturnsAsync(CreateFlowlinesResult(2))

                            .Verifiable();



                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamDiversions, config.MaxDownstreamDiversionDistance))

                            .ReturnsAsync(CreateFlowlinesResult(3))

                            .Verifiable();



                expectedFeatureCount += 5;

            }



            var sut = CreateNldiAccessor();

            var result = await sut.GetNldiFeatures(latitude, longitude, directions, NldiDataPoints.None);



            _usgsNldiSdkMock.VerifyAll();



            result.Should().NotBeNull();

            result.Features.Should().HaveCount(expectedFeatureCount);

            if (directions.HasFlag(NldiDirections.Upsteam))

            {

                result.Features.Count(a => a.Properties["westdaat_featuretype"] as string == "UpstreamMain").Should().Be(1);

                result.Features.Count(a => a.Properties["westdaat_featuretype"] as string == "UpstreamTributaries").Should().Be(5);

            }



            if (directions.HasFlag(NldiDirections.Downsteam))

            {

                result.Features.Count(a => a.Properties["westdaat_featuretype"] as string == "DownstreamMain").Should().Be(2);

                result.Features.Count(a => a.Properties["westdaat_featuretype"] as string == "DownstreamDiversions").Should().Be(3);

            }

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

                            .ReturnsAsync(CreateFlowlinesResult(1))

                            .Verifiable();



                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.UpstreamTributaries, config.MaxUpstreamTributaryDistance))

                            .ReturnsAsync(CreateFlowlinesResult(5))

                            .Verifiable();



                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamMain, config.MaxDownstreamMainDistance))

                            .ReturnsAsync(CreateFlowlinesResult(2))

                            .Verifiable();



                _usgsNldiSdkMock.Setup(a => a.GetFlowlines(comid, NavigationMode.DownstreamDiversions, config.MaxDownstreamDiversionDistance))

                            .ReturnsAsync(CreateFlowlinesResult(3))

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

            var properties = new Dictionary<string, object>();

            if (comid != null)

            {

                properties.Add("comid", JsonSerializer.SerializeToElement(comid));

            }



            return new FeatureCollection(

                new List<Feature>

                {

                    new Feature

                    {

                        Properties = properties

                    }

                }

            );

        }



        private FeatureCollection CreateFlowlinesResult(int featureCount)

        {

            var features = Enumerable.Range(0, featureCount)

                    .Select(i => new Feature(new LineString(GetLineStringCoordinates(5))))

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
