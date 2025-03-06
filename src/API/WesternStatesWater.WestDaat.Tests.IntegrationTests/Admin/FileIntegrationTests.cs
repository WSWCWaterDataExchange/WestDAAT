using System.IO;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class FileIntegrationTests : IntegrationTestBase
{
    private IBlobStorageSdk _blobStorageSdk;

    [TestInitialize]
    public void TestInitialize()
    {
        _blobStorageSdk = Services.GetRequiredService<IBlobStorageSdk>();
    }

    [Ignore("Local test to verify emulator is working as expected")]
    [TestMethod]
    public async Task BlobStorageSdk_UploadAsync_SmokeTest()
    {
        // Arrange
        var stream = new MemoryStream("Hello, World!"u8.ToArray());

        // Act
        await _blobStorageSdk.UploadAsync(Containers.ApplicationDocuments, "test.txt", stream, overwrite: true);

        // Assert (Manually verify the file exists)
    }
}