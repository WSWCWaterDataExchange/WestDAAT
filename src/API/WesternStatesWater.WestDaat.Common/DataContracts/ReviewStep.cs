namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ReviewStep
{
    public ReviewStepType ReviewStepType { get; set; }
    public ReviewStepStatus ReviewStepStatus { get; set; }
    public string ParticipantName { get; set; } = null!;
    public DateTimeOffset ReviewDate { get; set; }
}