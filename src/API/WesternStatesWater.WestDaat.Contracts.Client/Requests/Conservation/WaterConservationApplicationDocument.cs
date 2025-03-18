namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationDocument
{
    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public string BlobName { get; set; }
    
    /// <summary>
    /// The uploaded file name - used for displaying to the user.
    /// </summary>
    public string FileName { get; set; }
    
    public string Description { get; set; }
}