using FluentAssertions;
using GeoJSON.Text.Geometry;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RichardSzalay.MockHttp;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests
{
    [TestClass]
    [TestCategory("Utilities Tests")]
    public class UsgsNldiSdkTests : UtilitiesTestBase
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
        [DataRow("")]
        [DataRow(" ")]
        [DataRow("\t")]
        [DataRow("I'm not JSON")]
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
        [DataRow("")]
        [DataRow(" ")]
        [DataRow("\t")]
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

        private UsgsNldiSdk CreateUsgsNldiSdk(HttpClient client)
        {
            client.BaseAddress = new Uri("https://fakeserver/path/");
            return new UsgsNldiSdk(client, CreateLogger<UsgsNldiSdk>());
        }

        private class GetFlowlinesValidJsonTestDataSourceAttribute : TestDataSourceAttribute, ITestDataSource
        {
            public IEnumerable<object[]> GetData(MethodInfo methodInfo)
            {
                yield return new object[] { "{}", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { UsgsNldiResponses.UsgsNldiResponseResources.ValidGetFlowlinesResponse, new[] { 3, 5, 4 }, new[] { 1, 1, 1 } };
            }
        }

        private class GetFeatureByCoordinatesValidJsonTestDataSourceAttribute : TestDataSourceAttribute, ITestDataSource
        {
            public IEnumerable<object[]> GetData(MethodInfo methodInfo)
            {
                yield return new object[] { "{}", Array.Empty<int>(), Array.Empty<int>() };
                yield return new object[] { UsgsNldiResponses.UsgsNldiResponseResources.ValidGetFlowlinesResponse, new[] { 3, 5, 4 }, new[] { 1, 1, 1 } };
            }
        }

        private class TestDataSourceAttribute : Attribute
        {
            public string GetDisplayName(MethodInfo methodInfo, object[] data)
            {
                return string.Join(",", CleanupJsonForDisplay((string)data[0]), CleanupForDisplay((int[])data[1]), CleanupForDisplay((int[])data[2]));
            }

            private string CleanupJsonForDisplay(string jsonValue)
            {
                var cleanJson = JsonSerializer.Serialize(JsonSerializer.Deserialize<object>(jsonValue));
                if (cleanJson.Length > 50)
                {
                    cleanJson = cleanJson.Substring(0, 47) + "...";
                }
                return cleanJson;
            }
            private string CleanupForDisplay(int[] values)
            {
                return JsonSerializer.Serialize(values);
            }
        }
    }
}