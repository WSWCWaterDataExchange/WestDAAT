using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.IO;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Utilities
{
    public sealed class BlobStorageSdk : IBlobStorageSdk
    {
        private readonly BlobServiceClient _client;

        public BlobStorageSdk(BlobStorageConfiguration configuration)
        {
            _client = configuration.Uri != null
                ? new BlobServiceClient(configuration.Uri) // If Azure
                : new BlobServiceClient("UseDevelopmentStorage=true"); // If local
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
        
        async Task<Dictionary<string, Uri>> IBlobStorageSdk.GetSasUris(string container, string[] blobNames, TimeSpan duration,
            BlobContainerSasPermissions blobContainerSasPermissions)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);
            var userDelegationKey = await _client.GetUserDelegationKeyAsync(DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.Add(duration));

            var values = new Dictionary<string, Uri>(blobNames.Length);

            foreach (var blobName in blobNames)
            {
                var blockBlobClient = blobContainerClient.GetBlockBlobClient(blobName);
                var blobSasBuilder = new BlobSasBuilder()
                {
                    BlobContainerName = container,
                    BlobName = blobName,
                    Resource = "b",
                    StartsOn = DateTimeOffset.UtcNow,
                    ExpiresOn = DateTimeOffset.UtcNow.Add(duration),
                };

                blobSasBuilder.SetPermissions(blobContainerSasPermissions);

                var uriBuilder = new BlobUriBuilder(blobContainerClient.Uri)
                {
                    Sas = blobSasBuilder.ToSasQueryParameters(
                        userDelegationKey,
                        blockBlobClient
                            .GetParentBlobContainerClient()
                            .GetParentBlobServiceClient()
                            .AccountName
                    )
                };

                values.Add(blobName, uriBuilder.ToUri());
            }

            return values;
        }
        
        string IBlobStorageSdk.BlobServiceHostname()
        {
            return _client.Uri.ToString().TrimEnd('/');
        }
    }
}