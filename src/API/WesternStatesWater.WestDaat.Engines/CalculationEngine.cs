using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

internal class CalculationEngine : ICalculationEngine
{
    public Task<CalculateResponseBase> Calculate(CalculateRequestBase request)
    {
        return request switch
        {
            _ => throw new NotImplementedException()
        };
    }

    public string TestMe(string input)
    {
        throw new NotImplementedException();
    }
}
