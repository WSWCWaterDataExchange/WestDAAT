using NetTopologySuite.Geometries;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Engines;

internal class CalculationEngine : ICalculationEngine
{
    private readonly IOpenEtSdk _openEtSdk;

    public CalculationEngine(IOpenEtSdk openEtSdk)
    {
        _openEtSdk = openEtSdk;
    }

    public async Task<CalculateResponseBase> Calculate(CalculateRequestBase request)
    {
        return request switch
        {
            EstimateConservationPaymentRequest req => EstimateConservationPayment(req),
            MultiPolygonYearlyEtRequest req => await CalculatePolygonsEt(req),
            _ => throw new NotImplementedException()
        };
    }

    private EstimateConservationPaymentResponse EstimateConservationPayment(EstimateConservationPaymentRequest request)
    {
        return request.CompensationRateUnits switch
        {
            CompensationRateUnits.Acres => EstimateConservationPaymentInAcres(request),
            CompensationRateUnits.AcreFeet => EstimateConservationPaymentInAcreFeet(request),
            _ => throw new NotImplementedException()
        };
    }

    private EstimateConservationPaymentResponse EstimateConservationPaymentInAcres(EstimateConservationPaymentRequest request)
    {
        var totalAreaInAcres = request.DataCollections
            .Select(dc => GeometryHelpers.GetGeometryByWkt(dc.PolygonWkt))
            .Sum(GeometryHelpers.GetGeometryAreaInAcres);

        var estimatedCompensation = totalAreaInAcres * request.CompensationRateDollars;
        return new EstimateConservationPaymentResponse
        {
            EstimatedCompensationDollars = (int)estimatedCompensation
        };
    }

    private EstimateConservationPaymentResponse EstimateConservationPaymentInAcreFeet(EstimateConservationPaymentRequest request)
    {
        double estimatedCompensation = 0;

        foreach (var collection in request.DataCollections)
        {
            var acreage = GeometryHelpers.GetGeometryAreaInAcres(GeometryHelpers.GetGeometryByWkt(collection.PolygonWkt));

            // prefer Net ET if it's been computed, otherwise use Total ET
            var etMetricToUse = collection.AverageYearlyNetEtInInches ?? collection.AverageYearlyTotalEtInInches;

            var averageEtInFeet = etMetricToUse / 12;
            var averageEtInAcreFeet = averageEtInFeet * acreage;
            estimatedCompensation += averageEtInAcreFeet * request.CompensationRateDollars;
        }

        return new EstimateConservationPaymentResponse
        {
            EstimatedCompensationDollars = (int)estimatedCompensation
        };
    }

    /// <summary>
    /// Given a list of polygons, computes the Total ET for each polygon.
    /// If also provided with a Control Location, then computes the Net ET for each polygon.
    /// </summary>
    private async Task<MultiPolygonYearlyEtResponse> CalculatePolygonsEt(MultiPolygonYearlyEtRequest request)
    {
        double? controlLocationAverageTotalEtInInches = null;
        Dictionary<int, double> controlLocationTotalEtByYear = null;
        PointEtDataCollection controlLocationResult = null;

        // The Control Location is the location of an unirrigated field near the polygons.
        // This allows us to estimate the "Net ET" via this formula:
        //     irrigated field Net ET = irrigated field Total ET - Effective Precipitation
        //     Effective Precipitation ~= nearby unirrigated field Total ET
        // ->  irrigated field Net ET ~= irrigated field Total ET - nearby unirrigated field Total ET
        if (request.ControlLocation != null)
        {
            var controlLocationGeo = GeometryHelpers.GetGeometryByWkt(request.ControlLocation.PointWkt) as Point;

            var rasterRequest = new RasterTimeSeriesPointRequest
            {
                Geometry = controlLocationGeo,
                DateRangeStart = request.DateRangeStart,
                DateRangeEnd = request.DateRangeEnd,
                Model = request.Model,
                Interval = RasterTimeSeriesInterval.Monthly,
                OutputExtension = RasterTimeSeriesFileFormat.JSON,
                OutputUnits = RasterTimeSeriesOutputUnits.Inches,
                ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
                Variable = RasterTimeSeriesCollectionVariable.ET,
            };
            var rasterResponse = await _openEtSdk.RasterTimeseriesPoint(rasterRequest);

            var yearlyDatapoints = rasterResponse.Data.GroupBy(datum => datum.Time.Year)
                .Select(grouping => new GeometryEtDatapoint { Year = grouping.Key, TotalEtInInches = grouping.Sum(datum => datum.Evapotranspiration) })
                .ToArray();

            controlLocationAverageTotalEtInInches = yearlyDatapoints.Average(d => d.TotalEtInInches);

            controlLocationTotalEtByYear = yearlyDatapoints.ToDictionary(datapoint => datapoint.Year, datapoint => datapoint.TotalEtInInches);

            controlLocationResult = new PointEtDataCollection
            {
                PointWkt = request.ControlLocation.PointWkt,
                AverageYearlyTotalEtInInches = controlLocationAverageTotalEtInInches.Value,
                Datapoints = yearlyDatapoints,
            };
        }

        var polygonResults = new List<PolygonEtDataCollection>();
        foreach (var polygon in request.Polygons)
        {
            var polygonGeo = GeometryHelpers.GetGeometryByWkt(polygon.PolygonWkt) as Polygon;

            var rasterRequest = new RasterTimeSeriesPolygonRequest
            {
                Geometry = polygonGeo,
                DateRangeStart = request.DateRangeStart,
                DateRangeEnd = request.DateRangeEnd,
                Model = request.Model,
                Interval = RasterTimeSeriesInterval.Monthly,
                OutputExtension = RasterTimeSeriesFileFormat.JSON,
                OutputUnits = RasterTimeSeriesOutputUnits.Inches,
                PixelReducer = RasterTimeSeriesPixelReducer.Mean,
                ReferenceEt = RasterTimeSeriesReferenceEt.GridMET,
                Variable = RasterTimeSeriesCollectionVariable.ET,
            };
            var rasterResponse = await _openEtSdk.RasterTimeseriesPolygon(rasterRequest);

            var yearlyDatapoints = rasterResponse.Data.GroupBy(datum => datum.Time.Year)
                .Select(grouping => new GeometryEtDatapoint { Year = grouping.Key, TotalEtInInches = grouping.Sum(datum => datum.Evapotranspiration) })
                .ToArray();

            var averageTotalEtInInches = yearlyDatapoints.Average(d => d.TotalEtInInches);
            var averageTotalEtInFeet = averageTotalEtInInches / 12;

            var polygonAreaInAcres = GeometryHelpers.GetGeometryAreaInAcres(polygonGeo);
            var averageTotalEtInAcreFeet = averageTotalEtInFeet * polygonAreaInAcres;

            var result = new PolygonEtDataCollection
            {
                WaterConservationApplicationEstimateLocationId = null,
                PolygonWkt = polygon.PolygonWkt,
                DrawToolType = polygon.DrawToolType,
                AverageYearlyTotalEtInInches = averageTotalEtInInches,
                AverageYearlyTotalEtInAcreFeet = averageTotalEtInAcreFeet,
                Datapoints = yearlyDatapoints
            };

            if (controlLocationAverageTotalEtInInches.HasValue)
            {
                // update collection
                result.AverageYearlyNetEtInInches = result.AverageYearlyTotalEtInInches - controlLocationAverageTotalEtInInches.Value;

                var averageNetEtInFeet = result.AverageYearlyNetEtInInches / 12;
                result.AverageYearlyNetEtInAcreFeet = averageNetEtInFeet * polygonAreaInAcres;

                // update each datapoint
                foreach (var datapoint in result.Datapoints)
                {
                    var controlLocationTotalEt = controlLocationTotalEtByYear[datapoint.Year];
                    datapoint.EffectivePrecipitationInInches = controlLocationTotalEt;
                    datapoint.NetEtInInches = datapoint.TotalEtInInches - controlLocationTotalEt;
                }
            }

            polygonResults.Add(result);
        }

        return new MultiPolygonYearlyEtResponse
        {
            DataCollections = polygonResults.ToArray(),
            ControlLocationDataCollection = controlLocationResult
        };
    }

    public string TestMe(string input)
    {
        throw new NotImplementedException();
    }
}
