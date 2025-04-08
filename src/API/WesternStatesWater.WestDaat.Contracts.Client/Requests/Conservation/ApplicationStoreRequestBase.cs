using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

[JsonDerivedType(typeof(WaterConservationApplicationApprovalRequest), typeDiscriminator: nameof(WaterConservationApplicationApprovalRequest))]
[JsonDerivedType(typeof(WaterConservationApplicationSubmissionRequest), typeDiscriminator: nameof(WaterConservationApplicationSubmissionRequest))]
[JsonDerivedType(typeof(WaterConservationApplicationRecommendationRequest), typeDiscriminator: nameof(WaterConservationApplicationRecommendationRequest))]
[JsonDerivedType(typeof(ApplicantEstimateConsumptiveUseRequest), typeDiscriminator: nameof(ApplicantEstimateConsumptiveUseRequest))]
public class ApplicationStoreRequestBase : RequestBase
{
}