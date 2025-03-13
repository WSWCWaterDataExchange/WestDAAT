namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplication
{
    public WaterConservationApplication()
    {
        SupportingDocuments = new HashSet<WaterConservationApplicationDocument>();
    }

    public Guid Id { get; set; }

    public Guid ApplicantUserId { get; set; }

    public Guid FundingOrganizationId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

    public string ApplicationDisplayId { get; set; } = null!;

    public virtual User ApplicantUser { get; set; } = null!;

    public virtual Organization FundingOrganization { get; set; } = null!;

    public virtual WaterConservationApplicationEstimate? Estimate { get; set; } = null!;

    public virtual WaterConservationApplicationSubmission? Submission { get; set; } = null!;
    
    public virtual ICollection<WaterConservationApplicationDocument> SupportingDocuments { get; set; } = null!;
}