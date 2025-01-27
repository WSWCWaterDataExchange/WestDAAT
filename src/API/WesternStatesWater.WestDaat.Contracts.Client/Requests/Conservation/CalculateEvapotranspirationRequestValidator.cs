using FluentValidation;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class CalculateEvapotranspirationRequestValidator : AbstractValidator<CalculateEvapotranspirationRequest>
{
    public CalculateEvapotranspirationRequestValidator()
    {
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
        RuleFor(x => x.DesiredCompensation).NotEmpty().When(x => x.Units.HasValue);
        RuleFor(x => x.Units).NotEmpty().When(x => x.DesiredCompensation.HasValue);
    }
}
