using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.IO;
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
        async Task IBlobStorageSdk.CreateAndUploadAsync(string container, string blobName, Stream content, bool overwrite)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);
            await blobContainerClient.CreateIfNotExistsAsync();
            var blobClient = blobContainerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(content, overwrite);
        }

        async Task IBlobStorageSdk.UploadAsync(string container, string blobName, Stream content, bool overwrite)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);
            var blobClient = blobContainerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(content, overwrite);
        }
        
        async Task<Stream> IBlobStorageSdk.GetBlobStream(string container, string blobName, bool overwrite)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);
            var blobClient = blobContainerClient.GetBlobClient(blobName);

            return await blobClient.OpenWriteAsync(overwrite, options: new BlobOpenWriteOptions());
        }
    }
}