using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The ApplicationFormattingEngine is responsible for hydrating requests related to the
/// WaterConservationApplication feature.
/// </summary>
public interface IApplicationFormattingEngine : IServiceContractBase
{
    Task FormatStoreRequest(ApplicationStoreRequestBase request);
}
