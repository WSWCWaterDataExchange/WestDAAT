namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationStatusChangedEventBase
{
    public Guid ApplicationId { get; set; }

    public string ApprovalNote { get; set; }
}