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
            EstimateConservationPaymentRequest req => await EstimateConservationPayment(req),
            MultiPolygonYearlyEtRequest req => await CalculatePolygonsEt(req),
            _ => throw new NotImplementedException()
        };
    }

    private async Task<EstimateConservationPaymentResponse> EstimateConservationPayment(EstimateConservationPaymentRequest request)
    {
        return request.CompensationRateUnits switch
        {
            CompensationRateUnits.Acres => EstimateConservationPaymentInAcres(request),
            CompensationRateUnits.AcreFeet => await EstimateConservationPaymentInAcreFeet(request),
            _ => throw new NotImplementedException()
        };
    }

    private EstimateConservationPaymentResponse EstimateConservationPaymentInAcres(EstimateConservationPaymentRequest request)
    {
        // todo: how do we verify that the area is in acres?
        var totalArea = request.DataCollections
            .Select(dc => GeometryHelpers.GetGeometryByWkt(dc.PolygonWkt))
            .Sum(geometry => geometry.Area);

        var estimatedCompensation = totalArea * request.CompensationRateDollars;
        return new EstimateConservationPaymentResponse
        {
            EstimatedCompensationDollars = (int)estimatedCompensation
        };
    }

    private async Task<EstimateConservationPaymentResponse> EstimateConservationPaymentInAcreFeet(EstimateConservationPaymentRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }

    private async Task<MultiPolygonYearlyEtResponse> CalculatePolygonsEt(MultiPolygonYearlyEtRequest request)
    {
        var results = new List<PolygonEtDataCollection>();
        foreach (var polygonWkt in request.Polygons)
        {
            var polygonGeo = GeometryHelpers.GetGeometryByWkt(polygonWkt);

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
                .Select(grouping => new PolygonEtDatapoint { Year = grouping.Key, EtInInches = grouping.Sum(datum => datum.Evapotranspiration) })
                .ToArray();

            var averageEt = yearlyDatapoints.Average(d => d.EtInInches);

            var result = new PolygonEtDataCollection
            {
                PolygonWkt = polygonWkt,
                AverageEtInInches = averageEt,
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
