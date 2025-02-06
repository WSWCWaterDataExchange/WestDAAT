using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The ApplicationFormattingEngine is responsible for formatting operations related to the
/// WaterConservationApplication feature. Examples include the Application's display id.
/// </summary>
public interface IApplicationFormattingEngine : IServiceContractBase
{
    Task<ApplicationFormatResponseBase> Format(ApplicationFormatRequestBase request);
}
