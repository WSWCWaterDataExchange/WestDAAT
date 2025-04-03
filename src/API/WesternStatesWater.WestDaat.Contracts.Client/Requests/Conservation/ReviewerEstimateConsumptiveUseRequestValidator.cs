using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class ReviewerEstimateConsumptiveUseRequestValidator : AbstractValidator<ReviewerEstimateConsumptiveUseRequest>
{
    public ReviewerEstimateConsumptiveUseRequestValidator()
    {
        RuleFor(x => x.WaterConservationApplicationId).NotEmpty();

        RuleFor(x => x.Polygons).NotEmpty().Must(polygons => polygons.Length <= 20);
        RuleForEach(x => x.Polygons).ChildRules(polygonEntryValidator =>
        {
            polygonEntryValidator.RuleFor(polygon => polygon).NotNull();
            polygonEntryValidator.RuleFor(polygon => polygon.PolygonWkt).NotEmpty();
            polygonEntryValidator.RuleFor(polygon => polygon.DrawToolType).NotEmpty();
        });

        RuleFor(x => x.ControlLocation).NotEmpty();
        RuleFor(x => x.ControlLocation.PointWkt).NotEmpty().MaximumLength(100).Must(pointWkt => pointWkt.Contains("POINT"));
    }
}
