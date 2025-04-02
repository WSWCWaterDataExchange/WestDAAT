using NetTopologySuite.Geometries;
using RichardSzalay.MockHttp;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class OpenEtSdkTests : UtilityTestBase
{
    private MockHttpMessageHandler _mockHttp = null!;

    private const string baseAddress = "https://fakeserver/path/";

    [TestInitialize]
    public void TestInitialize()
    {
        _mockHttp = new MockHttpMessageHandler();
    }

    private OpenEtSdk CreateOpenEtSdk(HttpClient httpClient)
    {
        if (httpClient.BaseAddress == null)
        {
            httpClient.BaseAddress = new Uri(baseAddress);
        }

        return new(httpClient, Configuration.GetOpenEtConfiguration(), CreateLogger<OpenEtSdk>());
    }

    [TestMethod]
    public void RasterTimeSeriesPolygon_RequestSerializesSuccessfully()
    {
        // Arrange
        // remove whitespace from expected json
        var expectedJson = Regex.Replace("""
            {   
                "date_range":["2024-01-01","2025-01-01"],
                "geometry":[
                    -119.7937,35.53326,
                    -119.7937,35.58995,
                    -119.71268,35.58995,
                    -119.71268,35.53326,
                    -119.7937,35.53326
                ],
                "file_format":"JSON",
                "interval":"Monthly",
                "model":"SSEBop",
                "reducer":"Mean",
                "reference_et":"GridMET",
                "units":"mm",
                "variable":"ET"
            }
            """,
            @"\s",
            string.Empty);

        var lastYear = new DateTime(DateTime.Now.Year - 1, 1, 1);
        var currentYear = new DateTime(DateTime.Now.Year, 1, 1);
        var closedLinestringCoordinates = new[]
        {
            new Coordinate(-119.7937, 35.53326),
            new Coordinate(-119.7937, 35.58995),
            new Coordinate(-119.71268, 35.58995),
            new Coordinate(-119.71268, 35.53326),
            new Coordinate(-119.7937, 35.53326),
        };

        var request = new RasterTimeSeriesPolygonRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePolygon(closedLinestringCoordinates),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            PixelReducer = RasterTimeSeriesPixelReducer.Mean,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = RasterTimeSeriesOutputUnits.Millimeters,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var serializedRequest = JsonSerializer.Serialize(request);

        // Assert
        serializedRequest.Should().Be(expectedJson);
    }

    [DataTestMethod]
    [DataRow(RasterTimeSeriesOutputUnits.Millimeters)]
    [DataRow(RasterTimeSeriesOutputUnits.Inches)]
    public async Task RasterTimeseriesPolygon_MockedApi_Success(RasterTimeSeriesOutputUnits outputUnits)
    {
        // Arrange
        var responseContentString = """
        [
            {
                "time":"2024-01-01",
                "et":16.184
            },
            {
                "time":"2024-02-01",
                "et":27.359
            },
            {
                "time":"2024-03-01",
                "et":46.508
            },
            {
                "time":"2024-04-01",
                "et":54.863
            },
            {
                "time":"2024-05-01",
                "et":93.419
            },
            {
                "time":"2024-06-01",
                "et":118.884
            },
            {
                "time":"2024-07-01",
                "et":136.422
            },
            {
                "time":"2024-08-01",
                "et":117.174
            },
            {
                "time":"2024-09-01",
                "et":93.941
            },
            {
                "time":"2024-10-01",
                "et":70.393
            },
            {
                "time":"2024-11-01",
                "et":26.606
            },
            {
                "time":"2024-12-01",
                "et":17.882
            }
        ]
        """;
        _mockHttp.When(HttpMethod.Post, baseAddress + "raster/timeseries/polygon")
            .Respond("application/json", responseContentString);

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

        var request = new RasterTimeSeriesPolygonRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePolygon(closedLinestringCoordinates),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            PixelReducer = RasterTimeSeriesPixelReducer.Mean,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = outputUnits,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var sdk = CreateOpenEtSdk(_mockHttp.ToHttpClient());
        var response = await sdk.RasterTimeseriesPolygon(request);

        // Assert
        response.Should().NotBeNull();

        const int monthsInYear = 12;
        response.Data.Should().HaveCount(monthsInYear);
        response.Data.All(datapoint => datapoint.Time.Year == lastYear.Year).Should().BeTrue();
        response.Data.All(datapoint => datapoint.Evapotranspiration > 0).Should().BeTrue();
    }

    [TestMethod]
    public async Task RasterTimeSeriesPolygon_MockedApi_ApiError_ShouldThrow()
    {
        // Arrange
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

        _mockHttp.When(HttpMethod.Post, baseAddress + "raster/timeseries/polygon")
            .Respond(System.Net.HttpStatusCode.InternalServerError);

        var request = new RasterTimeSeriesPolygonRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePolygon(closedLinestringCoordinates),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            PixelReducer = RasterTimeSeriesPixelReducer.Mean,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = RasterTimeSeriesOutputUnits.Millimeters,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var sdk = CreateOpenEtSdk(_mockHttp.ToHttpClient());
        var call = async () => await sdk.RasterTimeseriesPolygon(request);

        // Assert
        await call.Should().ThrowAsync<ServiceUnavailableException>();
    }

    [TestMethod]
    [Ignore("This test is ignored because it uses the real api.")]
    public async Task RasterTimeseriesPolygon_RealApi_Success()
    {
        // Arrange
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

        var request = new RasterTimeSeriesPolygonRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePolygon(closedLinestringCoordinates),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            PixelReducer = RasterTimeSeriesPixelReducer.Mean,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = RasterTimeSeriesOutputUnits.Millimeters,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var sdk = CreateOpenEtSdk(new HttpClient()
        {
            BaseAddress = new Uri(Configuration.GetOpenEtConfiguration().BaseAddress)
        });
        var response = await sdk.RasterTimeseriesPolygon(request);

        // Assert
        response.Should().NotBeNull();
        response.Data.Length.Should().BeGreaterThan(0);
        response.Data.All(datapoint => datapoint.Time.Year == lastYear.Year || datapoint.Time.Year == currentYear.Year).Should().BeTrue();
    }

    [TestMethod]
    public void RasterTimeSeriesPoint_RequestSerializesSuccessfully()
    {
        // Arrange
        // remove whitespace from expected json
        var expectedJson = Regex.Replace("""
            {   
                "date_range":["2024-01-01","2025-01-01"],
                "geometry":[
                    -119.7937,35.53326
                ],
                "file_format":"JSON",
                "interval":"Monthly",
                "model":"SSEBop",
                "reference_et":"GridMET",
                "units":"mm",
                "variable":"ET"
            }
            """,
            @"\s",
            string.Empty);

        var lastYear = new DateTime(DateTime.Now.Year - 1, 1, 1);
        var currentYear = new DateTime(DateTime.Now.Year, 1, 1);
        var pointCoordinate = new Coordinate(-119.7937, 35.53326);

        var request = new RasterTimeSeriesPointRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePoint(pointCoordinate),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = RasterTimeSeriesOutputUnits.Millimeters,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var serializedRequest = JsonSerializer.Serialize(request);

        // Assert
        serializedRequest.Should().Be(expectedJson);
    }

    [DataTestMethod]
    [DataRow(RasterTimeSeriesOutputUnits.Millimeters)]
    [DataRow(RasterTimeSeriesOutputUnits.Inches)]
    public async Task RasterTimeseriesPoint_MockedApi_Success(RasterTimeSeriesOutputUnits outputUnits)
    {
        // Arrange
        var responseContentString = """
        [
            {
                "time":"2024-01-01",
                "et":16.184
            },
            {
                "time":"2024-02-01",
                "et":27.359
            },
            {
                "time":"2024-03-01",
                "et":46.508
            },
            {
                "time":"2024-04-01",
                "et":54.863
            },
            {
                "time":"2024-05-01",
                "et":93.419
            },
            {
                "time":"2024-06-01",
                "et":118.884
            },
            {
                "time":"2024-07-01",
                "et":136.422
            },
            {
                "time":"2024-08-01",
                "et":117.174
            },
            {
                "time":"2024-09-01",
                "et":93.941
            },
            {
                "time":"2024-10-01",
                "et":70.393
            },
            {
                "time":"2024-11-01",
                "et":26.606
            },
            {
                "time":"2024-12-01",
                "et":17.882
            }
        ]
        """;
        _mockHttp.When(HttpMethod.Post, baseAddress + "raster/timeseries/point")
            .Respond("application/json", responseContentString);

        var lastYear = new DateTime(DateTime.Now.Year - 1, 1, 1);
        var currentYear = new DateTime(DateTime.Now.Year, 1, 1);
        var pointCoordinate = new Coordinate(-119.7937, 35.58995);

        var request = new RasterTimeSeriesPointRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePoint(pointCoordinate),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = outputUnits,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var sdk = CreateOpenEtSdk(_mockHttp.ToHttpClient());
        var response = await sdk.RasterTimeseriesPoint(request);

        // Assert
        response.Should().NotBeNull();

        const int monthsInYear = 12;
        response.Data.Should().HaveCount(monthsInYear);
        response.Data.All(datapoint => datapoint.Time.Year == lastYear.Year).Should().BeTrue();
        response.Data.All(datapoint => datapoint.Evapotranspiration > 0).Should().BeTrue();
    }

    [TestMethod]
    public async Task RasterTimeSeriesPoint_MockedApi_ApiError_ShouldThrow()
    {
        // Arrange
        var lastYear = new DateTime(DateTime.Now.Year - 1, 1, 1);
        var currentYear = new DateTime(DateTime.Now.Year, 1, 1);
        var pointCoordinate = new Coordinate(-119.7937, 35.58995);

        _mockHttp.When(HttpMethod.Post, baseAddress + "raster/timeseries/point")
            .Respond(System.Net.HttpStatusCode.InternalServerError);

        var request = new RasterTimeSeriesPointRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePoint(pointCoordinate),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = RasterTimeSeriesOutputUnits.Millimeters,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var sdk = CreateOpenEtSdk(_mockHttp.ToHttpClient());
        var call = async () => await sdk.RasterTimeseriesPoint(request);

        // Assert
        await call.Should().ThrowAsync<ServiceUnavailableException>();
    }

    [TestMethod]
    [Ignore("This test is ignored because it uses the real api.")]
    public async Task RasterTimeseriesPoint_RealApi_Success()
    {
        // Arrange
        var lastYear = new DateTime(DateTime.Now.Year - 1, 1, 1);
        var currentYear = new DateTime(DateTime.Now.Year, 1, 1);
        var pointCoordinate = new Coordinate(-119.7937, 35.58995);

        var request = new RasterTimeSeriesPointRequest
        {
            DateRangeStart = DateOnly.FromDateTime(lastYear),
            DateRangeEnd = DateOnly.FromDateTime(currentYear),
            Geometry = new GeometryFactory().CreatePoint(pointCoordinate),
            Interval = RasterTimeSeriesInterval.Monthly,
            Model = RasterTimeSeriesModel.SSEBop,
            ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
            OutputExtension = RasterTimeSeriesFileFormat.JSON,
            OutputUnits = RasterTimeSeriesOutputUnits.Millimeters,
            Variable = RasterTimeSeriesCollectionVariable.ET,
        };

        // Act
        var sdk = CreateOpenEtSdk(new HttpClient()
        {
            BaseAddress = new Uri(Configuration.GetOpenEtConfiguration().BaseAddress)
        });
        var response = await sdk.RasterTimeseriesPoint(request);

        // Assert
        response.Should().NotBeNull();
        response.Data.Length.Should().BeGreaterThan(0);
        response.Data.All(datapoint => datapoint.Time.Year == lastYear.Year || datapoint.Time.Year == currentYear.Year).Should().BeTrue();
    }
}
