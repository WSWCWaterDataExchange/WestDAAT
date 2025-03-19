using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

[JsonDerivedType(typeof(OrganizationApplicationDashboardLoadResponse), typeDiscriminator: nameof(OrganizationApplicationDashboardLoadResponse))]
[JsonDerivedType(typeof(ApplicantConservationApplicationLoadResponse), typeDiscriminator: nameof(ApplicantConservationApplicationLoadResponse))]
[JsonDerivedType(typeof(ReviewerConservationApplicationLoadResponse), typeDiscriminator: nameof(ReviewerConservationApplicationLoadResponse))]
public class ApplicationLoadResponseBase : ResponseBase
{
}