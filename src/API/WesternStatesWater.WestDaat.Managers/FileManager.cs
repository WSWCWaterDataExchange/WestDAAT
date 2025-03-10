using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers;

public sealed partial class AdminManager : IFileManager
{
    async Task<TResponse> IFileManager.GenerateFileSasToken<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }
}