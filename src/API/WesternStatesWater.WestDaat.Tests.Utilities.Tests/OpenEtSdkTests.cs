using NetTopologySuite.Geometries;
using RichardSzalay.MockHttp;
using System.Net.Http;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class OpenEtSdkTests : UtilitiesTestBase
{
    private MockHttpMessageHandler _mockHttp = null!;

    [TestInitialize]
    public void TestInitialize()
    {
        _mockHttp = new MockHttpMessageHandler();
    }

    private OpenEtSdk CreateOpenEtSdk(HttpClient httpClient)
    {
        return new(httpClient, CreateLogger<OpenEtSdk>());
    }

    [TestMethod]
    public async Task RasterTimeseriesPolygon_MockedApi_Success()
    {
        var lastYear = new DateTime(DateTime.Now.Year - 1, 1, 1);
        var currentYear = new DateTime(DateTime.Now.Year, 1, 1);
        var closedLinestringCoordinates = new[]
        {
            new Coordinate(-119.7937, 35.58995),
            new Coordinate(-119.7937, 35.53326),
            new Coordinate(-119.71268, 35.53326),
            new Coordinate(-119.71268, 35.58995),
            new Coordinate(-119.7937, 35.58995),
        };

        var request = new RasterTimeseriesPolygonRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePolygon(closedLinestringCoordinates),
            Interval = RasterTimeseriesInterval.Monthly,
            Model = RasterTimeseriesModel.SSEBop,
            PixelReducer = RasterTimeseriesPixelReducer.Mean,
            ReferenceEt = RasterTimeseriesReferenceEt.GridMET,
            OutputExtension = RasterTimeseriesFileFormat.JSON,
            OutputUnits = RasterTimeseriesOutputUnits.Millimeters,
            Variable = RasterTimeseriesCollectionVariable.ET,
        };

        _mockHttp.When(HttpMethod.Post, "https://openet-api.org/raster/timeseries/polygon")
            .Respond("application/json", JsonSerializer.Serialize(new[]
            {
                new RasterTimeseriesPolygonResponseDatapoint()
                    {
                        Time = DateOnly.FromDateTime(currentYear),
                        Evapotranspiration = 30.0,
                    }
            }));

        var sdk = CreateOpenEtSdk(_mockHttp.ToHttpClient());
        var response = await sdk.RasterTimeseriesPolygon(request);

        response.Should().NotBeNull();
        response.Data.Should().NotBeEmpty();
    }
}
