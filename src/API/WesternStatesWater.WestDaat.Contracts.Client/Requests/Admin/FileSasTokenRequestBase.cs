using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

[JsonDerivedType(typeof(ApplicationDocumentDownloadSasTokenRequest), typeDiscriminator: nameof(ApplicationDocumentDownloadSasTokenRequest))]
[JsonDerivedType(typeof(ApplicationDocumentUploadSasTokenRequest), typeDiscriminator: nameof(ApplicationDocumentUploadSasTokenRequest))]
public class FileSasTokenRequestBase : RequestBase
{
}