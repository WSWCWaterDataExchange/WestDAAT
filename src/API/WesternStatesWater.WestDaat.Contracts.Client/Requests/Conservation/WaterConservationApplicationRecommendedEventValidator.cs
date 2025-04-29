using FluentValidation;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationRecommendedEventValidator : AbstractValidator<WaterConservationApplicationRecommendedEvent>
{
    public WaterConservationApplicationRecommendedEventValidator()
    {
        RuleFor(x => x.ApplicationId).NotEmpty();
    }
}