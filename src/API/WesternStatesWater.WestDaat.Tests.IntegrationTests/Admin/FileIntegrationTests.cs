using System.IO;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class FileIntegrationTests : IntegrationTestBase
{
    private IBlobStorageSdk _blobStorageSdk;
    private CLI.IFileManager _fileManager;

    [TestInitialize]
    public void TestInitialize()
    {
        _blobStorageSdk = Services.GetRequiredService<IBlobStorageSdk>();
        _fileManager = Services.GetRequiredService<CLI.IFileManager>();
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
    
    [DataTestMethod]
    [DataRow(-1, DisplayName = "Should not allow a negative file count")]
    [DataRow(11, DisplayName = "Should not allow a negative file count")]
    public async Task GenerateFileSasToken_InvalidFileCount_ShouldThrow(int fileCount)
    {
        // Arrange
        var request = new ApplicationDocumentUploadSasTokenRequest
        {
            FileUploadCount = fileCount
        };
        
        // Act
        var response = await _fileManager.GenerateFileSasToken<ApplicationDocumentUploadSasTokenRequest, ApplicationDocumentUploadSasTokenResponse>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ValidationError>();
        ((ValidationError)response.Error)?.Errors.Should().ContainKey("FileUploadCount");
    }
    
    [TestMethod]
    public async Task GenerateFileSasToken_ShouldReturnSasToken()
    {
        // Arrange
        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var request = new ApplicationDocumentUploadSasTokenRequest
        {
            FileUploadCount = 1
        };
        
        // Act
        var response = await _fileManager.GenerateFileSasToken<ApplicationDocumentUploadSasTokenRequest, ApplicationDocumentUploadSasTokenResponse>(request);
        
        // Assert
        response.Error.Should().BeNull();
        response.Should().BeOfType<ApplicationDocumentUploadSasTokenResponse>();
        response.SasTokens.Length.Should().Be(1);
        response.SasTokens[0].Blobname.Should().NotBeNullOrEmpty();
        response.SasTokens[0].SasToken.Should().NotBeNullOrEmpty();
        response.SasTokens[0].Hostname.Should().NotBeNullOrEmpty();
    }
}