namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationDocument
{
    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public string BlobName { get; set; } = null!;
    
    /// <summary>
    /// The uploaded file name - used for displaying to the user.
    /// </summary>
    public string FileName { get; set; } = null!;
    
    public string Description { get; set; }
}