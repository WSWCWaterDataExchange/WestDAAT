using NetTopologySuite.Geometries;
using RichardSzalay.MockHttp;
using System.Net.Http;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common.Configuration;
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
        return new(httpClient, Configuration.GetOpenEtConfiguration(), CreateLogger<OpenEtSdk>());
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

        var responseContentString = """[{"time":"2024-01-01","et":16.184},{"time":"2024-02-01","et":27.359},{"time":"2024-03-01","et":46.508},{"time":"2024-04-01","et":54.863},{"time":"2024-05-01","et":93.419},{"time":"2024-06-01","et":118.884},{"time":"2024-07-01","et":136.422},{"time":"2024-08-01","et":117.174},{"time":"2024-09-01","et":93.941},{"time":"2024-10-01","et":70.393},{"time":"2024-11-01","et":26.606},{"time":"2024-12-01","et":17.882}]""";
        _mockHttp.When(HttpMethod.Post, "https://openet-api.org/raster/timeseries/polygon")
            .Respond("application/json", responseContentString);

        var sdk = CreateOpenEtSdk(_mockHttp.ToHttpClient());
        var response = await sdk.RasterTimeseriesPolygon(request);

        response.Should().NotBeNull();

        const int monthsInYear = 12;
        response.Data.Should().HaveCount(monthsInYear);
        response.Data.All(datapoint => datapoint.Time.Year == lastYear.Year).Should().BeTrue();
        response.Data.All(datapoint => datapoint.Evapotranspiration > 0).Should().BeTrue();
    }

    [TestMethod]
    [Ignore("This test is ignored because it uses the real api.")]
    public async Task RasterTimeseriesPolygon_RealApi_Success()
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

        var sdk = CreateOpenEtSdk(new HttpClient());
        var response = await sdk.RasterTimeseriesPolygon(request);

        response.Should().NotBeNull();

        const int monthsInYear = 12;
        response.Data.Should().HaveCount(monthsInYear);
        response.Data.All(datapoint => datapoint.Time.Year == lastYear.Year).Should().BeTrue();
        response.Data.All(datapoint => datapoint.Evapotranspiration > 0).Should().BeTrue();
    }
}
