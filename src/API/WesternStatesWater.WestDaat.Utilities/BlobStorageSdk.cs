using System.IO;
using Azure.Storage.Blobs;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Utilities
{
    public sealed class BlobStorageSdk : IBlobStorageSdk
    {
        private readonly BlobServiceClient _client;

        public BlobStorageSdk(BlobStorageConfiguration configuration)
        {
            _client = new BlobServiceClient(configuration.ConnectionString);
        }

        async Task IBlobStorageSdk.CreateContainerIfNotExistsAsync(string container)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);
            await blobContainerClient.CreateIfNotExistsAsync();
        }

        async Task IBlobStorageSdk.UploadAsync(string container, string blobName, Stream content, bool overwrite)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);
            await blobContainerClient.CreateIfNotExistsAsync();
            var blobClient = blobContainerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(content, overwrite);
        }
    }
}