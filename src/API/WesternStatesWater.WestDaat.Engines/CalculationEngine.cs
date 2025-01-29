using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

internal class CalculationEngine : ICalculationEngine
{
    public async Task<CalculateResponseBase> Calculate(CalculateRequestBase request)
    {
        return request switch
        {
            MultiPolygonSumEtRequest req => await CalculatePolygonsEt(req),
            _ => throw new NotImplementedException()
        };
    }

    private async Task<MultiPolygonSumEtResponse> CalculatePolygonsEt(MultiPolygonSumEtRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }

    public string TestMe(string input)
    {
        throw new NotImplementedException();
    }
}
