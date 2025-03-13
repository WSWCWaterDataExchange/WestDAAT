namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class ApplicationDocumentFaker : Faker<EFWD.ApplicationDocument>
{
    public ApplicationDocumentFaker(EFWD.WaterConservationApplication application, EFWD.User user = null)
    {
        RuleFor(ad => ad.WaterConservationApplicationId, _ => application.Id);
        RuleFor(ad => ad.BlobName, f => $"{user?.Id ?? f.Random.Guid()}/{f.Random.Guid()}");
        RuleFor(ad => ad.Description, f => f.Lorem.Sentence());
    }
}