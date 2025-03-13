namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationDocument
{
    public WaterConservationApplicationDocument()
    {
    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public string BlobName { get; set; } = null!;
    
    public string? Description { get; set; }

    public virtual WaterConservationApplication Application { get; set; } = null!;
}