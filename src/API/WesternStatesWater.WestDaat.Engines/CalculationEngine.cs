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
            var averageEtInFeet = collection.AverageYearlyTotalEtInInches / 12;
            var averageEtInAcreFeet = averageEtInFeet * acreage;
            estimatedCompensation += averageEtInAcreFeet * request.CompensationRateDollars;
        }

        return new EstimateConservationPaymentResponse
        {
            EstimatedCompensationDollars = (int)estimatedCompensation
        };
    }

    private async Task<MultiPolygonYearlyEtResponse> CalculatePolygonsEt(MultiPolygonYearlyEtRequest request)
    {
        var results = new List<PolygonEtDataCollection>();
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
                .Select(grouping => new PolygonEtDatapoint { Year = grouping.Key, TotalEtInInches = grouping.Sum(datum => datum.Evapotranspiration) })
                .ToArray();

            var averageEtInInches = yearlyDatapoints.Average(d => d.TotalEtInInches);
            var averageEtInFeet = averageEtInInches / 12;

            var polygonAreaInAcres = GeometryHelpers.GetGeometryAreaInAcres(polygonGeo);
            var averageEtInAcreFeet = averageEtInFeet * polygonAreaInAcres;

            var result = new PolygonEtDataCollection
            {
                PolygonWkt = polygon.PolygonWkt,
                DrawToolType = polygon.DrawToolType,
                AverageYearlyTotalEtInInches = averageEtInInches,
                AverageYearlyTotalEtInAcreFeet = averageEtInAcreFeet,
                Datapoints = yearlyDatapoints
            };
            results.Add(result);
        }

        return new MultiPolygonYearlyEtResponse
        {
            DataCollections = results.ToArray()
        };
    }

    public string TestMe(string input)
    {
        throw new NotImplementedException();
    }
}
