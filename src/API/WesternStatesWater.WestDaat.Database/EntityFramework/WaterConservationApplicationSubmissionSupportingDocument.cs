namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionSupportingDocument
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public string BlobName { get; set; } = null!;

    public string Filename { get; set; } = null!;

    public string FileDescription { get; set; } = null!;
}
