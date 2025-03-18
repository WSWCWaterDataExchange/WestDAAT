namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDocumentLoadSingleRequest : ApplicationLoadRequestBase
{
    public Guid WaterConservationApplicationDocumentId { get; set; }
}