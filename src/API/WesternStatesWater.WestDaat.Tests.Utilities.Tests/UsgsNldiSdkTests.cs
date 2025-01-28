using GeoJSON.Text.Geometry;
using RichardSzalay.MockHttp;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests
{
    [TestClass]
    public class UsgsNldiSdkTests : UtilityTestBase
    {
        [DataTestMethod]
        [DataRow(38.4, 95.5, "coords=POINT%2895.5%2038.4%29")]
        [DataRow(38.4, -95.5, "coords=POINT%28-95.5%2038.4%29")]
        [DataRow(-38.4, 95.5, "coords=POINT%2895.5%20-38.4%29")]
        [DataRow(-38.4, -95.5, "coords=POINT%28-95.5%20-38.4%29")]
        [DataRow(0, -95.5, "coords=POINT%28-95.5%200%29")]
        [DataRow(38.4, 0, "coords=POINT%280%2038.4%29")]
        [DataRow(0, 0, "coords=POINT%280%200%29")]
        [DataRow(38, -95, "coords=POINT%28-95%2038%29")]
        public async Task GetFeatureByCoordinates_Parametertizes(double latitude, double longitude, string expectedParams)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When($"https://fakeserver/path/linked-data/comid/position?{expectedParams}")
                    .Respond("application/json", "{}");

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            var result = await sut.GetFeatureByCoordinates(latitude, longitude);

            result.Should().NotBeNull();
            result.Features.Should().BeEmpty();
        }

        [DataTestMethod]
        [GetFeatureByCoordinatesValidJsonTestDataSourceAttribute]
        public async Task GetFeatureByCoordinates_ReturnsSuccess_ValidJson(string json, int[] coordinatesCounts, int[] propertiesCounts)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When("https://fakeserver/path/linked-data/comid/position?coords=POINT%28-95.5%2038.4%29")
                    .Respond("application/json", json);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            var result = await sut.GetFeatureByCoordinates(38.4, -95.5);

            result.Should().NotBeNull();
            result.Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.FeatureCollection);
            result.Features.Should().HaveCount(coordinatesCounts.Length);
            for (var i = 0; i < coordinatesCounts.Length; i++)
            {
                result.Features[i].Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.Feature);
                result.Features[i].Geometry.Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.LineString);
                result.Features[i].Geometry.Should().BeOfType<LineString>().Which
                                  .Coordinates.Should().HaveCount(coordinatesCounts[i]);
                result.Features[i].Properties.Should().HaveCount(propertiesCounts[i]);
            }
        }

        [DataTestMethod]
        [DataRow("I'm not JSON")]
        [DataRow("{I'm not JSON}")]
        [DataRow("1234")]
        public async Task GetFeatureByCoordinates_ReturnsSuccess_InvalidJsonString(string invalidJsonString)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When("https://fakeserver/path/linked-data/comid/position?coords=POINT%28-95.5%2038.4%29")
                    .Respond("application/json", invalidJsonString);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            Func<Task> call = async () => await sut.GetFeatureByCoordinates(38.4, -95.5);
            await call.Should().ThrowAsync<JsonException>();
        }

        [DataTestMethod]
        [DataRow(HttpStatusCode.BadRequest, null)]
        [DataRow(HttpStatusCode.BadRequest, "")]
        [DataRow(HttpStatusCode.BadRequest, "error message")]
        [DataRow(HttpStatusCode.InternalServerError, null)]
        [DataRow(HttpStatusCode.InternalServerError, "")]
        [DataRow(HttpStatusCode.InternalServerError, "error message")]
        public async Task GetFeatureByCoordinates_ReturnsError(HttpStatusCode statusCode, string bodyContent)
        {
            var mockHttp = new MockHttpMessageHandler();
            var content = bodyContent != null ? new StringContent(bodyContent) : null;
            mockHttp.When("https://fakeserver/path/linked-data/comid/position?coords=POINT%28-95.5%2038.4%29")
                    .Respond(HttpStatusCode.BadRequest, content);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            Func<Task> call = async () => await sut.GetFeatureByCoordinates(38.4, -95.5);
            await call.Should().ThrowAsync<WestDaatException>();
        }

        [DataTestMethod]
        [DataRow("comidvalue", NavigationMode.UpstreamMain, 9, "linked-data/comid/comidvalue/navigation/UM/flowlines?distance=9")]
        [DataRow("<>", NavigationMode.UpstreamTributaries, 0, "linked-data/comid/%3C%3E/navigation/UT/flowlines?distance=0")]
        [DataRow("<bananas&oranges>", NavigationMode.DownstreamMain, -1, "linked-data/comid/%3Cbananas&oranges%3E/navigation/DM/flowlines?distance=-1")]
        [DataRow("@home", NavigationMode.DownstreamDiversions, 15, "linked-data/comid/@home/navigation/DD/flowlines?distance=15")]
        public async Task GetFlowlines_Parametertizes(string comid, NavigationMode navigationMode, int distanceInKm, string expectedUrl)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When($"https://fakeserver/path/{expectedUrl}")
                    .Respond("application/json", "{}");

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            var result = await sut.GetFlowlines(comid, navigationMode, distanceInKm);

            result.Should().NotBeNull();
            result.Features.Should().BeEmpty();
        }

        [DataTestMethod]
        [GetFlowlinesValidJsonTestDataSource]
        public async Task GetFlowlines_ReturnsSuccess_ValidJson(string json, int[] coordinatesCounts, int[] propertiesCounts)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When("https://fakeserver/path/linked-data/comid/comidvalue/navigation/UM/flowlines?distance=50")
                    .Respond("application/json", json);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            var result = await sut.GetFlowlines("comidvalue", NavigationMode.UpstreamMain, 50);

            result.Should().NotBeNull();
            result.Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.FeatureCollection);
            result.Features.Should().HaveCount(coordinatesCounts.Length);
            for (var i = 0; i < coordinatesCounts.Length; i++)
            {
                result.Features[i].Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.Feature);
                result.Features[i].Geometry.Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.LineString);
                result.Features[i].Geometry.Should().BeOfType<LineString>().Which
                                  .Coordinates.Should().HaveCount(coordinatesCounts[i]);
                result.Features[i].Properties.Should().HaveCount(propertiesCounts[i]);
            }
        }

        [DataTestMethod]
        [DataRow("I'm not JSON")]
        [DataRow("{I'm not JSON}")]
        [DataRow("1234")]
        public async Task GetFlowlines_ReturnsSuccess_InvalidJsonString(string invalidJsonString)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When("https://fakeserver/path/linked-data/comid/comidvalue/navigation/UM/flowlines?distance=50")
                    .Respond("application/json", invalidJsonString);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            Func<Task> call = async () => await sut.GetFlowlines("comidvalue", NavigationMode.UpstreamMain, 50);
            await call.Should().ThrowAsync<JsonException>();
        }

        [DataTestMethod]
        [DataRow(HttpStatusCode.BadRequest, null)]
        [DataRow(HttpStatusCode.BadRequest, "")]
        [DataRow(HttpStatusCode.BadRequest, "error message")]
        [DataRow(HttpStatusCode.InternalServerError, null)]
        [DataRow(HttpStatusCode.InternalServerError, "")]
        [DataRow(HttpStatusCode.InternalServerError, "error message")]
        public async Task GetFlowlines_ReturnsError(HttpStatusCode statusCode, string bodyContent)
        {
            var mockHttp = new MockHttpMessageHandler();
            var content = bodyContent != null ? new StringContent(bodyContent) : null;
            mockHttp.When("https://fakeserver/path/linked-data/comid/comidvalue/navigation/UM/flowlines?distance=50")
                    .Respond(HttpStatusCode.BadRequest, content);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            Func<Task> call = async () => await sut.GetFlowlines("comidvalue", NavigationMode.UpstreamMain, 50);
            await call.Should().ThrowAsync<WestDaatException>();
        }

        [DataTestMethod]
        [DataRow("comidvalue", NavigationMode.UpstreamMain, FeatureDataSource.UsgsSurfaceWaterSites, 9, "linked-data/comid/comidvalue/navigation/UM/nwissite?distance=9")]
        [DataRow("<>", NavigationMode.UpstreamTributaries, FeatureDataSource.EpaWaterQualitySite, 0, "linked-data/comid/%3C%3E/navigation/UT/WQP?distance=0")]
        [DataRow("<bananas&oranges>", NavigationMode.DownstreamMain, FeatureDataSource.Wade, -1, "linked-data/comid/%3Cbananas&oranges%3E/navigation/DM/wade?distance=-1")]
        [DataRow("@home", NavigationMode.DownstreamDiversions, FeatureDataSource.UsgsSurfaceWaterSites, 15, "linked-data/comid/@home/navigation/DD/nwissite?distance=15")]
        public async Task GetFeatures_Parametertizes(string comid, NavigationMode navigationMode, FeatureDataSource featureDataSource, int distanceInKm, string expectedUrl)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When($"https://fakeserver/path/{expectedUrl}")
                    .Respond("application/json", "{}");

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            var result = await sut.GetFeatures(comid, navigationMode, featureDataSource, distanceInKm);

            result.Should().NotBeNull();
            result.Features.Should().BeEmpty();
        }

        [DataTestMethod]
        [GetFeaturesValidJsonTestDataSource]
        public async Task GetFeatures_ReturnsSuccess_ValidJson(string json, int[] propertiesCounts)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When("https://fakeserver/path/linked-data/comid/comidvalue/navigation/UM/WQP?distance=50")
                    .Respond("application/json", json);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            var result = await sut.GetFeatures("comidvalue", NavigationMode.UpstreamMain, FeatureDataSource.EpaWaterQualitySite, 50);

            result.Should().NotBeNull();
            result.Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.FeatureCollection);
            result.Features.Should().HaveCount(propertiesCounts.Length);
            for (var i = 0; i < propertiesCounts.Length; i++)
            {
                result.Features[i].Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.Feature);
                result.Features[i].Geometry.Type.Should().Be(GeoJSON.Text.GeoJSONObjectType.Point);
                result.Features[i].Geometry.Should().BeOfType<Point>();
                result.Features[i].Properties.Should().HaveCount(propertiesCounts[i]);
            }
        }

        [DataTestMethod]
        [DataRow("I'm not JSON")]
        [DataRow("{I'm not JSON}")]
        [DataRow("1234")]
        public async Task GetFeatures_ReturnsSuccess_InvalidJsonString(string invalidJsonString)
        {
            var mockHttp = new MockHttpMessageHandler();
            mockHttp.When("https://fakeserver/path/linked-data/comid/comidvalue/navigation/UM/WQP?distance=50")
                    .Respond("application/json", invalidJsonString);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            Func<Task> call = async () => await sut.GetFeatures("comidvalue", NavigationMode.UpstreamMain, FeatureDataSource.EpaWaterQualitySite, 50);
            await call.Should().ThrowAsync<JsonException>();
        }

        [DataTestMethod]
        [DataRow(HttpStatusCode.BadRequest, null)]
        [DataRow(HttpStatusCode.BadRequest, "")]
        [DataRow(HttpStatusCode.BadRequest, "error message")]
        [DataRow(HttpStatusCode.InternalServerError, null)]
        [DataRow(HttpStatusCode.InternalServerError, "")]
        [DataRow(HttpStatusCode.InternalServerError, "error message")]
        public async Task GetFeatures_ReturnsError(HttpStatusCode statusCode, string bodyContent)
        {
            var mockHttp = new MockHttpMessageHandler();
            var content = bodyContent != null ? new StringContent(bodyContent) : null;
            mockHttp.When("https://fakeserver/path/linked-data/comid/comidvalue/navigation/UM/WQP?distance=50")
                    .Respond(HttpStatusCode.BadRequest, content);

            var sut = CreateUsgsNldiSdk(mockHttp.ToHttpClient());
            Func<Task> call = async () => await sut.GetFeatures("comidvalue", NavigationMode.UpstreamMain, FeatureDataSource.EpaWaterQualitySite, 50);
            await call.Should().ThrowAsync<WestDaatException>();
        }

        private UsgsNldiSdk CreateUsgsNldiSdk(HttpClient client)
        {
            client.BaseAddress = new Uri("https://fakeserver/path/");
            return new UsgsNldiSdk(client, CreateLogger<UsgsNldiSdk>());
        }

        private class GetFeatureByCoordinatesValidJsonTestDataSourceAttribute : TestDataSourceAttribute, ITestDataSource
        {
            public IEnumerable<object[]> GetData(MethodInfo methodInfo)
            {
                yield return new object[] { "{}", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { "", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { " ", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { "\t", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { UsgsNldiResponses.UsgsNldiResponseResources.ValidGetFlowlinesResponse, new[] { 3, 5, 4 }, new[] { 1, 1, 1 } };
            }

            public string GetDisplayName(MethodInfo methodInfo, object[] data)
            {
                return string.Join(",", CleanupJsonForDisplay((string)data[0]), CleanupForDisplay((int[])data[1]), CleanupForDisplay((int[])data[2]));
            }
        }

        private class GetFlowlinesValidJsonTestDataSourceAttribute : TestDataSourceAttribute, ITestDataSource
        {
            public IEnumerable<object[]> GetData(MethodInfo methodInfo)
            {
                yield return new object[] { "{}", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { "", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { " ", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { "\t", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { UsgsNldiResponses.UsgsNldiResponseResources.ValidGetFlowlinesResponse, new[] { 3, 5, 4 }, new[] { 1, 1, 1 } };
            }

            public string GetDisplayName(MethodInfo methodInfo, object[] data)
            {
                return string.Join(",", CleanupJsonForDisplay((string)data[0]), CleanupForDisplay((int[])data[1]), CleanupForDisplay((int[])data[2]));
            }
        }

        private class GetFeaturesValidJsonTestDataSourceAttribute : TestDataSourceAttribute, ITestDataSource
        {
            public IEnumerable<object[]> GetData(MethodInfo methodInfo)
            {
                yield return new object[] { "{}", Array.Empty<int>() };
                yield return new object[] { "", Array.Empty<int>() };
                yield return new object[] { " ", Array.Empty<int>() };
                yield return new object[] { "\t", Array.Empty<int>() };
                yield return new object[] { UsgsNldiResponses.UsgsNldiResponseResources.ValidGetFeaturesResponse, new[] { 10, 10, 10, 10 } };
            }

            public string GetDisplayName(MethodInfo methodInfo, object[] data)
            {
                return string.Join(",", CleanupJsonForDisplay((string)data[0]), CleanupForDisplay((int[])data[1]));
            }
        }

        private class TestDataSourceAttribute : Attribute
        {
            public string CleanupJsonForDisplay(string jsonValue)
            {
                try
                {
                    jsonValue = JsonSerializer.Serialize(JsonSerializer.Deserialize<object>(jsonValue));
                }
                catch (JsonException)
                {
                    //do nothing
                }
                if (jsonValue.Length > 50)
                {
                    jsonValue = jsonValue.Substring(0, 47) + "...";
                }
                return jsonValue;
            }

            public string CleanupForDisplay(int[] values)
            {
                return JsonSerializer.Serialize(values);
            }
        }
    }
}