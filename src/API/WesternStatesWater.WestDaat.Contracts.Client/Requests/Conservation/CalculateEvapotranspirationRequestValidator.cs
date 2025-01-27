using FluentValidation;
using NetTopologySuite.IO;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class CalculateEvapotranspirationRequestValidator : AbstractValidator<CalculateEvapotranspirationRequest>
{
    public CalculateEvapotranspirationRequestValidator()
    {
        RuleFor(x => x.Polygons).NotEmpty()
            .Must(polygons => polygons.All(polygon =>
            {
                try
                {
                    GeometryHelpers.GetGeometryByWkt(polygon);
                }
                catch (ParseException)
                {
                    return false;
                }

                return true;
            }));

        RuleFor(x => x.Model).NotEmpty();

        RuleFor(x => x.DateRangeStart).NotEmpty();
        RuleFor(x => x.DateRangeEnd).NotEmpty();

        RuleFor(x => x.DateRangeEnd).GreaterThanOrEqualTo(x => x.DateRangeStart);

        // if one property is non-null, then they both must be non-null
        RuleFor(x => x.DesiredCompensation).NotEmpty().When(x => x.Units.HasValue);
        RuleFor(x => x.Units).NotEmpty().When(x => x.DesiredCompensation.HasValue);
    }
}
