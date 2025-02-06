using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateConsumptiveUseRequestValidator : AbstractValidator<EstimateConsumptiveUseRequest>
{
    public EstimateConsumptiveUseRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();

        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();

        RuleFor(x => x.Polygons).NotEmpty().Must(polygons => polygons.Length <= 20);
        RuleForEach(x => x.Polygons).ChildRules(polygonEntryValidator =>
        {
            polygonEntryValidator.RuleFor(polygon => polygon).NotEmpty();
        });

        RuleFor(x => x.Model).NotEmpty();

        RuleFor(x => x.DateRangeStart).NotEmpty().LessThanOrEqualTo(x => x.DateRangeEnd);
        RuleFor(x => x.DateRangeEnd).NotEmpty().GreaterThanOrEqualTo(x => x.DateRangeStart);

        // if one property is non-null, then they both must be non-null
        RuleFor(x => x.CompensationRateDollars).NotEmpty().When(x => x.Units.HasValue);
        RuleFor(x => x.Units).NotEmpty().When(x => x.CompensationRateDollars.HasValue);
    }
}
