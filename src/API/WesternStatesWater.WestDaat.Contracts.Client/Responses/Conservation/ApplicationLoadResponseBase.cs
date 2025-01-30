using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

[JsonDerivedType(typeof(OrganizationApplicationDashboardLoadResponse), typeDiscriminator: nameof(OrganizationApplicationDashboardLoadResponse))]
public class ApplicationLoadResponseBase : ResponseBase
{
}