namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationDocuments : Faker<EFWD.WaterConservationApplicationDocument>
{
    public WaterConservationApplicationDocuments(EFWD.WaterConservationApplication application, EFWD.User user = null)
    {
        RuleFor(ad => ad.WaterConservationApplicationId, _ => application.Id);
        RuleFor(ad => ad.BlobName, f => $"{user?.Id ?? f.Random.Guid()}/{f.Random.Guid()}");
        RuleFor(ad => ad.FileName, f => $"{f.Random.String()}.pdf");
        RuleFor(ad => ad.Description, f => f.Lorem.Sentence());
    }
}