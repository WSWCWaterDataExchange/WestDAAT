using System.IO;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class FileIntegrationTests : IntegrationTestBase
{
    private IBlobStorageSdk _blobStorageSdk;
    private CLI.IFileManager _fileManager;
    private WestDaatDatabaseContext _dbContext;

    [TestInitialize]
    public void TestInitialize()
    {
        _blobStorageSdk = Services.GetRequiredService<IBlobStorageSdk>();
        _fileManager = Services.GetRequiredService<CLI.IFileManager>();
        _dbContext = Services.GetRequiredService<IWestDaatDatabaseContextFactory>().Create();
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
    public async Task GenerateUploadFileSasToken_InvalidFileCount_ShouldThrow(int fileCount)
    {
        // Arrange
        var request = new ApplicationDocumentUploadSasTokenRequest
        {
            FileUploadCount = fileCount
        };

        // Act
        var response = await _fileManager.GenerateUploadFileSasToken<ApplicationDocumentUploadSasTokenRequest, ApplicationDocumentUploadSasTokenResponse>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ValidationError>();
        ((ValidationError)response.Error)?.Errors.Should().ContainKey("FileUploadCount");
    }

    [TestMethod]
    public async Task GenerateUploadFileSasToken_ShouldReturnSasToken()
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
        var response = await _fileManager.GenerateUploadFileSasToken<ApplicationDocumentUploadSasTokenRequest, ApplicationDocumentUploadSasTokenResponse>(request);

        // Assert
        response.Error.Should().BeNull();
        response.Should().BeOfType<ApplicationDocumentUploadSasTokenResponse>();
        response.SasTokens.Length.Should().Be(1);
        response.SasTokens[0].Blobname.Should().NotBeNullOrEmpty();
        response.SasTokens[0].SasToken.Should().NotBeNullOrEmpty();
        response.SasTokens[0].Hostname.Should().NotBeNullOrEmpty();
    }

    [TestMethod]
    public async Task GenerateDownloadFileSasToken_ShouldReturnSasUrl()
    {
        // Arrange
        UseUserContext(new UserContext()
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();
        var document = new WaterConservationApplicationDocumentsFaker(application, user).Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationDocuments.AddAsync(document);
        await _dbContext.SaveChangesAsync();

        var request = new ApplicationDocumentDownloadSasTokenRequest
        {
            WaterConservationApplicationDocumentId = document.Id
        };

        // Act
        var response = await _fileManager.GenerateDownloadFileSasToken<ApplicationDocumentDownloadSasTokenRequest, ApplicationDocumentDownloadSasTokenResponse>(request);

        // Assert
        response.Error.Should().BeNull();
        response.FileName.Should().BeEquivalentTo(document.FileName);
        response.SasToken.Should().Contain(document.BlobName);
    }

    [DataTestMethod]
    [DataRow(false, DisplayName = "Should not allow an applicant to download a document that belongs to an application that isn't theirs")]
    [DataRow(true, DisplayName = "Should not allow an organization's application reviewer to download a document that belongs to an application that isn't for their organization")]
    public async Task GenerateDownloadFileSasToken_InvalidPermissions_ShouldThrow(bool isOrgReviewer)
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();
        var document = new WaterConservationApplicationDocumentsFaker(application, user).Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationDocuments.AddAsync(document);
        await _dbContext.SaveChangesAsync();
        
        var differentOrgAdmin = new OrganizationRole
        {
            OrganizationId = Guid.NewGuid(),
            RoleNames = [Roles.OrganizationAdmin]
        };
        
        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [],
            OrganizationRoles = isOrgReviewer ? [differentOrgAdmin] : [],
            ExternalAuthId = ""
        });

        var request = new ApplicationDocumentDownloadSasTokenRequest
        {
            WaterConservationApplicationDocumentId = document.Id
        };

        // Act
        var response = await _fileManager.GenerateDownloadFileSasToken<ApplicationDocumentDownloadSasTokenRequest, ApplicationDocumentDownloadSasTokenResponse>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ForbiddenError>();
    }

    [TestMethod]
    public async Task GenerateDownloadFileSasToken_DocumentNotFound_ShouldThrow()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();
        var document = new WaterConservationApplicationDocumentsFaker(application, user).Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationDocuments.AddAsync(document);
        await _dbContext.SaveChangesAsync();
        
        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var request = new ApplicationDocumentDownloadSasTokenRequest
        {
            WaterConservationApplicationDocumentId = Guid.NewGuid()
        };

        // Act
        var response = await _fileManager.GenerateDownloadFileSasToken<ApplicationDocumentDownloadSasTokenRequest, ApplicationDocumentDownloadSasTokenResponse>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<NotFoundError>();  
    }
}