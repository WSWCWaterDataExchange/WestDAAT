using Azure.Storage.Sas;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Contracts.Client;

public interface IFileManager : IServiceContractBase
{
    Task<TResponse> GenerateUploadFileSasToken<TRequest, TResponse>(TRequest request)
        where TRequest : FileSasTokenRequestBase
        where TResponse : FileSasTokenResponseBase;
    
    Task<TResponse> GenerateDownloadFileSasToken<TRequest, TResponse>(TRequest request)
        where TRequest : FileSasTokenRequestBase
        where TResponse : FileSasTokenResponseBase;
}