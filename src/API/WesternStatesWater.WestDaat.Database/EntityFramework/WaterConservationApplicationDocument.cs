namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationDocument
{
    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public string BlobName { get; set; }
    
    /// <summary>
    /// The uploaded file name - used for displaying to the user.
    /// </summary>
    public string FileName { get; set; }
    
    public string? Description { get; set; }

    public virtual WaterConservationApplication WaterConservationApplication { get; set; }
}