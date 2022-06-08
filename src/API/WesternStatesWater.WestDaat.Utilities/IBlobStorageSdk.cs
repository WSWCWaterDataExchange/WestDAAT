using System.IO;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IBlobStorageSdk
    {
        Task CreateContainerIfNotExistsAsync(string container);
        Task UploadAsync(string container, string blobName, Stream content, bool overwrite = false);
    }
}