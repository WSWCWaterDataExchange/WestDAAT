namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationSupportingDocumentExistsRequest : ApplicationLoadRequestBase
{
    public Guid WaterConservationApplicationDocumentId { get; set; }
}