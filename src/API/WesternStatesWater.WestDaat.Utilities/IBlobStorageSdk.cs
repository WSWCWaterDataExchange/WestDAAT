using System.IO;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IBlobStorageSdk
    {
        Task UploadAsync(string container, string blobName, Stream content, bool overwrite = false);
        Task CreateAndUploadAsync(string container, string blobName, Stream content, bool overwrite = false);
    }
}