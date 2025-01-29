using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The CalculationEngine is responsible for performing data conversions,
/// computing payment formulas, net evapotranspiration, and other related computations.
/// </summary>
public interface ICalculationEngine : IServiceContractBase
{
    Task<CalculateResponseBase> Calculate(CalculateRequestBase request);
}