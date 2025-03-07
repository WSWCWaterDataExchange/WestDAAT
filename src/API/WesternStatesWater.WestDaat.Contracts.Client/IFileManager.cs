using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Contracts.Client;

public interface IFileManager : IServiceContractBase
{
    Task<TResponse> GenerateFileSasToken<TRequest, TResponse>(TRequest request)
        where TRequest : FileSasTokenRequestBase
        where TResponse : FileSasTokenResponseBase;
}