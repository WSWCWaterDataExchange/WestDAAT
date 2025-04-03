using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

[JsonDerivedType(typeof(WaterConservationApplicationSubmissionRequest), typeDiscriminator: nameof(WaterConservationApplicationSubmissionRequest))]
[JsonDerivedType(typeof(WaterConservationApplicationRecommendationRequest), typeDiscriminator: nameof(WaterConservationApplicationRecommendationRequest))]
[JsonDerivedType(typeof(ApplicantEstimateConsumptiveUseRequest), typeDiscriminator: nameof(ApplicantEstimateConsumptiveUseRequest))]
[JsonDerivedType(typeof(EstimateConsumptiveUseReviewerRequest), typeDiscriminator: nameof(EstimateConsumptiveUseReviewerRequest))]
public class ApplicationStoreRequestBase : RequestBase
{
}