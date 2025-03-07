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

        private readonly bool _useStorageEmulator;

        public BlobStorageSdk(BlobStorageConfiguration configuration)
        {
            _useStorageEmulator = configuration.Uri == null;

            _client = _useStorageEmulator
                ? new BlobServiceClient("UseDevelopmentStorage=true") // If local
                : new BlobServiceClient(configuration.Uri); // If Azure
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
            return _useStorageEmulator
                ? await GetSasUrisForAzurite(container, blobNames, duration, blobContainerSasPermissions)
                : await GetSasUrisForAzure(container, blobNames, duration, blobContainerSasPermissions);
        }

        private async Task<Dictionary<string, Uri>> GetSasUrisForAzurite(string container, string[] blobNames, TimeSpan duration,
            BlobContainerSasPermissions blobContainerSasPermissions)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);

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

                var uri = blockBlobClient.GenerateSasUri(blobSasBuilder);

                values.Add(blobName, uri);
            }

            return await Task.FromResult(values);
        }

        private async Task<Dictionary<string, Uri>> GetSasUrisForAzure(string container, string[] blobNames, TimeSpan duration,
            BlobContainerSasPermissions blobContainerSasPermissions)
        {
            var blobContainerClient = _client.GetBlobContainerClient(container);
            var userDelegationKey =
                await _client.GetUserDelegationKeyAsync(DateTimeOffset.UtcNow.AddMinutes(-1),
                    DateTimeOffset.UtcNow.Add(duration));

            var values = new Dictionary<string, Uri>(blobNames.Length);

            foreach (var blobName in blobNames)
            {
                var blockBlobClient = blobContainerClient.GetBlockBlobClient(blobName);

                var blobSasBuilder = new BlobSasBuilder(blobContainerSasPermissions, DateTimeOffset.UtcNow.Add(duration))
                {
                    BlobContainerName = container,
                    BlobName = blobName,
                    Resource = "b" // b for Blob
                };

                var blobUriBuilder = new BlobUriBuilder(blockBlobClient.Uri)
                {
                    Sas = blobSasBuilder.ToSasQueryParameters(userDelegationKey, _client.AccountName)
                };

                values.Add(blobName, blobUriBuilder.ToUri());
            }

            return values;
        }

        string IBlobStorageSdk.BlobServiceHostname()
        {
            return _client.Uri.ToString().TrimEnd('/');
        }
    }
}