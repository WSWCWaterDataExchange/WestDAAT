using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

[JsonDerivedType(typeof(OrganizationApplicationDashboardLoadRequest), typeDiscriminator: nameof(OrganizationApplicationDashboardLoadRequest))]
public class ApplicationLoadRequestBase : RequestBase
{
}