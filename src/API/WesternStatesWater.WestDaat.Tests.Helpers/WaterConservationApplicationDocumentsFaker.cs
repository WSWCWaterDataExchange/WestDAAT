namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationDocumentsFaker : Faker<EFWD.WaterConservationApplicationDocument>
{
    public WaterConservationApplicationDocumentsFaker(EFWD.WaterConservationApplication application, EFWD.User user = null)
    {
        RuleFor(ad => ad.WaterConservationApplicationId, _ => application.Id);
        RuleFor(ad => ad.BlobName, f => $"{user?.Id ?? f.Random.Guid()}/{f.Random.Guid()}");
        RuleFor(ad => ad.FileName, f => f.System.FileName(ext: "pdf"));
        RuleFor(ad => ad.Description, f => f.Lorem.Sentence());
        RuleFor(ad => ad.WaterConservationApplication, _ => application);
    }
}