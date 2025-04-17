using System.Text.Json.Serialization;
using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

[JsonDerivedType(typeof(WaterConservationApplicationSubmittedEvent), typeDiscriminator: nameof(WaterConservationApplicationSubmittedEvent))]
[JsonDerivedType(typeof(WaterConservationApplicationRecommendedEvent), typeDiscriminator: nameof(WaterConservationApplicationRecommendedEvent))]
[JsonDerivedType(typeof(WaterConservationApplicationApprovedEvent), typeDiscriminator: nameof(WaterConservationApplicationApprovedEvent))]
public abstract class WaterConservationApplicationStatusChangedEventBase : EventBase
{
    public Guid ApplicationId { get; set; }
}