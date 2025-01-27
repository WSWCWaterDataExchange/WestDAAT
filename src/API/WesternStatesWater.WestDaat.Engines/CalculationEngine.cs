using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

internal class CalculationEngine : ICalculationEngine
{
    public CalculateTotalAverageEvapotranspirationResponse CalculateTotalAverageEvapotranspiration(CalculateTotalAverageEvapotranspirationRequest request)
    {
        var averageEtPerGroup = request.Details
            .Select(etDetails => etDetails.Data.Average(et => et.Evapotranspiration));

        var totalAverageEt = averageEtPerGroup.Sum();

        return new CalculateTotalAverageEvapotranspirationResponse
        {
            TotalAverageEvapotranspiration = totalAverageEt,
        };
    }

    public string TestMe(string input)
    {
        throw new NotImplementedException();
    }
}
