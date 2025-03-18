namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDocumentDownloadRequest : ApplicationLoadRequestBase
{
    public Guid WaterConservationApplicationDocumentId { get; set; }
}