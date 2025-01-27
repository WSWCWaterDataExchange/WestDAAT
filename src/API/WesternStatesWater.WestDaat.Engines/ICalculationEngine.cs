using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The CalculationEngine is responsible for performing data conversions,
/// computing payment formulas, net evapotranspiration, and other related computations.
/// </summary>
public interface ICalculationEngine : IServiceContractBase
{
    /// <summary>
    /// Calculate the total average evapotranspiration.
    /// </summary>
    /// <param name="request">The request containing the data points grouped by polygon.</param>
    /// <returns>The response containing the total average evapotranspiration.</returns>
    CalculateTotalAverageEvapotranspirationResponse CalculateTotalAverageEvapotranspiration(CalculateTotalAverageEvapotranspirationRequest request);
}