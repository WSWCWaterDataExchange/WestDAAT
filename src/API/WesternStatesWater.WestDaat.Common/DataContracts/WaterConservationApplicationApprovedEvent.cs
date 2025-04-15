namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationApprovedEvent : WaterConservationApplicationStatusChangedEventBase
{
    public string ApprovalNote { get; set; }
}