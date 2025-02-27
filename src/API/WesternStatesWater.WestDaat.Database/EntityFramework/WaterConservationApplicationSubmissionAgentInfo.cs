namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionAgentInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public string AgentFirstName { get; set; } = null!;

    public string AgentLastName { get; set; } = null!;

    public string AgentEmail { get; set; } = null!;

    public string AgentPhoneNumber { get; set; } = null!;
}
