using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.EngineTests.Calculation;

[TestClass]
public class CalculationEngineTests : EngineTestBase
{
    private ICalculationEngine _calculationEngine;

    private Mock<IOpenEtSdk> _openEtSdkMock;

    private const string arbitraryValidPolygonWkt1 = "POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))";
    private const string arbitraryValidPolygonWkt2 = "POLYGON ((0 0, 5 0, 5 5, 0 5, 0 0))";
    private const string arbitraryValidPointWKt = "POINT (0 0)";

    [TestInitialize]
    public void TestInitialize()
    {
        _openEtSdkMock = new Mock<IOpenEtSdk>(MockBehavior.Strict);

        _calculationEngine = new CalculationEngine(_openEtSdkMock.Object);
    }

    [DataTestMethod]
    [DataRow(false)]
    [DataRow(true)]
    public async Task Calculate_MultiPolygonYearlyEt_OnePolygon_OneDatapoint_OneYear_ShouldComputeCorrectly(bool shouldIncludeControl)
    {
        // Arrange
        var twentyTwentyFive = DateOnly.FromDateTime(new DateTime(2025, 1, 1));
        _openEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.IsAny<RasterTimeSeriesPolygonRequest>()))
            .ReturnsAsync(new RasterTimeSeriesPolygonResponse
            {
                Data = [
                    new()
                    {
                        Evapotranspiration = 1.0,
                        Time = twentyTwentyFive
                    }
                ]
            });

        if (shouldIncludeControl)
        {
            _openEtSdkMock.Setup(x => x.RasterTimeseriesPoint(It.IsAny<RasterTimeSeriesPointRequest>()))
                .ReturnsAsync(new RasterTimeSeriesPointResponse
                {
                    Data = [
                        new()
                        {
                            Evapotranspiration = 1.0,
                            Time = twentyTwentyFive
                        }
                    ]
                });
        }

        var request = new MultiPolygonYearlyEtRequest
        {
            DateRangeStart = DateOnly.MinValue,
            DateRangeEnd = DateOnly.MaxValue,
            Model = RasterTimeSeriesModel.SSEBop,
            Polygons =
            [
                new MapPolygon
                {
                    PolygonWkt = arbitraryValidPolygonWkt1,
                    DrawToolType = DrawToolType.Freeform,
                }
            ],
            ControlLocation = shouldIncludeControl
                ? new MapPoint
                {
                    PointWkt = arbitraryValidPointWKt
                }
                : null
        };

        // Act
        var response = (MultiPolygonYearlyEtResponse)await _calculationEngine.Calculate(request);

        // Assert
        response.Should().NotBeNull();

        response.DataCollections.Length.Should().Be(1);
        response.DataCollections[0].PolygonWkt.Should().Be(request.Polygons[0].PolygonWkt);
        response.DataCollections[0].DrawToolType.Should().Be(request.Polygons[0].DrawToolType);
        // 2025: 1 inch
        // avg: 1 inch / 1 year = 1 inch
        response.DataCollections[0].AverageYearlyTotalEtInInches.Should().Be(1.0);

        response.DataCollections[0].Datapoints.Length.Should().Be(1);
        response.DataCollections[0].Datapoints[0].Year.Should().Be(twentyTwentyFive.Year);
        response.DataCollections[0].Datapoints[0].TotalEtInInches.Should().Be(1.0);

        if (shouldIncludeControl)
        {
            // collection should have net et
            response.DataCollections[0].AverageYearlyNetEtInInches.Should().Be(0.0);

            // each datapoint should have precipitation, net et
            response.DataCollections[0].Datapoints[0].EffectivePrecipitationInInches.Should().Be(1.0);
            response.DataCollections[0].Datapoints[0].NetEtInInches.Should().Be(0.0);
        }
    }

    [DataTestMethod]
    [DataRow(false)]
    [DataRow(true)]
    public async Task Calculate_MultiPolygonYearlyEt_MultiplePolygons_MultipleDatapoints_OneYear_ShouldComputeCorrectly(bool shouldIncludeControl)
    {
        // Arrange
        var twentyTwentyFive = DateOnly.FromDateTime(new DateTime(2025, 1, 1));
        _openEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.Is<RasterTimeSeriesPolygonRequest>(req => req.Geometry.AsText() == arbitraryValidPolygonWkt1)))
            .ReturnsAsync(new RasterTimeSeriesPolygonResponse
            {
                Data = [
                    new()
                    {
                        Evapotranspiration = 1.0,
                        Time = twentyTwentyFive
                    },
                    new()
                    {
                        Evapotranspiration = 2.0,
                        Time = twentyTwentyFive
                    },
                    new()
                    {
                        Evapotranspiration = 3.0,
                        Time = twentyTwentyFive
                    }
                ]
            });

        _openEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.Is<RasterTimeSeriesPolygonRequest>(req => req.Geometry.AsText() == arbitraryValidPolygonWkt2)))
            .ReturnsAsync(new RasterTimeSeriesPolygonResponse
            {
                Data = [
                    new()
                    {
                        Evapotranspiration = 0.33,
                        Time = twentyTwentyFive
                    },
                    new()
                    {
                        Evapotranspiration = 1.65,
                        Time = twentyTwentyFive
                    },
                    new()
                    {
                        Evapotranspiration = 12.73,
                        Time = twentyTwentyFive
                    },
                    new()
                    {
                        Evapotranspiration = 0.0,
                        Time = twentyTwentyFive
                    },
                    new()
                    {
                        Evapotranspiration = 30.5,
                        Time = twentyTwentyFive
                    }
                ]
            });

        if (shouldIncludeControl)
        {
            _openEtSdkMock.Setup(x => x.RasterTimeseriesPoint(It.IsAny<RasterTimeSeriesPointRequest>()))
                .ReturnsAsync(new RasterTimeSeriesPointResponse
                {
                    Data = [
                        new()
                        {
                            Evapotranspiration = 1.0,
                            Time = twentyTwentyFive
                        }
                    ]
                });
        }

        var request = new MultiPolygonYearlyEtRequest
        {
            DateRangeStart = DateOnly.MinValue,
            DateRangeEnd = DateOnly.MaxValue,
            Model = RasterTimeSeriesModel.SSEBop,
            Polygons =
            [
                new MapPolygon
                {
                    PolygonWkt = arbitraryValidPolygonWkt1,
                    DrawToolType = DrawToolType.Freeform,
                },
                new MapPolygon
                {
                    PolygonWkt = arbitraryValidPolygonWkt2,
                    DrawToolType = DrawToolType.Freeform,
                }
            ],
            ControlLocation = shouldIncludeControl
                ? new MapPoint
                {
                    PointWkt = arbitraryValidPointWKt
                }
                : null
        };

        // Act
        var response = (MultiPolygonYearlyEtResponse)await _calculationEngine.Calculate(request);

        // Assert
        response.Should().NotBeNull();

        response.DataCollections.Length.Should().Be(2);

        response.DataCollections[0].PolygonWkt.Should().Be(request.Polygons[0].PolygonWkt);
        response.DataCollections[0].DrawToolType.Should().Be(request.Polygons[0].DrawToolType);
        // 2025: 1 inch + 2 inches + 3 inches = 6 inches
        // avg: 6 inches / 1 year = 6 inches
        response.DataCollections[0].AverageYearlyTotalEtInInches.Should().Be(6);
        response.DataCollections[0].Datapoints.Length.Should().Be(1); // only one year of data

        response.DataCollections[1].PolygonWkt.Should().Be(request.Polygons[1].PolygonWkt);
        response.DataCollections[1].DrawToolType.Should().Be(request.Polygons[1].DrawToolType);
        // 2025: 0.33 + 1.65 + 12.73 + 0 + 30.5 = 45.21 inches
        // avg: 45.21 inches / 1 year = 45.21 inches
        response.DataCollections[1].AverageYearlyTotalEtInInches.Should().Be(45.21);
        response.DataCollections[1].Datapoints.Length.Should().Be(1); // only one year of data

        if (shouldIncludeControl)
        {
            foreach (var collection in response.DataCollections)
            {
                // collections should have net et
                collection.AverageYearlyNetEtInInches.Should().Be(
                    collection.AverageYearlyTotalEtInInches - 1.0
                );

                // data points should have precipitation, net et
                foreach (var datapoint in collection.Datapoints)
                {
                    datapoint.EffectivePrecipitationInInches.Should().Be(1);
                    datapoint.NetEtInInches.Should().Be(datapoint.TotalEtInInches - datapoint.EffectivePrecipitationInInches);
                }
            }
        }
    }

    [DataTestMethod]
    [DataRow(false)]
    [DataRow(true)]
    public async Task Calculate_MultiPolygonYearlyEt_MultiplePolygons_MultipleDatapoints_MultipleYears_ShouldComputeCorrectly(bool shouldIncludeControl)
    {
        // Arrange
        var twentyTwentyThree = DateOnly.FromDateTime(new DateTime(2023, 1, 1));
        var twentyTwentyFour = DateOnly.FromDateTime(new DateTime(2024, 1, 1));
        var twentyTwentyFive = DateOnly.FromDateTime(new DateTime(2025, 1, 1));
        _openEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.Is<RasterTimeSeriesPolygonRequest>(req => req.Geometry.AsText() == arbitraryValidPolygonWkt1)))
            .ReturnsAsync(new RasterTimeSeriesPolygonResponse
            {
                Data = [
                    new()
                    {
                        Evapotranspiration = 1.0,
                        Time = twentyTwentyThree
                    },
                    new()
                    {
                        Evapotranspiration = 2.0,
                        Time = twentyTwentyFour
                    },
                    new()
                    {
                        Evapotranspiration = 3.0,
                        Time = twentyTwentyFive
                    }
                ]
            });

        _openEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.Is<RasterTimeSeriesPolygonRequest>(req => req.Geometry.AsText() == arbitraryValidPolygonWkt2)))
            .ReturnsAsync(new RasterTimeSeriesPolygonResponse
            {
                Data = [
                    new()
                    {
                        Evapotranspiration = 0.33,
                        Time = twentyTwentyThree
                    },
                    new()
                    {
                        Evapotranspiration = 1.65,
                        Time = twentyTwentyThree
                    },
                    new()
                    {
                        Evapotranspiration = 12.73,
                        Time = twentyTwentyFour
                    },
                    new()
                    {
                        Evapotranspiration = 0.0,
                        Time = twentyTwentyFour
                    },
                    new()
                    {
                        Evapotranspiration = 30.5,
                        Time = twentyTwentyFive
                    }
                ]
            });

        RasterTimeSeriesDatapoint[] controlEtData =
        [
            new()
            {
                Evapotranspiration = 1,
                Time = twentyTwentyThree,
            },
            new()
            {
                Evapotranspiration = 2,
                Time = twentyTwentyFour,
            },
            new()
            {
                Evapotranspiration = 3,
                Time = twentyTwentyFive
            }
        ];
        if (shouldIncludeControl)
        {
            _openEtSdkMock.Setup(x => x.RasterTimeseriesPoint(It.IsAny<RasterTimeSeriesPointRequest>()))
                .ReturnsAsync(new RasterTimeSeriesPointResponse
                {
                    Data = controlEtData
                });
        }

        var request = new MultiPolygonYearlyEtRequest
        {
            DateRangeStart = DateOnly.MinValue,
            DateRangeEnd = DateOnly.MaxValue,
            Model = RasterTimeSeriesModel.SSEBop,
            Polygons = [
                new()
                {
                    PolygonWkt = arbitraryValidPolygonWkt1,
                    DrawToolType = DrawToolType.Freeform,
                },
                new()
                {
                    PolygonWkt = arbitraryValidPolygonWkt2,
                    DrawToolType = DrawToolType.Freeform,
                }
            ],
            ControlLocation = shouldIncludeControl
                ? new MapPoint
                {
                    PointWkt = arbitraryValidPointWKt,
                }
                : null
        };

        // Act
        var response = (MultiPolygonYearlyEtResponse)await _calculationEngine.Calculate(request);

        // Assert
        response.Should().NotBeNull();

        response.DataCollections.Length.Should().Be(2);

        response.DataCollections[0].PolygonWkt.Should().Be(request.Polygons[0].PolygonWkt);
        response.DataCollections[0].DrawToolType.Should().Be(request.Polygons[0].DrawToolType);
        // 2023: 1 inch
        // 2024: 2 inches
        // 2025: 3 inches
        // avg: (1 + 2 + 3) / 3 years = 2 inches
        response.DataCollections[0].AverageYearlyTotalEtInInches.Should().Be(2);
        response.DataCollections[0].Datapoints.Length.Should().Be(3); // three years of data

        response.DataCollections[1].PolygonWkt.Should().Be(request.Polygons[1].PolygonWkt);
        response.DataCollections[1].DrawToolType.Should().Be(request.Polygons[1].DrawToolType);
        // 2023: 0.33 + 1.65 = 1.98 inches
        // 2024: 12.73 + 0 = 12.73 inches
        // 2025: 30.5 inches
        // avg: (1.98 + 12.73 + 30.5) / 3 years = 15.07 inches
        response.DataCollections[1].AverageYearlyTotalEtInInches.Should().Be(15.07);
        response.DataCollections[1].Datapoints.Length.Should().Be(3); // three years of data

        if (shouldIncludeControl)
        {
            double controlAverageTotalEt = controlEtData.Select(datum => datum.Evapotranspiration).Average();

            foreach (var collection in response.DataCollections)
            {
                // collection Net ET = collection Total ET - control avg Total ET
                collection.AverageYearlyNetEtInInches.Should().Be(
                    collection.AverageYearlyTotalEtInInches - controlAverageTotalEt
                );

                foreach (var datapoint in collection.Datapoints)
                {
                    // datapoint Net ET = datapoint Total ET - control Total ET for the same year
                    var matchingControlDatapoint = controlEtData.Single(datum => datum.Time.Year == datapoint.Year);

                    datapoint.NetEtInInches.Should().Be(
                        datapoint.TotalEtInInches - matchingControlDatapoint.Evapotranspiration
                    );
                }
            }
        }
    }

    [DataTestMethod]
    [DataRow(CompensationRateUnits.AcreFeet, false)]
    [DataRow(CompensationRateUnits.AcreFeet, true)]
    [DataRow(CompensationRateUnits.Acres, false)]
    public async Task Calculate_EstimateConservationPayment_Success(CompensationRateUnits units, bool useNetEt)
    {
        // Arrange
        var firstCorner = "-96.70537000 40.82014318";
        var memorialStadium = "POLYGON ((" +
            firstCorner + ", " +
            "-96.70537429129318 40.82112749428667, " +
            "-96.70595069212823 40.82113037830751, " +
            "-96.70595263797125 40.82014685607426, " +
            firstCorner +
            "))";

        var areaOfAFootballFieldInAcres = 1.32;

        var totalEtInInches = 60;
        var totalEtInFeet = totalEtInInches / 12; // 5 feet
        var totalEtVolumeInAcreFeet = areaOfAFootballFieldInAcres * totalEtInFeet;

        var netEtInInches = 48; // 80% of total ET is a reasonable example
        var netEtInFeet = netEtInInches / 12; // 4 feet
        var netEtVolumeInAcreFeet = areaOfAFootballFieldInAcres * netEtInFeet;

        var compensationRateDollars = 1000;

        var request = new EstimateConservationPaymentRequest
        {
            CompensationRateDollars = compensationRateDollars,
            CompensationRateUnits = units,
            DataCollections = [
                new()
                {
                    PolygonWkt = memorialStadium,
                    AverageYearlyTotalEtInInches = totalEtInInches,
                    AverageYearlyNetEtInInches = useNetEt ? netEtInInches : null,
                    Datapoints = []
                },
            ]
        };

        // Act
        var response = (EstimateConservationPaymentResponse)await _calculationEngine.Calculate(request);

        // Assert
        response.Should().NotBeNull();

        double expectedCompensation;
        switch (units)
        {
            case CompensationRateUnits.AcreFeet:
                if (useNetEt)
                {
                    expectedCompensation = netEtVolumeInAcreFeet * compensationRateDollars;
                }
                else
                {
                    expectedCompensation = totalEtVolumeInAcreFeet * compensationRateDollars;
                }

                ((double)response.EstimatedCompensationDollars).Should().BeWithinPercentOf(expectedCompensation, 1);
                break;
            case CompensationRateUnits.Acres:
                expectedCompensation = areaOfAFootballFieldInAcres * compensationRateDollars;
                ((double)response.EstimatedCompensationDollars).Should().BeWithinPercentOf(expectedCompensation, 1);
                break;
        }
    }

    [DataTestMethod]
    [DataRow(false)]
    [DataRow(true)]
    public async Task Calculate_EstimateConservationPayment_MultiplePolygons_MultipleETs_Success(bool useNetEt)
    {
        var firstCorner = "-96.70537000 40.82014318";
        var memorialStadium = "POLYGON ((" +
            firstCorner + ", " +
            "-96.70537429129318 40.82112749428667, " +
            "-96.70595069212823 40.82113037830751, " +
            "-96.70595263797125 40.82014685607426, " +
            firstCorner +
            "))";

        var zeroToOneSquare = "POLYGON ((0 0, 0.1 0, 0.1 0.1, 0 0.1, 0 0))";

        var compensationRateDollars = 350;

        var request = new EstimateConservationPaymentRequest
        {
            CompensationRateDollars = compensationRateDollars,
            CompensationRateUnits = CompensationRateUnits.AcreFeet,
            DataCollections = [
                new()
                {
                    PolygonWkt = memorialStadium,
                    AverageYearlyTotalEtInInches = 12,
                    AverageYearlyNetEtInInches = useNetEt ? 6 : null,
                    Datapoints = []
                },
                new()
                {
                    PolygonWkt = zeroToOneSquare,
                    AverageYearlyTotalEtInInches = 12,
                    AverageYearlyNetEtInInches = useNetEt ? 6 : null,
                    Datapoints = []
                },
                new()
                {
                    PolygonWkt = memorialStadium,
                    AverageYearlyTotalEtInInches = 120,
                    AverageYearlyNetEtInInches = useNetEt ? 60 : null,
                    Datapoints = []
                },
                new()
                {
                    PolygonWkt = zeroToOneSquare,
                    AverageYearlyTotalEtInInches = 120,
                    AverageYearlyNetEtInInches = useNetEt ? 60 : null,
                    Datapoints = []
                },
            ]
        };

        // Act
        var response = (EstimateConservationPaymentResponse)await _calculationEngine.Calculate(request);

        // Assert
        response.Should().NotBeNull();

        // Total ET:
        // collection 1: 1ft ET * 1.32 acres * $350 = $462
        // collection 2: 1ft ET * 30621.33 acres * $350 = $10717465.5
        // collection 3: 10ft ET * 1.32 acres * $350 = $4620
        // collection 4: 10ft ET * 30621.33 acres * $350 = $107174655
        // sum: 462 + 10717465.5 + 4620 + 107174655 = 117897202.5
        const double totalEtExpectedCompensation = 117897202.5;

        // Net ET - using half of Total ET to make the math easy

        var expectedCompensation = useNetEt
            ? totalEtExpectedCompensation / 2
            : totalEtExpectedCompensation;
        ((double)response.EstimatedCompensationDollars).Should().BeWithinPercentOf(expectedCompensation, 1);
    }
}