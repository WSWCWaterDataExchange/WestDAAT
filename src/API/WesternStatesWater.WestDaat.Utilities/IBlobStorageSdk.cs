using System.IO;
using Azure.Storage.Sas;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IBlobStorageSdk
    {
        Task UploadAsync(string container, string blobName, Stream content, bool overwrite = false);
        Task CreateAndUploadAsync(string container, string blobName, Stream content, bool overwrite = false);
        Task<Stream> GetBlobStream(string container, string blobName, bool overwrite = false);
        Task<Dictionary<string, Uri>> GetSasUris(string container, string[] blobNames, TimeSpan duration, BlobContainerSasPermissions blobContainerSasPermissions);
        string BlobServiceHostname();
    }
}