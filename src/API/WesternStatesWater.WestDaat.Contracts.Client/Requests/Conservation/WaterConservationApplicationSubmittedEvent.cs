using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationSubmittedEvent : EventBase
{
    public Guid ApplicationId { get; set; }
}