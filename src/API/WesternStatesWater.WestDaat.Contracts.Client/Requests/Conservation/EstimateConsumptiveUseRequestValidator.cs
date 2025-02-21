using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateConsumptiveUseRequestValidator : AbstractValidator<EstimateConsumptiveUseRequest>
{
    public EstimateConsumptiveUseRequestValidator()
    {
        RuleFor(x => x.FundingOrganizationId).NotEmpty();

        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();

        RuleFor(x => x.WaterRightNativeId).NotEmpty();

        RuleFor(x => x.Polygons).NotEmpty().Must(polygons => polygons.Length <= 20);
        RuleForEach(x => x.Polygons).ChildRules(polygonEntryValidator =>
        {
            polygonEntryValidator.RuleFor(polygon => polygon).NotEmpty();
        });

        // if one property is non-null, then they both must be non-null
        RuleFor(x => x.CompensationRateDollars).NotEmpty().When(x => x.Units.HasValue);
        RuleFor(x => x.Units).NotEmpty().When(x => x.CompensationRateDollars.HasValue);
    }
}
