namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class InProgressApplicationExistsLoadRequest : ApplicationLoadRequestBase
{
    public Guid ApplicantUserId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;
}
