using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

[JsonDerivedType(typeof(OrganizationApplicationDashboardLoadRequest), typeDiscriminator: nameof(OrganizationApplicationDashboardLoadRequest))]
[JsonDerivedType(typeof(ApplicantConservationApplicationLoadRequest), typeDiscriminator: nameof(ApplicantConservationApplicationLoadRequest))]
[JsonDerivedType(typeof(ReviewerConservationApplicationLoadRequest), typeDiscriminator: nameof(ReviewerConservationApplicationLoadRequest))]
public class ApplicationLoadRequestBase : RequestBase
{
}