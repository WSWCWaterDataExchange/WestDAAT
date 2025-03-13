namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class ApplicationDocument
{
    public ApplicationDocument()
    {
    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public string BlobName { get; set; } = null!;
    
    public string? Description { get; set; }

    public virtual WaterConservationApplication Application { get; set; } = null!;
}