using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The UsernameFormattingEngine is responsible for formatting username during account creation.
/// </summary>
public interface IUsernameFormattingEngine : IServiceContractBase
{
    Task<DTO.UsernameFormatResponseBase> Format(DTO.UsernameFormatRequestBase request);
}