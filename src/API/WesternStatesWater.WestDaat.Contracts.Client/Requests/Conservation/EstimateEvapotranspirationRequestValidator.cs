using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateEvapotranspirationRequestValidator : AbstractValidator<EstimateEvapotranspirationRequest>
{
    public EstimateEvapotranspirationRequestValidator()
    {
        RuleFor(x => x.FundingOrganizationId).NotEmpty();

        RuleFor(x => x.WaterConservationApplicationId); // optional

        RuleFor(x => x.Polygons).NotEmpty();
        RuleForEach(x => x.Polygons).ChildRules(polygonEntryValidator =>
        {
            polygonEntryValidator.RuleFor(polygon => polygon).NotEmpty();
        });

        RuleFor(x => x.Model).NotEmpty();

        RuleFor(x => x.DateRangeStart).NotEmpty();
        RuleFor(x => x.DateRangeEnd).NotEmpty();

        RuleFor(x => x.DateRangeEnd).GreaterThanOrEqualTo(x => x.DateRangeStart);

        // if one property is non-null, then they both must be non-null
        RuleFor(x => x.CompensationRateDollars).NotEmpty().When(x => x.Units.HasValue);
        RuleFor(x => x.Units).NotEmpty().When(x => x.CompensationRateDollars.HasValue);
    }
}
