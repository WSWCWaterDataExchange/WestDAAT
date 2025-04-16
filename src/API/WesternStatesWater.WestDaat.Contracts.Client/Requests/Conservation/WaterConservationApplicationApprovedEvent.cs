namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationApprovedEvent : WaterConservationApplicationStatusChangedEventBase
{
    public string ApprovalNote { get; init; }
}