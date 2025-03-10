using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The UserNameFormattingEngine is responsible for formatting username during account creation.
/// </summary>
public interface IUserNameFormattingEngine : IServiceContractBase
{
    Task<DTO.UserNameFormatResponseBase> Format(DTO.UserNameFormatRequestBase request);
}