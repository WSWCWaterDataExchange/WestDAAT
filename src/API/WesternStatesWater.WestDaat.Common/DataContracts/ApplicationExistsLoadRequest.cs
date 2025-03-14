namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationExistsLoadRequest : ApplicationLoadRequestBase
{
    public Guid? ApplicationId { get; set; } = null!;

    public Guid? ApplicantUserId { get; set; } = null!;

    public string WaterRightNativeId { get; set; } = null!;

    public bool? HasSubmission { get; set; } = null!;
}
