namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UnsubmittedApplicationExistsLoadRequest : ApplicationLoadRequestBase
{
    public Guid ApplicantUserId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;
}
