namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class SupportingDocumentDetails
{
    public Guid Id { get; set; }

    public string BlobName { get; set; } = null!;

    public string FileName { get; set; } = null!;

    public string Description { get; set; } = null!;
}
